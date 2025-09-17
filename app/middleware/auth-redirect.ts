export default defineNuxtRouteMiddleware((to, from) => {
  // Replace this with how you actually check login status
  const user = useSupabaseUser() // Example: a composable or store (e.g. Pinia/Vuex)

  if (user.value && to.path === '/login') {
    // User is already logged in, redirect to dashboard (or home)
    return navigateTo('/')
  }
})
