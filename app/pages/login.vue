<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
import type { container } from '#build/ui'

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
  } else {
    toast.add({
      title: 'Error',
      description: error.message,
      color: 'error',
    })
  }
}

const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    color: 'neutral',
    required: true,
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    color: 'neutral',
    required: true,
  },
  {
    name: 'remember',
    label: 'Remember me',
    type: 'checkbox',
  },
]
</script>

<template>
  <div class="bg-gradient-to-b from-red-700 to-black min-h-screen flex items-center justify-center">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        title="Student Login"
        description="Enter your credentials to access your account."
        icon="i-lucide-user"
        :fields="fields"
        @submit="onSubmit"
      >
        <template #submit>
          <UButton class="w-full justify-center hover:bg-red-700" color="neutral" type="submit"
            >Login</UButton
          >
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>

<!-- <NuxtLink to="/password/reset" class="hover:underline"> Forgot password? </NuxtLink> -->
