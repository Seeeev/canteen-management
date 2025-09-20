<script setup lang="ts">
const supabase = useSupabaseClient()
const router = useRouter()
async function signOut() {
  await supabase.auth.signOut()
  router.push('/cashier-login')
}
</script>

<template>
  <div>
    <p>cashier page</p>
    <UButton @click="signOut">Sign out</UButton>
  </div>
</template>
