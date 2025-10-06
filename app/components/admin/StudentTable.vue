<script setup lang="ts">
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
            })
        )
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
</template>
