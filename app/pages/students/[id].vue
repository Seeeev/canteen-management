<script setup lang="ts">
import { useRoute } from '#app'

const route = useRoute()
const client = useSupabaseClient()

// ✅ Safely extract a string id from route params
const studentId = computed(() => {
  const param = route.params.id
  if (Array.isArray(param)) return param[0]
  return param || ''
})

const {
  data: student,
  pending,
  error,
} = useAsyncData(
  () => `student-${studentId.value}`,
  async () => {
    if (!studentId.value) throw new Error('No student ID provided')

    const { data, error } = await client
      .from('students')
      .select('*')
      .eq('id', studentId.value) // ✅ string only
      .single()

    if (error) throw error
    return data
  },
)
</script>

<template>
  <UContainer class="py-10 max-w-3xl">
    <UCard v-if="student">
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-semibold">
              {{ student.first_name }} {{ student.middle_name }} {{ student.last_name }}
              <span v-if="student.suffix">, {{ student.suffix }}</span>
            </h2>
            <p class="text-gray-500">Student #{{ student.student_number }}</p>
          </div>
          <UBadge color="primary">{{ student.gender || 'Unspecified' }}</UBadge>
        </div>
      </template>

      <UDescriptionList>
        <UDescriptionListItem label="Email">
          {{ student.email || '—' }}
        </UDescriptionListItem>

        <UDescriptionListItem label="Date of Birth">
          {{ student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : '—' }}
        </UDescriptionListItem>

        <UDescriptionListItem label="Balance">
          <span :class="(student.balance ?? 0) > 0 ? 'text-red-500' : 'text-green-600'">
            {{ `$${Number(student.balance ?? 0).toFixed(2)}` }}
          </span>
        </UDescriptionListItem>

        <UDescriptionListItem label="Created At">
          {{ student.created_at ? new Date(student.created_at).toLocaleString() : '—' }}
        </UDescriptionListItem>
      </UDescriptionList>
    </UCard>

    <div v-else-if="pending" class="flex justify-center py-10">
      <ULoading size="lg" />
    </div>

    <UAlert v-else-if="error" color="error" title="Error loading student">
      {{ error.message }}
    </UAlert>
  </UContainer>
</template>
