<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[][] = [
  [
    {
      label: 'Student Profile',
      icon: 'i-lucide-user-pen',
      // active: true,
      to: '/admin/',
    },
    {
      label: 'Canteen Transactions',
      icon: 'i-lucide-hand-coins',
      // badge: '4',
      to: '/admin/transactions',
    },
    {
      label: 'Account Creation',
      icon: 'i-lucide-user-plus',
      children: [
        { label: 'Cashier', to: '/admin/cashier' },
        { label: 'Student', to: '/admin/student' },
      ],
    },
    {
      label: 'Account Deletion',
      icon: 'i-lucide-user-x',
      // defaultOpen: true,
      // children: [
      //   {
      //     label: 'General',
      //   },
      //   {
      //     label: 'Members',
      //   },
      //   {
      //     label: 'Notifications',
      //   },
      // ],
    },
  ],
  [
    {
      label: 'Feedback',
      icon: 'i-lucide-message-circle',
      to: 'https://github.com/nuxt-ui-templates/dashboard',
      target: '_blank',
    },
    {
      label: 'Help & Support',
      icon: 'i-lucide-info',
      to: 'https://github.com/nuxt/ui',
      target: '_blank',
    },
  ],
]
</script>

<template>
  <UDashboardSidebar mode="slideover" collapsible resizable>
    <template #header="{ collapsed }">
      <!-- <UIcon v-if="collapsed" name="i-lucide-lightbulb" class="size-5" /> -->
      <!-- <UIcon name="i-simple-icons-nuxtdotjs" class="size-5 text-primary mx-auto" /> -->
      <UIcon name="i-lucide-user-cog" class="size-14 text-primary mx-auto" />
    </template>

    <UNavigationMenu :items="items" orientation="vertical" />
  </UDashboardSidebar>
</template>
