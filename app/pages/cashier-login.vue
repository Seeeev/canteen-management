<script setup lang="ts">
import type { Database } from '~/types/database.types'
import * as z from 'zod'
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'

const user = useSupabaseUser()

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
})

const supabase = useSupabaseClient<Database>()
const router = useRouter()
const toast = useToast()

const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    required: true,
    color: 'neutral',
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true,
    color: 'neutral',
  },
  {
    name: 'remember',
    label: 'Remember me',
    type: 'checkbox',
  },
]

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  const email = event.data.email
  const password = event.data.password

  const { data: cashierData, error: cashierError } = await supabase
    .from('cashiers')
    .select('email')
    .eq('email', email)
    .single()

  if (cashierError) {
    toast.add({ title: 'Error', description: cashierError.message, color: 'error' })
    return
  }

  if (!cashierData) {
    toast.add({ title: 'Error', description: 'Email not registered as a cashier.', color: 'error' })
    return
  }

  const { data, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (data.user?.user_metadata.role != 'cashier') {
    toast.add({ title: 'Error', description: 'User is not a cashier', color: 'error' })
  }

  if (authError) {
    toast.add({ title: 'Error', description: authError.message, color: 'error' })
    return
  }

  router.push('/cashier')
}
</script>
<template>
  <div class="bg-gradient-to-b from-red-700 to-black min-h-screen flex items-center justify-center">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        title="Cashier Login"
        description="Enter your credentials to access your account."
        icon="i-lucide-user"
        :fields="fields"
        @submit="onSubmit"
      >
        <template #submit>
          <UButton class="w-full justify-center hover:bg-red-200" color="neutral" type="submit"
            >Login</UButton
          >
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
