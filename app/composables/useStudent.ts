import type { Database } from '~/types/database.types'
import { useCashier } from './useCashier'

export function useStudent() {
  const { supabase, user, showError, showSuccess } = useCashier()

  async function fetchBalance(student_number: string) {
    const { data, error } = await supabase
      .from('students')
      .select('balance')
      .eq('student_number', student_number)

    if (error) {
      showError(error.message)
      return null
    }
    if (data.length == 0) {
      showError('ID does not exist!')
    }
    return data?.at(0)?.balance ?? null
  }

  async function purchase(student_number: string, amount: number, currentBalance: number) {
    const newBalance = currentBalance - amount

    const { error } = await supabase
      .from('students')
      .update({ balance: newBalance })
      .eq('student_number', student_number)

    if (error) {
      showError(error.message)
      return false
    }

    const transactionError = await recordTransaction(student_number, amount, 'purchase')
    if (transactionError) return false

    showSuccess(`${amount} successfully deducted from ${student_number}.`)
    return true
  }

  type TRANSACTION_TYPE = Database['public']['Enums']['transaction_type']
  async function recordTransaction(
    student_id: string,
    amount: number,
    transction_type: TRANSACTION_TYPE
  ) {
    const { error } = await supabase.from('transactions').insert({
      amount: amount * -1,
      cashier_id: parseInt(user.value!.id),
      student_id,
    })
    if (error) {
      showError(error.message)
      return error
    }
    return null
  }
  async function fetchStudentDetails(student_id: string) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('student_number', student_id)
      .single()

    if (!error) {
      return data
    }
  }

  return { fetchBalance, purchase, fetchStudentDetails }
}
