<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Database } from '~/types/database.types'

const { fetchTransactions } = useAdmin()

type Transactions = Database['public']['Tables']['transactions']['Row']
const isLoading = ref(true)
const transactions = ref<Transactions[]>()
onMounted(async () => {
  try {
    transactions.value = await fetchTransactions()
  } finally {
    isLoading.value = false
  }
})

const columns: TableColumn<Transactions>[] = [
  {
    accessorKey: 'id',
    header: '#',
  },
  {
    accessorKey: 'student_number',
    header: 'Student #',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      var amount = row.getValue('amount')
      if (amount == null) return '—' // show dash or empty if null
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
      }).format(amount as number)
    },
  },
  {
    accessorKey: 'cashier_id',
    header: 'Cashier #',
  },
  {
    accessorKey: 'transaction_type',
    header: 'Type',
  },
  {
    accessorKey: 'refunded',
    header: 'Refunded',
  },
]

const globalFilter = ref()
</script>
<template>
  <UPageCard>
    <div class="flex px-4 py-3.5 border-b border-accented">
      <UInput v-model="globalFilter" class="max-w-sm" placeholder="Filter..." />
    </div>
    <UTable
      ref="table"
      :data="transactions"
      :loading="isLoading"
      :columns="columns"
      v-model:global-filter="globalFilter"
      loading-animation="carousel"
      class="border rounded-lg h-[80vh]"
    />
  </UPageCard>
</template>
