<script setup lang="ts">
import { useSupabaseClient, useSupabaseUser } from '#imports'
import type { Database } from '~/types/database.types'

definePageMeta({ middleware: 'auth-user' })

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser() // 🔹 reactive logged-in user
const studentId = ref<string>('----') // default placeholder

watchEffect(async () => {
  // Only fetch when the user is ready and has an email
  if (!user.value?.email) return

  try {
    const data = await $fetch<Database['public']['Tables']['users']['Row']>('/api/getUserInfo', {
      method: 'POST',
      body: { email: user.value.email },
    })
    studentId.value = data?.student_id ?? '----'
  } catch (err) {
    console.error('Failed to fetch studentId:', (err as Error).message)
    studentId.value = '----'
  }
})

async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error(error.message)
  } else {
    useRouter().push('/login')
  }
}
</script>

<template>
  <UContainer>
    <!-- <h1>INDEX</h1>
    <h1>{{ name }}</h1>-->
    <!-- <UButton @click="getUser">Hello</UButton> -->

    <div class="flex flex-col text-center mt-[5%]">
      <p class="text-2xl">Seven Faura Abante</p>
      <p class="text-sm">BS Computer Science 4A</p>

      <!-- <div class="h-[50px]"></div>
      <USeparator />
      <div class="h-[20px]"></div> -->
      <div class="flex justify-center">
        <div class="grid grid-cols-2 gap-4">
          <UButton
            class="justify-center w-[200px] h-[100px]"
            color="primary"
            label="Balance Inquiry"
          />
          <UButton
            class="justify-center w-[200px] h-[100px]"
            color="primary"
            label="Transaction History"
          />

          <UModal>
            <!-- <UButton label="Open" color="neutral" variant="subtle" /> -->
            <UButton
              class="justify-center w-[200px] h-[100px]"
              color="primary"
              label="Show ID Number"
            />
            <template #content>
              <Barcode :value="studentId" />
            </template>
          </UModal>
          <UButton
            class="justify-center w-[200px] h-[100px]"
            color="primary"
            label="Siena E-Menu"
          />
          <UButton class="justify-center col-span-2" color="primary" label="Settings" />
          <UButton
            @click="signOut"
            class="justify-center col-span-2"
            color="primary"
            label="Sign Out"
          />
        </div>
        <!-- <UBadge icon="i-lucide-rocket" size="xl" color="primary" variant="solid">Badge</UBadge>
        <UBadge icon="i-lucide-rocket" size="xl" color="primary" variant="solid">Badge</UBadge>
        <UBadge icon="i-lucide-rocket" size="xl" color="primary" variant="solid">Badge</UBadge> -->
      </div>
    </div>
  </UContainer>
</template>

<!-- <template>
  <div>{{ greeting }}</div>
</template>

<script setup>
const hour = new Date().getHours()
const greeting = hour < 12 ? 'Good morning' : 'Good afternoon'
</script> -->

<!-- <template>
  <UApp class="responsive-content">
    <div class="hidden md:block">Desktop content</div>
    <div class="md:hidden">Mobile content</div>
  </UApp>
</template> -->
