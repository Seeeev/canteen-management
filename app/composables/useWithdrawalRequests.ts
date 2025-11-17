// composables/useWithdrawalRequests.ts
export const useWithdrawalRequests = () => {
  const client = useSupabaseClient()
  const { recordTransaction } = useStudent()

  const fetchRequests = async (options?: {
    search?: string
    status?: string
    page?: number
    pageSize?: number
  }) => {
    let query = client.from('withdrawal_requests').select('*')

    if (options?.search) {
      query = query.ilike('student_number', `%${options.search}%`)
    }

    if (options?.status) {
      query = query.eq('status', options.status)
    }

    if (options?.page && options?.pageSize) {
      const from = (options.page - 1) * options.pageSize
      const to = from + options.pageSize - 1
      query = query.range(from, to)
    }

    const { data, error } = await query.order('requested_at', { ascending: false })
    if (error) throw error

    return data
  }

  const approveRequest = async (id: number) => {
    const client = useSupabaseClient()

    // 1️⃣ Get the withdrawal request first
    const { data: request, error: fetchError } = await client
      .from('withdrawal_requests')
      .select('id, amount, status, student_number')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError
    if (!request) throw new Error('Withdrawal request not found')
    if (request.status !== 'pending') throw new Error('Request is not pending')

    if (!request.student_number) throw new Error('Withdrawal request has no student number')

    // 2️⃣ Get the student record
    const { data: student, error: studentError } = await client
      .from('students')
      .select('id, balance')
      .eq('student_number', request.student_number)
      .single()

    if (studentError) throw studentError
    if (!student) throw new Error('Student not found')

    const newBalance = (student.balance || 0) - Number(request.amount)
    if (newBalance < 0) throw new Error('Insufficient balance')

    // 3️⃣ Update student balance
    const { error: updateStudentError } = await client
      .from('students')
      .update({ balance: newBalance })
      .eq('id', student.id)

    if (updateStudentError) throw updateStudentError

    // Record the transaction
    await recordTransaction({
      amount: request.amount,
      transaction_type: 'withdraw',
      cashier_id: 4,
      student_number: request.student_number,
    })

    // 4️⃣ Update withdrawal request status
    const { data: updatedRequest, error: updateRequestError } = await client
      .from('withdrawal_requests')
      .update({ status: 'approved', approved_at: new Date().toISOString() })
      .eq('id', id)
      .single()

    if (updateRequestError) throw updateRequestError

    return updatedRequest
  }

  const rejectRequest = async (id: number, notes: string) => {
    const { data, error } = await client
      .from('withdrawal_requests')
      .update({ status: 'rejected', rejected_at: new Date().toISOString(), notes })
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }

  return { fetchRequests, approveRequest, rejectRequest }
}
