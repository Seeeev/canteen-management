<script setup lang="ts">
import { useCashier } from '~/composables/useCashier'
import type { Database } from '~/types/database.types'
import PurchaseForm from '~/components/cashier/PurchaseForm.vue'
import RefundForm from '~/components/cashier/RefundForm.vue'
definePageMeta({ middleware: 'roles' })

const { user, signOut, showError, getCashierId } = useCashier()
console.log(user.value?.user_metadata)
const supabase = useSupabaseClient<Database>()
const router = useRouter()

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
