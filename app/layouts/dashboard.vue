<script setup lang="ts">
import { ref } from 'vue'

const links = ref([
  { label: 'Dashboard', icon: 'i-heroicons-home', to: '/admin' },
  { label: 'Users', icon: 'i-heroicons-users', to: '/admin/page2' },
  { label: 'Settings', icon: 'i-heroicons-cog-6-tooth', to: '/admin/page3' },
])
</script>

<template>
  <UDashboardGroup>
    <AdminSidebar />

    <UDashboardPanel>
      <template #header>
        <AdminNavbar />
      </template>
      <template #body>
        <slot />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
