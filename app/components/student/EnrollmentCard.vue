<script setup lang="ts">
const props = defineProps<{
  enrollment: any
}>()

const collegeName = computed(() => props.enrollment?.major?.program?.college?.name)
const programName = computed(() => props.enrollment?.major?.program?.name)
const majorName = computed(() => props.enrollment?.major?.name)
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold">Enrollment Information</h3>
    </template>

    <div class="space-y-2">
      <UInput readonly label="College" :model-value="collegeName" />
      <UInput readonly label="Program" :model-value="programName" />
      <UInput readonly label="Major" :model-value="majorName" />
      <UInput readonly label="Year" :model-value="enrollment.enrollment_year" />
      <UInput readonly label="Status" :model-value="enrollment.status" />
    </div>
  </UCard>
</template>
