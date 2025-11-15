<script setup lang="ts">
const props = defineProps<{
  student: any
}>()

const fullName = computed(() =>
  [
    props.student.first_name,
    props.student.middle_name,
    props.student.last_name,
    props.student.suffix,
  ]
    .filter(Boolean)
    .join(' '),
)

const formatCurrency = (val: number) =>
  val ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PHP' }).format(val) : '-'
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">
          {{ fullName }}
        </h2>
        <UBadge color="primary">{{ student.student_number }}</UBadge>
      </div>
    </template>

    <div class="grid grid-cols-2 gap-4">
      <UInput readonly label="Email" :model-value="student.email" />
      <UInput readonly label="Gender" :model-value="student.gender" />
      <UInput readonly label="Date of Birth" :model-value="student.date_of_birth" />
      <UInput readonly label="Balance" :model-value="formatCurrency(student.balance)" />
    </div>
  </UCard>
</template>
