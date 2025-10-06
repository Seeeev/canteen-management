<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

import type { Database } from '~/types/database.types'

const toast = useToast()
const supabase = useSupabaseClient<Database>() // Database type from ~/types/database.types
const { fetchTransactions, registerCashier, showError } = useAdmin()

// ✅ Form fields
const fields = ref<AuthFormField[]>([
  { name: 'email', type: 'email', label: 'Email', placeholder: 'Enter your email', required: true },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    required: true,
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
])

// ✅ Zod validation schema
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters'),
  first_name: z.string().min(1, 'First name is required'),
  middle_name: z.string().nullable().optional(),
  last_name: z.string().min(1, 'Last name is required'),
  suffix: z.string().nullable().optional(),
})

type Schema = z.output<typeof schema>

// ✅ Submit handler
async function onSubmit(payload: FormSubmitEvent<Schema>) {
  const { email, password, first_name, middle_name, last_name, suffix } = payload.data

  await registerCashier({
    email,
    first_name,
    middle_name: middle_name ?? null,
    last_name,
     suffix: suffix ?? null,
    password,
  })
}
</script>

<template>
  <UAuthForm :schema="schema" :fields="fields" @submit="onSubmit" class="max-w-sm" />
</template>
