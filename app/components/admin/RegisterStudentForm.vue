<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

import type { Database } from '~/types/database.types'

const toast = useToast()
const supabase = useSupabaseClient<Database>() // Database type from ~/types/database.types
const { fetchTransactions, registerStudent, showError } = useAdmin()

// ✅ Form fields
const fields = ref<AuthFormField[]>([
  { name: 'email', type: 'email', label: 'Email', placeholder: 'Enter your email', required: true },
  {
    name: 'student_number',
    type: 'text',
    label: 'Student Number',
    placeholder: 'Enter student number',
    required: true
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    required: true,
  },

  {
    name: 'balance',
    type: 'number',
    label: 'Balance',
    placeholder: 'Enter balance (Optional)',
  },

  {
    name: 'first_name',
    type: 'text',
    label: 'First Name',
    placeholder: 'Enter first name',
    required: true,
  },
  {
    name: 'middle_name',
    type: 'text',
    label: 'Middle Name',
    placeholder: 'Enter middle name (optional)',
  },
  {
    name: 'last_name',
    type: 'text',
    label: 'Last Name',
    placeholder: 'Enter last name',
    required: true,
  },
  {
    name: 'suffix',
    type: 'text',
    label: 'Suffix',
    placeholder: 'e.g. Jr, Sr, III (optional)',
    required: false,
  },
  {
    name: 'gender',
    type: 'text',
    label: 'Gender',
    placeholder: 'male',
    required: true
  },
])

type Student = Database['public']['Tables']['students']['Row']
// ✅ Zod validation schema
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters'),
  first_name: z.string().min(1, 'First name is required'),
  middle_name: z.string().nullable().optional(),
  last_name: z.string().min(1, 'Last name is required'),
  balance: z.number().positive().nullable().optional(),
  student_number: z.string(),
  suffix: z.string().nullable().optional(),
  date_of_birth: z.string().nullable().optional(),
  gender: z.enum(['male', 'female']),
})

type Schema = z.output<typeof schema>

// ✅ Submit handler
async function onSubmit(payload: FormSubmitEvent<Schema>) {
  console.log('asdasdasd')
  const {
    email,
    password,
    first_name,
    middle_name,
    last_name,
    suffix,
    balance,
    date_of_birth,
    gender,
    student_number,
  } = payload.data

  await registerStudent({
    email,
    first_name,
    middle_name: middle_name ?? null,
    last_name,
    suffix: suffix ?? null,
    password,
    balance: balance ?? null,
    date_of_birth: date_of_birth ?? null,
    gender: gender,
    student_number: student_number,
  })
}
</script>

<template>
  <UAuthForm :schema="schema" :fields="fields" @submit="onSubmit" class="max-w-sm" >
  <template #submit>
      <UButton class="w-full justify-center bg-gray-400 hover:bg-red-400" type="submit"
        >Create</UButton
      >
    </template>
  </UAuthForm>
</template>
