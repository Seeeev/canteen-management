import { useSupabaseUser } from '#imports'
import type { Database } from '~/types/database.types'

type UserRow = Database['public']['Tables']['students']['Row']

export function useUserInfo() {
  const user = useSupabaseUser()
  const id = ref<string>('')
  const student_number = ref<string>('----')
  const balance = ref<number>(0)
  const firstName = ref<string>('')
  const middleName = ref<string>('')
  const lastName = ref<string>('')
  const suffix = ref<string>('')
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  async function fetchUserInfo() {
    if (!user.value?.email) return
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<UserRow>('/api/getUserInfo', {
        method: 'POST',
        body: { email: user.value.email },
      })
      id.value = data.id ?? ''
      student_number.value = data.student_number ?? '----a'
      balance.value = data?.balance ?? 0
      firstName.value = data?.first_name ?? ''
      middleName.value = data?.middle_name ?? ''
      lastName.value = data?.last_name ?? ''
      suffix.value = data?.suffix ?? ''
    } catch (err) {
      console.error('Failed to fetch user info:', (err as Error).message)
      error.value = 'Could not load user information.'
      resetUserInfo()
    } finally {
      loading.value = false
    }
  }

  function resetUserInfo() {
    id.value = ''
    student_number.value = '----'
    balance.value = 0
    firstName.value = ''
    middleName.value = ''
    lastName.value = ''
    suffix.value = ''
  }

  // watchEffect(fetchUserInfo)
  watch(
    () => user.value?.email,
    (email) => {
      if (email) fetchUserInfo()
    },
    { immediate: true },
  )

  return {
    id,
    student_number,
    balance,
    firstName,
    middleName,
    lastName,
    suffix,
    loading,
    error,
    refresh: fetchUserInfo,
  }
}
