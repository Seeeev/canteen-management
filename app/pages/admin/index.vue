<script setup lang="ts">
import StudentTable from '~/components/admin/StudentTable.vue'

definePageMeta({
  layout: 'dashboard',
  // middleware: 'roles',
})
</script>

<template>
  <UContainer>
    <StudentTable />
  </UContainer>
</template>
