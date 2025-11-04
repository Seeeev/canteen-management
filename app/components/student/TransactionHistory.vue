<script setup lang="ts">
import { useStudent } from '~/composables/useStudent'

const props = defineProps({
  student_number: {
    type: String,
    required: true,
  },
})

const { getTransactions } = useStudent()
const { data: transactions, pending, error, refresh } = await getTransactions(props.student_number)

// ✅ Button-safe wrapper
const handleRefresh = async () => {
  await refresh()
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <UCard>
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold">Transaction History</h2>
          <p class="text-sm text-gray-500">Student: {{ props.student_number }}</p>
        </div>
        <UButton
          color="primary"
          variant="soft"
          icon="i-heroicons-arrow-path"
          :loading="pending"
          @click="handleRefresh"
        >
          Refresh
        </UButton>
      </div>
    </UCard>

    <!-- Loading state -->
    <div v-if="pending" class="space-y-3">
      <USkeleton v-for="n in 3" :key="n" class="h-16 rounded-md" />
    </div>

    <!-- Error state -->
    <UAlert
      v-else-if="error"
      title="Error loading transactions"
      color="error"
      icon="i-heroicons-exclamation-triangle"
      :description="error.message"
    />

    <!-- Empty / No transactions -->
    <UEmpty
      v-else-if="!transactions || transactions.length === 0"
      icon="i-heroicons-banknotes"
      title="No transaction history"
      description="This student has no recorded transactions yet. Once they make payments or receive refunds, they’ll appear here."
    >
      <template #actions>
        <UButton color="primary" icon="i-heroicons-plus-circle"> Add transaction </UButton>
      </template>
    </UEmpty>

    <!-- ✅ Scrollable Transactions list -->
    <div
      v-else
      class="max-h-[400px] overflow-y-auto pr-2 grid gap-3 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400"
    >
      <UCard
        v-for="t in transactions"
        :key="t.id"
        class="hover:shadow-md transition-shadow duration-200"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">
              {{ t.transaction_type }}
            </p>
            <p class="text-sm text-gray-500">
              {{ new Date(t.created_at).toLocaleString() }}
            </p>
          </div>
          <div class="text-right">
            <UBadge :color="'info'" :label="t.refunded ? 'Refunded' : 'Completed'" class="mb-1" />
            <p class="font-semibold text-lg">₱{{ t.amount?.toLocaleString() ?? '0.00' }}</p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
