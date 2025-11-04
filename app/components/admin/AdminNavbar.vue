<script setup lang="ts">
const supabase = useSupabaseClient()
const { showError } = useAdmin()
const router = useRouter()
async function onLogout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    showError(error.message)
    return
  }

  router.push('/admin-login')
}
</script>
<template>
  <UDashboardNavbar
    title="Admin Panel"
    :ui="{ title: 'text-red-400' }"
    icon="i-lucide-shield-user"
    class="text-red-400"
  >
    <template #leading> </template>
    <template #trailing> </template>
    <template #right>
      <UColorModeButton class="text-red-400" />
      <UButton label="Logout" class="bg-red-400 hover:bg-red-700" @click="onLogout" />
    </template>
  </UDashboardNavbar>
</template>
