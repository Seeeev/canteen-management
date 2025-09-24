<script setup lang="ts">
import type { Database } from '~/types/database.types'
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

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

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })

  const email = event.data.email
  const password = event.data.password

  const { data, error } = await supabase
    .from('cashiers')
    .select('email')
    .eq('email', email)
    .single()

  if (error) {
    toast.add({ title: 'Error', description: error.message, color: 'error' })
  } else if (data?.email === email) {
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (authError) {
      toast.add({ title: 'Error', description: authError.message, color: 'error' })
    } else {
      router.push('/cashier')
    }
  }
}
</script>
<template>
  <UCard class="mt-36 mx-[3%] sm:mx-[30%]">
    <template #header>
      <!-- <Placeholder class="h-8" /> -->
      <div class="flex justify-between">
        <p>Siena College Tigaon inc. E Wallet</p>
        <UAvatar src="/img/logo.jpeg" />
      </div>
    </template>

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Email" name="email">
        <UInput v-model="state.email" class="w-full" />
      </UFormField>

      <UFormField label="Password" name="password">
        <UInput v-model="state.password" type="password" class="w-full" />
      </UFormField>

      <NuxtLink to="/password/reset" class="hover:underline"> Forgot password? </NuxtLink>

      <div class="flex justify-center">
        <UButton type="submit" class="w-full justify-center">Login</UButton>
      </div>
    </UForm>

    <template #footer>
      <!-- <Placeholder class="h-8" /> -->
    </template>
  </UCard>
</template>
