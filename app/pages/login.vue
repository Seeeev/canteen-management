<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

// used for re reouting to index.vue if user is already logged in
definePageMeta({
  middleware: 'auth-redirect',
})

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: '',
  password: '',
})

const supabase = useSupabaseClient()
const toast = useToast()
const router = useRouter()

await supabase.auth.onAuthStateChange((event) => {
  if (event == 'SIGNED_IN') {
    router.push('/student')
  }
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { email, password } = event.data
  const { error, data } = await supabase.auth.signInWithPassword({ email, password })

  if (!error) {
    await router.push('/student')
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

      <div class="flex justify-center">
        <UButton type="submit" class="w-full justify-center">Login</UButton>
      </div>
    </UForm>

    <template #footer>
      <!-- <Placeholder class="h-8" /> -->
    </template>
  </UCard>
</template>
