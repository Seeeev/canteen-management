<script setup lang="ts">
import { useSupabaseClient, useAsyncData, useState } from '#imports'
import type { Database } from '~/types/database.types'
import JsBarcode from 'jsbarcode'
definePageMeta({
  middleware: 'auth-user',
})

const name = useState<string>('name', () => 'no email')

const supabase = useSupabaseClient<Database>()
const router = useRouter()
type User = Database['public']['Tables']['users']['Row']

const studentId = ref('----')

async function getUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.error('Error getting user:', error.message)
    return
  }

  name.value = user?.email || 'no email'
  const { data, error: fetchError } = await useAsyncData<User>('item', () =>
    $fetch<User>('/api/getUserInfo', {
      method: 'POST', // ✅ Changed from GET to POST, since you're using `readBody` on the server
      body: { email: name.value },
    })
  )

  if (fetchError.value) {
    console.error('Fetch error:', fetchError.value)
  } else {
    studentId.value = data.value?.student_id as string
  }
}

async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.log(error.message)
  } else {
    router.push('/login')
  }
}
</script>

<template>
  <UContainer>
    <!-- <h1>INDEX</h1>
    <h1>{{ name }}</h1>-->
    <UButton @click="getUser">Hello</UButton>

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
