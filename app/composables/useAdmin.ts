import Cashier from '~/pages/cashier.vue'
import type { Database } from '~/types/database.types'

export function useAdmin() {
  const supabase = useSupabaseClient()
  enum UserRole {
    Admin = 'admin',
    Student = 'student',
    Cashier = 'cashier',
  }
  // table schema for cashier
  type Cashier = Database['public']['Tables']['cashiers']['Row']
  // exclude id and created at and include a password
  type CashierInput = Omit<Cashier, 'id' | 'created_at'> & { password: string }

  const toast = useToast()
  async function fetchTransactions() {
    const { data, error } = await supabase.from('transactions').select('*')
    if (error) {
      showError(error.message)
    } else {
      return data
    }
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

  function showError(message: string) {
    toast.add({ title: 'Error', description: message, color: 'error' })
  }
  function showSuccess(message: string) {
    toast.add({ title: 'Success', description: message, color: 'success' })
  }
  return { fetchTransactions, registerCashier, showError, Cashier }
}
