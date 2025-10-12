<script setup lang="ts">
import { useCashier } from '~/composables/useCashier'
import type { Database } from '~/types/database.types'
import PurchaseForm from '~/components/cashier/PurchaseForm.vue'
import RefundForm from '~/components/cashier/RefundForm.vue'
import type { NavigationMenuItem } from '@nuxt/ui'
definePageMeta({ middleware: 'roles' })

const { user, signOut, showError, getCashierId } = useCashier()
console.log(user.value?.user_metadata)
const supabase = useSupabaseClient<Database>()
const router = useRouter()
const route = useRoute()

const items1 = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Docs',
    to: '/docs/getting-started',
    active: route.path.startsWith('/docs/getting-started'),
  },
  {
    label: 'Components',
    to: '/docs/components',
    active: route.path.startsWith('/docs/components'),
  },
  {
    label: 'Figma',
    to: 'https://go.nuxt.com/figma-ui',
    target: '_blank',
  },
  {
    label: 'Releases',
    to: 'https://github.com/nuxt/ui/releases',
    target: '_blank',
  },
])

const items = [
  {
    label: 'Purchase',
    icon: 'i-lucide-banknote',
    slot: 'purchase',
  },
  {
    label: 'Refund',
    icon: 'i-lucide-banknote-x',
    slot: 'refund',
  },
]

const email = user.value?.email!
const cashierId = await getCashierId(email)
const created_at = user.value?.created_at
</script>

<template>
  <div>
    <UHeader>
      <template #title>
        <Logo class="h-6 w-auto" />
      </template>

      <UNavigationMenu :items="items1" />

      <template #right>
        <UColorModeButton />

        <UTooltip text="Open on GitHub" :kbds="['meta', 'G']">
          <UButton
            color="neutral"
            variant="ghost"
            to="https://github.com/nuxt/ui"
            target="_blank"
            icon="i-simple-icons-github"
            aria-label="GitHub"
          />
        </UTooltip>
      </template>
    </UHeader>
    <div class="flex justify-center items-center h-screen">
      <UTabs :items="items">
        <template #purchase>
          <PurchaseForm :cashier_id="cashierId!" />
        </template>

        <template #refund>
          <RefundForm />
        </template>
      </UTabs>
    </div>
  </div>
</template>
