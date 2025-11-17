<template>
  <UContainer class="py-10">
    <UCard class="max-w-md mx-auto">
      <template #header>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Disable Student Account</h2>
      </template>

      <UForm @submit="submitForm" class="space-y-4">
        <UFormField
          label="Student Email"
          description="Enter the student's registered email address."
        >
          <UInput
            v-model="email"
            placeholder="student@example.com"
            size="lg"
            icon="i-heroicons-envelope"
          />
        </UFormField>

        <UButton
          type="submit"
          color="info"
          block
          size="lg"
          :loading="loading"
          icon="i-heroicons-user-minus"
        >
          Disable Student
        </UButton>
      </UForm>

      <template #footer>
        <p
          v-if="message"
          class="text-center text-sm"
          :class="{
            'text-green-600 dark:text-green-400': success,
            'text-red-600 dark:text-red-400': !success,
          }"
        >
          {{ message }}
        </p>
      </template>
    </UCard>
  </UContainer>
</template>

<script setup>
import { ref } from 'vue'
definePageMeta({ layout: 'dashboard' })

const email = ref('')
const loading = ref(false)
const message = ref('')
const success = ref(false)

const submitForm = async () => {
  loading.value = true
  message.value = ''

  const { data, error } = await useFetch('/api/students/disable', {
    method: 'POST',
    body: { email: email.value },
  })

  loading.value = false

  if (error.value) {
    message.value = error.value.data?.error ?? 'Something went wrong.'
    success.value = false
    return
  }

  message.value = data.value?.message ?? 'Student disabled.'
  success.value = true
  email.value = ''
}
</script>
