<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useTransactionReport } from '~/composables/useTransactionReport'

definePageMeta({ layout: 'dashboard' })

// Month names for display
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

// Filter models
const year = ref<number>(new Date().getFullYear())
const month = ref<number>(new Date().getMonth() + 1)
const globalFilter = ref<string>('')
const transactionType = ref<string>('') // '', 'deposit', 'withdrawal'

// Table data
type ReportRow = {
  student_number: string
  amount: number
  created_at: string
  transaction_type: string
}

const rows = ref<ReportRow[]>([])
const loading = ref(false)

const { fetchReport } = useTransactionReport()

// Load report from Supabase
async function loadReport() {
  loading.value = true
  try {
    const result = await fetchReport(year.value, month.value)
    // Ensure transaction_type is always defined
    rows.value = result.rows.map((r) => ({
      student_number: r.student_number,
      amount: r.amount,
      created_at: r.created_at || '',
      transaction_type: r.transaction_type || 'deposit',
    }))
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

watchEffect(loadReport)

// Computed filtered rows based on search & type
const filteredRows = computed(() => {
  return rows.value.filter((r) => {
    if (transactionType.value && r.transaction_type !== transactionType.value) return false
    if (!globalFilter.value) return true

    const q = globalFilter.value.toLowerCase()
    return (
      r.student_number.toLowerCase().includes(q) ||
      r.amount.toString().includes(q) ||
      (r.created_at && new Date(r.created_at).toLocaleString().toLowerCase().includes(q))
    )
  })
})

// Grand total of filtered rows
const grandTotal = computed(() => filteredRows.value.reduce((sum, r) => sum + r.amount, 0))
</script>

<template>
  <div class="p-6 space-y-4">
    <h1 class="text-2xl font-bold">Student Transaction Report</h1>

    <!-- Filters -->
    <div class="flex gap-3 items-end">
      <UInput v-model="globalFilter" class="max-w-sm" placeholder="Search..." />

      <UFormField label="Year">
        <USelect v-model="year" :items="[2023, 2024, 2025, 2026]" class="w-32" />
      </UFormField>

      <UFormField label="Month">
        <USelect v-model="month" :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]" class="w-40">
          <template #default="{ modelValue }">{{
            monthNames[(modelValue as number) - 1]
          }}</template>
          <template #item="{ item }">{{ monthNames[(item as number) - 1] }}</template>
        </USelect>
      </UFormField>

      <!-- <UFormField label="Transaction Type">
        <USelect
          v-model="transactionType"
          :items="[
            { label: 'All', value: '' },
            { label: 'Deposit', value: 'deposit' },
            { label: 'Withdrawal', value: 'withdrawal' },
          ]"
          class="w-40"
        />
      </UFormField> -->

      <UButton :loading="loading" @click="loadReport"> Refresh </UButton>
    </div>

    <!-- Table -->
    <UTable
      :data="filteredRows"
      :columns="[
        { accessorKey: 'student_number', header: 'Student Number' },
        {
          accessorKey: 'amount',
          header: 'Amount',
          cell: ({ getValue }) => {
            const val = getValue() as number | undefined
            return val != null
              ? `₱${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
              : '-'
          },
        },
        {
          accessorKey: 'transaction_type',
          header: 'Type',
          cell: ({ getValue }) => {
            const val = getValue() as string | undefined
            return val ? val.charAt(0).toUpperCase() + val.slice(1) : '-'
          },
        },
        {
          accessorKey: 'created_at',
          header: 'Date / Time',
          cell: ({ getValue }) => {
            const val = getValue() as string | undefined
            return val ? new Date(val).toLocaleString() : '-'
          },
        },
      ]"
    />

    <!-- Grand Total -->
    <div class="text-right text-lg font-bold mt-4">
      Grand Total: ₱{{ grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
    </div>
  </div>
</template>
