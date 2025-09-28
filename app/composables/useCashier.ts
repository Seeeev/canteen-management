import type { Database } from '~/types/database.types'

export function useCashier() {
  const supabase = useSupabaseClient<Database>()
  const router = useRouter()
  const user = useSupabaseUser()
  const toast = useToast()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/cashier-login')
  }

  function showError(message: string) {
    toast.add({ title: 'Error', description: message, color: 'error' })
  }

  function showSuccess(message: string) {
    toast.add({ title: 'Success', description: message, color: 'success' })
  }

  return { supabase, user, signOut, showError, showSuccess }
}
