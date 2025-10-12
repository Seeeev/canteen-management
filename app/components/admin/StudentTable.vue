<!-- <script setup lang="ts">
import type { TableColumn } from '#ui/types'
import type { Database } from '~/types/database.types'
import { useClipboard } from '@vueuse/core'
import type { Row } from '@tanstack/vue-table'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useToast()
const { copy } = useClipboard()

type STUDENT = Database['public']['Tables']['students']['Row']

const columns: TableColumn<STUDENT>[] = [
  {
    accessorKey: 'student_number',
    header: '#',
    cell: ({ row }) => `${row.getValue('student_number')}`,
  },
  {
    accessorKey: 'full_name',
    header: 'Name',
    // Build the full name manually
    cell: ({ row }) =>
      `${row.original.first_name} ${row.original.middle_name || ''} ${row.original.last_name} ${
        row.original.suffix || ''
      }`
        .replace(/\s+/g, ' ')
        .trim(),
  },
  {
    accessorKey: 'balance',
    header: 'Balance',
    cell: ({ row }) => `${row.original.balance ?? 0}`,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: {
              align: 'end',
            },
            items: getRowItems(row),
            'aria-label': 'Actions dropdown',
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto',
              'aria-label': 'Actions dropdown',
            }),
        ),
      )
    },
  },
]

function getRowItems(row: Row<STUDENT>) {
  return [
    {
      type: 'label',
      label: 'Actions',
    },
    {
      label: 'Copy student number',
      onSelect() {
        copy(row.original.student_number)

        toast.add({
          title: 'ID copied to clipboard!',
          color: 'success',
          icon: 'i-lucide-circle-check',
        })
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'View customer',
    },
    {
      label: 'View payment details',
    },
  ]
}

// 🔹 state for loading and data
const students = ref<STUDENT[]>()
const isLoading = ref(true)

const { fetchAllStudents } = useStudent()

onMounted(async () => {
  try {
    students.value = await fetchAllStudents()
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <UPageCard>
    <UTable
      :columns="columns"
      :data="students"
      :loading="isLoading"
      loading-color="primary"
      loading-animation="carousel"
      class="w-fullh-[80vh]"
      :striped="true"
      :hover="true"
    />
  </UPageCard>
</template> -->

<script setup lang="ts">
const supabase = useSupabaseClient()

const { data, refresh, pending, error } = await useAsyncData('students', async () => {
  const { data, error } = await supabase.from('students').select('*')
  if (error) throw error
  return data
})
const globalFilter = ref()
</script>

<template>
  <UContainer class="py-8">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">Students</h1>
      <UButton icon="i-heroicons-arrow-path" @click="() => refresh()" :loading="pending">
        Refresh
      </UButton>
    </div>
    <div class="flex px-4 py-3.5 ">
      <UInput v-model="globalFilter" class="max-w-sm" placeholder="Filter..." />
    </div>
    <UCard>
      <UTable :data="data" v-model:global-filter="globalFilter" :loading="pending" class="w-full h-[80vh] overflow-y-auto"   />
    </UCard>

    <UAlert v-if="error" color="error" icon="i-heroicons-exclamation-triangle" class="mt-4">
      {{ error.message }}
    </UAlert>
  </UContainer>
</template>
