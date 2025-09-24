export default defineNuxtRouteMiddleware(() => {
  const session = useSupabaseSession() // ref<Session | null>
  if (!session.value) {
    return navigateTo('/cashier-login')
  }
})
