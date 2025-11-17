import { useSupabaseClient } from '#imports'

export function useTransactionReport() {
  const client = useSupabaseClient()

  async function fetchReport(year: number, month: number) {
    const start = new Date(year, month - 1, 1)
    const end = new Date(year, month, 1)

    const { data, error } = await client
      .from('transactions')
      .select('student_number, amount, created_at, transaction_type') // <- include transaction_type
      .gte('created_at', start.toISOString())
      .lt('created_at', end.toISOString())
      .eq('refunded', false)
      .order('created_at', { ascending: true })

    if (error) throw error

    const rows =
      data?.map((t) => ({
        student_number: t.student_number || 'Unknown',
        amount: Number(t.amount || 0),
        created_at: t.created_at,
        transaction_type: t.transaction_type || 'deposit', // default if null
      })) || []

    const grandTotal = rows.reduce((sum, r) => sum + r.amount, 0)

    return { rows, grandTotal }
  }

  return { fetchReport }
}
