export function useStudentBalance() {
  const client = useSupabaseClient()

  /**
   * Get student by student_number
   */
  const getStudent = async (studentNumber: string) => {
    const { data, error } = await client
      .from('students')
      .select('*')
      .eq('student_number', studentNumber)
      .single()

    if (error) throw error
    return data
  }

  /**
   * Deposit balance
   */
  const deposit = async (studentNumber: string, amount: number) => {
    if (amount <= 0) {
      throw new Error('Deposit amount must be greater than zero')
    }

    // Fetch current balance
    const student = await getStudent(studentNumber)
    const newBalance = Number(student.balance || 0) + amount

    const { data, error } = await client
      .from('students')
      .update({ balance: newBalance })
      .eq('student_number', studentNumber)
      .select()
      .single()

    if (error) throw error
    return data
  }

  /**
   * Withdraw balance
   */
  const withdraw = async (studentNumber: string, amount: number) => {
    if (amount <= 0) {
      throw new Error('Withdraw amount must be greater than zero')
    }

    const student = await getStudent(studentNumber)
    const currentBalance = Number(student.balance || 0)

    if (currentBalance < amount) {
      throw new Error('Insufficient balance')
    }

    const newBalance = currentBalance - amount

    const { data, error } = await client
      .from('students')
      .update({ balance: newBalance })
      .eq('student_number', studentNumber)
      .select()
      .single()

    if (error) throw error
    return data
  }

  return {
    getStudent,
    deposit,
    withdraw,
  }
}
