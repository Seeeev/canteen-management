<script setup lang="ts">
import StudentTable from '~/components/admin/StudentTable.vue'
definePageMeta({
  layout: 'dashboard',
  middleware: 'roles',
})

const user = useSupabaseUser()
console.log(user.value?.user_metadata.role)
</script>

<template>
  <UContainer>
    <StudentTable />
  </UContainer>
</template>
