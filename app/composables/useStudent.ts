import type { Database } from '~/types/database.types'
import { useCashier } from './useCashier'
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript'

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

  async function purchase(
    student_number: string,
    amount: number,
    currentBalance: number,
    cashier_id: number
  ) {
    const newBalance = currentBalance - amount

    const { error } = await supabase
      .from('students')
      .update({ balance: newBalance })
      .eq('student_number', student_number)

    if (error) {
      showError(error.message)
      return false
    }

    const transactionError = await recordTransaction({
      student_number,
      amount,
      transaction_type: 'purchase',
      cashier_id,
    })
    if (transactionError) return false

    showSuccess(`${amount} successfully deducted from ${student_number}.`)
    return true
  }

  type TRANSACTION_TYPE = Database['public']['Enums']['transaction_type']
  async function recordTransaction(options: {
    student_number: string
    amount: number
    transaction_type: TRANSACTION_TYPE
    cashier_id: number
  }) {
    const { error } = await supabase.from('transactions').insert({
      amount: options.amount,
      cashier_id: options.cashier_id,
      student_number: options.student_number,
      transaction_type: options.transaction_type,
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
  async function fetchAllStudents() {
    const { data, error } = await supabase.from('students').select('*')
    if (!error) {
      return data
    }
  }
  // transaction number refers to the id of the transasction in the transaction table
  async function refund(options: { transaction_number: number; student_number: string }) {
    // Step 1: Check if transaction exists and not refunded
    const { data: txData, error: txError } = await supabase
      .from('transactions')
      .select('amount, refunded')
      .eq('id', options.transaction_number)
      .eq('student_number', options.student_number)
      .single()

    if (txError) {
      showError(txError.message)
      return
    }

    if (!txData) {
      showError('No record found!')
      return
    }

    if (txData.refunded) {
      showError('This transaction has already been refunded!')
      return
    }

    // Step 2: Update student balance
    const balance = await fetchBalance(options.student_number)
    const amount = txData.amount

    if (balance == null || amount == null) {
      showError('Refund failed due to missing balance or amount!')
      return
    }

    const newBalance = balance + amount
    const { error: updateError } = await supabase
      .from('students')
      .update({ balance: newBalance })
      .eq('student_number', options.student_number)

    if (updateError) {
      showError(updateError.message)
      return
    }

    // Step 3: Mark transaction as refunded
    const { error: markRefundError } = await supabase
      .from('transactions')
      .update({ refunded: true })
      .eq('id', options.transaction_number)

    if (markRefundError) {
      showError(markRefundError.message)
      return
    }

    // // Step 4: Record refund transaction
    // const cashierId = await getCashierId(user.value?.email!)
    // const transactionError = await recordTransaction({
    //   amount,
    //   cashier_id: cashierId!,
    //   student_number: options.student_number,
    //   transaction_type: 'refund',
    // })
    // if (transactionError) return

    showSuccess(`₱${amount} has been refunded to Student: ${options.student_number}`)
  }
  return { fetchBalance, purchase, refund, fetchStudentDetails, fetchAllStudents, recordTransaction }
}
