// middleware/role.ts

export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser()

  // Wait until user is loaded
  if (!user.value) {
    return navigateTo('/login') // Redirect if not logged in
  }

  const role = user.value.user_metadata.role

  // Example role-based rules
  if (to.path.startsWith('/admin') && role !== 'admin') {
    return navigateTo('/unauthorized')
  }

  if (to.path.startsWith('/cashier') && role !== 'cashier') {
    return navigateTo('/unauthorized')
  }

  if (to.path.startsWith('/student') && role !== 'student') {
    return navigateTo('/unauthorized')
  }
})
