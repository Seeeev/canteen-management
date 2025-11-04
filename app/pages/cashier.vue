<script setup lang="ts">
import { useCashier } from '~/composables/useCashier'
import type { Database } from '~/types/database.types'
import PurchaseForm from '~/components/cashier/PurchaseForm.vue'
import RefundForm from '~/components/cashier/RefundForm.vue'
import type { NavigationMenuItem } from '@nuxt/ui'
import { ro } from '@nuxt/ui/runtime/locale/index.js'

definePageMeta({ middleware: 'roles' })

const { user, signOut, showError, getCashierId } = useCashier()

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
const email = user.value?.email
const created_at = user.value?.created_at

// shows id not in database when role is not cashier this is a bandaid solution for now
var cashierId = 0
onBeforeMount(async () => {
  try {
    cashierId = (await getCashierId(email!)) || 0
  } catch {
    router.push('/cashier-login')
  }
})
// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-red-700 to-black">
    <UHeader >
      <template #title>
        <UAvatar src="/img/logo.jpeg" />
      </template>

      <!-- <UNavigationMenu :items="items1" /> -->

      <template #right>
        <UColorModeButton />

        <!-- <UTooltip text="Open on GitHub" :kbds="['meta', 'G']">
          <UButton
            color="neutral"
            variant="ghost"
            to="https://github.com/nuxt/ui"
            target="_blank"
            icon="i-simple-icons-github"
            aria-label="GitHub"
          />
        </UTooltip> -->
        <UButton label="Logout" @click="signOut" />
      </template>
      <template #body>
        <UNavigationMenu :items="items1" orientation="vertical" class="-mx-2.5" />
      </template>
    </UHeader>
    <div class="flex justify-center items-center h-screen">
      <UTabs :items="items" color="neutral">
        <template #purchase>
          <PurchaseForm :cashier_id="cashierId" />
        </template>

        <template #refund>
          <RefundForm />
        </template>
      </UTabs>
    </div>
  </div>
</template>
