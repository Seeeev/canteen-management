<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { z } from 'zod'

// 1️⃣ Define Zod schema
const { TransactionSchema, fetchTransactions } = useAdmin()

type Transaction = z.infer<typeof TransactionSchema>

// 2️⃣ Supabase client
const supabase = useSupabaseClient()

// 3️⃣ Fetch joined data
const { data: transactions, pending, error, refresh } = await fetchTransactions()

type TransactionRow = {
  student_number: string
  student_name: string
  amount: number
  cashier_id: string | number
  transaction_type: string
  refunded: string // "Yes" / "No"
}

const columns: TableColumn<TransactionRow>[] = [
  { accessorKey: 'student_number', header: 'Student #', enableSorting: true },
  { accessorKey: 'student_name', header: 'Student Name' },
  { accessorKey: 'amount', header: 'Amount', enableSorting: true },
  { accessorKey: 'cashier_id', header: 'Cashier #', enableSorting: true },
  { accessorKey: 'transaction_type', header: 'Type' },
  { accessorKey: 'refunded', header: 'Refunded', enableSorting: true },
]

const globalFilter = ref()
</script>

<template>
  <UContainer class="py-8">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold text-red-400">Transactions</h1>
      <UButton icon="i-heroicons-arrow-path" color="error" @click="() => refresh()" :loading="pending">
        Refresh
      </UButton>
    </div>
    <div class="flex px-4 py-3.5">
      <UInput v-model="globalFilter" class="max-w-sm" placeholder="Filter..." />
    </div>
    <UCard>
      <UTable
        :data="transactions || []"
        :columns="columns"
        v-model:global-filter="globalFilter"
        :loading="pending"
        class="w-full h-[80vh] overflow-y-auto"
      />
    </UCard>

    <UAlert v-if="error" color="error" icon="i-heroicons-exclamation-triangle" class="mt-4">
      {{ error.message }}
    </UAlert>
  </UContainer>
</template>
