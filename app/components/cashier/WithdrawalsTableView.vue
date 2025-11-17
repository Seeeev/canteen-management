<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { ColumnDef, getPaginationRowModel } from '@tanstack/vue-table'
import { useWithdrawalRequests } from '~/composables/useWithdrawalRequests'

const { fetchRequests } = useWithdrawalRequests()

// Table state
const loading = ref(false)
const tableData = ref<any[]>([]) // actual data rows from Supabase
const searchQuery = ref('')
const filterStatus = ref('') // '', 'pending', 'approved', 'rejected'
// const page = ref(0) // zero-based page index for TanStack style
// const pageSize = ref(10)

const table = useTemplateRef('table')

const pagination = ref({
  pageIndex: 0,
  pageSize: 5,
})

// Define columns according to Nuxt UI v4 / TanStack table
const columns = ref<ColumnDef<any, any>[]>([
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'student_number',
    header: 'Student ID',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ getValue }) => {
      const val = getValue() as number
      return `₱${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const s = getValue() as string
      let color = 'text-gray-700'
      if (s === 'pending') color = 'text-yellow-600'
      else if (s === 'approved') color = 'text-green-600'
      else if (s === 'rejected') color = 'text-red-600'
      return h('span', { class: color }, s)
    },
  },
  {
    accessorKey: 'requested_at',
    header: 'Requested At',
    cell: ({ getValue }) => {
      const dt = new Date(getValue() as string)
      return dt.toLocaleString()
    },
  },
  // {
  //   id: 'actions', // use `id` instead of accessorKey when not in data
  //   header: 'Actions',
  //   cell: ({ row }) => {
  //     const r = row.original as any
  //     return h('div', { class: 'flex gap-2' }, [
  //       h(
  //         'button',
  //         {
  //           class: [
  //             'px-2 py-1 text-sm rounded',
  //             r.status === 'pending' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600',
  //           ],
  //           disabled: r.status !== 'pending',
  //           onClick: () => onApprove(r),
  //         },
  //         'Approve',
  //       ),
  //       h(
  //         'button',
  //         {
  //           class: [
  //             'px-2 py-1 text-sm rounded',
  //             r.status === 'pending' ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-600',
  //           ],
  //           disabled: r.status !== 'pending',
  //           onClick: () => onReject(r),
  //         },
  //         'Reject',
  //       ),
  //     ])
  //   },
  // },
])

// Fetching function
const loadTable = async () => {
  loading.value = true
  try {
    const data = await fetchRequests({
      search: searchQuery.value,
      status: filterStatus.value,
      // page: page.value + 1, // your API likely 1-based page
      // pageSize: pageSize.value,
    })
    tableData.value = data
  } catch (e) {
    console.error(e)
    useToast().add({ title: 'Error', description: 'Could not load data', color: 'error' })
  } finally {
    loading.value = false
  }
}

onMounted(loadTable)
watch([searchQuery, filterStatus], loadTable)
</script>

<template>
  <div class="p-4 space-y-4">
    <!-- Controls -->
    <div class="flex gap-2">
      <UInput v-model="searchQuery" placeholder="Search by Student ID" class="flex-1" />
      <USelect
        v-model="filterStatus"
        :options="[
          { label: 'All', value: '' },
          { label: 'Pending', value: 'pending' },
          { label: 'Approved', value: 'approved' },
          { label: 'Rejected', value: 'rejected' },
        ]"
      />
    </div>

    <!-- Table component -->
    <UTable
      :data="tableData"
      ref="table"
      v-model:pagination="pagination"
      :columns="columns"
      :loading="loading"
    />
  </div>
  <div class="flex justify-center border-t border-default pt-4">
    <UPagination
      v-model:page="pagination.pageIndex"
      :items-per-page="pagination.pageSize"
      :total="tableData.length"
    />
  </div>
</template>
