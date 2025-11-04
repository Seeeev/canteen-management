// middleware/role.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser()

  // If user is not logged in at all
  // if (!user.value) {
  //   // You can optionally redirect to a generic login page
  //   return navigateTo('/login')
  // }

  // Safely get role
  const role = user.value?.user_metadata?.role

  // If role is undefined, redirect based on route prefix
  if (to.path.startsWith('/admin') && role !== 'admin') {
    return navigateTo('/admin-login')
  }

  if (to.path.startsWith('/cashier') && role !== 'cashier') {
    return navigateTo('/cashier-login')
  }

  if (to.path.startsWith('/student') && role !== 'student') {
    return navigateTo('/login')
  }
})
