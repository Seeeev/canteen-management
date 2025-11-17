export default defineNuxtRouteMiddleware(async (to, from) => {
  const client = useSupabaseClient()
  const user = useSupabaseUser()

  if (!user.value) return

  // refresh session to get latest app_metadata
  const { data } = await client.auth.getUser()
  const disabled = data.user?.app_metadata?.disabled

  if (disabled) {
    return navigateTo('/disabled-account')
  }
})
