import type { isReturnStatement } from 'typescript'
import Cashier from '~/pages/cashier.vue'
import type { Database } from '~/types/database.types'
import * as z from 'zod'

export function useAdmin() {
  const supabase = useSupabaseClient<Database>()
  const { recordTransaction } = useStudent()
  enum UserRole {
    Admin = 'admin',
    Student = 'student',
    Cashier = 'cashier',
  }
  // table schema for cashier
  type Cashier = Database['public']['Tables']['cashiers']['Row']
  // exclude id and created at and include a password
  type CashierInput = Omit<Cashier, 'id' | 'created_at'> & { password: string }

  type Student = Database['public']['Tables']['students']['Row']
  type StudentInput = Omit<Student, 'id' | 'created_at'> & { password: string }

  const TransactionSchema = z.object({
    student_number: z.string().nullable(),
    amount: z.number().nullable(),
    transaction_type: z.string().nullable(),
    cashier_id: z.number().nullable(),
    refunded: z.boolean().nullable(),
    student: z
      .object({
        first_name: z.string(),
        middle_name: z.string().nullable(),
        last_name: z.string(),
        suffix: z.string().nullable(),
      })
      .nullable(),
  })

  const toast = useToast()
  async function fetchTransactions() {
    return await useAsyncData('transactions', async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select(
          `*,
          student:students (*)
          `,
        )
        .order('id', { ascending: false })

      if (error) throw error

      const parsed = z.array(TransactionSchema).parse(data)

      // Compute student full name and format data
      return parsed.map((t) => ({
        student_number: t.student_number ?? '—',
        student_name: t.student
          ? [t.student.first_name, t.student.middle_name, t.student.last_name, t.student.suffix]
              .filter(Boolean)
              .join(' ')
          : 'Unknown',
        amount: t.amount ?? 0,
        cashier_id: t.cashier_id ?? '—',
        transaction_type: t.transaction_type ?? '—',
        refunded: t.refunded ? 'Yes' : 'No',
      }))
    })
  }

  async function registerCashier(cashier: CashierInput) {
    // Step 1: Register the user via Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: cashier.email ?? '',
      password: cashier.password,
      options: {
        data: {
          // set the role to cashier for
          role: UserRole.Cashier,
        },
      },
    })

    if (signUpError) {
      showError(signUpError.message)
      return { success: false, error: signUpError }
    }

    // Step 2: Insert into "cashiers" table
    const { error: insertError } = await supabase.from('cashiers').insert({
      email: cashier.email,
      first_name: cashier.first_name,
      last_name: cashier.last_name,
      middle_name: cashier.middle_name,
      suffix: cashier.suffix,
    })

    if (insertError) {
      showError(insertError.message)
      return { success: false, error: insertError }
    }
    showSuccess('Account successfully created!')
    return { success: true, user: authData.user }
  }

  async function registerStudent(input: StudentInput) {
    // sign up a student
    const { error: authError, data: authData } = await supabase.auth.signUp({
      email: input.email ?? '',
      password: input.password,
      options: {
        data: { role: UserRole.Student },
      },
    })
    if (authError) {
      showError(authError.message)
      return { success: false, error: authError }
    }
    // record student to database
    const { error: insertError } = await supabase.from('students').insert({
      first_name: input.first_name,
      middle_name: input.middle_name,
      suffix: input.suffix,
      last_name: input.last_name,
      student_number: input.student_number,
      balance: input.balance,
      email: authData.user?.email,
      gender: input.gender,
      date_of_birth: input.date_of_birth,
    })

    if (insertError) {
      showError(insertError.message)
      return { success: false, error: insertError }
    }

    showSuccess('Account successfully created!')
    return { success: true, user: authData.user }
  }
  function parseDate(input: string): Date | null {
    const parts = input.split('/') // split by "/"
    if (parts.length !== 3) return null

    const [year, month, day] = parts.map(Number)

    // Basic validation
    if (!year || !month || !day) return null

    return new Date(year, month - 1, day) // month is 0-based
  }
  async function deposit(options: { student_number: string; amount: number }) {
    if (options.amount < 0) {
      showError('Amount should be positive integers only!')
      return
    }
    // get currentBalance
    const { error: selectError, data: selectData } = await supabase
      .from('students')
      .select('*')
      .eq('student_number', options.student_number)
      .maybeSingle()
    if (selectError) {
      showError(selectError.message)
      return
    } else if (!selectData) {
      showError('No student found')
      return
    }
    // add the amount to current balance
    const { data, error } = await supabase
      .from('students')
      .update({ balance: (selectData.balance ?? 0) + options.amount })
      .eq('student_number', selectData.student_number)
    if (error) {
      showError(error.message)
      return
    }
    showSuccess('Balance updated!')
  }

  async function withraw(options: { student_number: string; amount: number }) {
    if (options.amount < 0) {
      showError('Amount should be positive integers only!')
      return
    }
    // get student details
    const { error: selectError, data: selectData } = await supabase
      .from('students')
      .select('*')
      .eq('student_number', options.student_number)
      .maybeSingle()
    if (selectError) {
      showError(selectError.message)
      return
    } else if (!selectData) {
      showError('No student found')
      return
    }

    // withraw amount if its greater than current balance
    if (selectData.balance == null) {
      showError('Balance is empty!')
      return
    }
    if (selectData.balance < options.amount) {
      showError('Balance not enough!')
      return
    }

    const { data, error } = await supabase
      .from('students')
      .update({ balance: (selectData.balance ?? 0) - options.amount })
      .eq('student_number', selectData.student_number)
    if (error) {
      showError(error.message)
      return
    }
    showSuccess('Balance updated!')
  }

  async function deleteStudent(student_number: string) {
    // check if there is balance first before deleting student
    const { error: selectError, data: selectData } = await supabase
      .from('students')
      .select('*')
      .eq('student_number', student_number)
      .maybeSingle()
    if (selectError) {
      showError(selectError.message)
      return
    } else if (!selectData) {
      showError('No student found')
      return
    }

    if (selectData.balance != null && selectData.balance > 0) {
      showError('Unable to delete user, withraw the remaining balance first.')
      return
    }

    const { error } = await supabase.from('students').delete().eq('student_number', student_number)
    if (error) {
      showError(error.message)
      return
    }

    await supabase.auth.admin.deleteUser('')
  }

  function showError(message: string) {
    toast.add({ title: 'Error', description: message, color: 'error' })
  }
  function showSuccess(message: string) {
    toast.add({ title: 'Success', description: message, color: 'success' })
  }

  return {
    fetchTransactions,
    registerCashier,
    registerStudent,
    showError,
    Cashier,
    deposit,
    withraw,
    TransactionSchema,
  }
}
