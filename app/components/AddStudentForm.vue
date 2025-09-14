<script setup lang="ts">
const { data } = await useFetch('/api/hello')
console.log(data.value)
</script>
<template>
  <div></div>
</template>

<!-- <script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  student_id: z.coerce.number().int().positive(),
  name: z.string(),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  student_id: undefined,
  name: undefined,
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  console.log(event.data)
  await $fetch('api/addStudent', {
    method: 'POST',
    body: {
      student_id: event.data.student_id,
      name: event.data.name,
    },
  })
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField label="Student ID" name="student_id">
      <UInput v-model="state.student_id" />
    </UFormField>

    <UFormField label="Full Name" name="name">
      <UInput v-model="state.name" />
    </UFormField>
    <UButton label="Add" type="submit" />
  </UForm>
</template> -->
