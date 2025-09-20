<script setup lang="ts">
import { useSupabaseClient, useRouter } from '#imports'
import type { Database } from '~/types/database.types'
import { useUserInfo } from '~/composables/useUserInfo'

definePageMeta({ middleware: 'auth-user' })

const supabase = useSupabaseClient<Database>()
const router = useRouter()

const { studentId, balance, firstName, middleName, lastName, suffix, loading, error } =
  useUserInfo()

async function signOut() {
  const { error: signOutError } = await supabase.auth.signOut()
  if (signOutError) {
    console.error(signOutError.message)
  } else {
    router.push('/login')
  }
}
</script>

<template>
  <UContainer>
    <div class="flex flex-col text-center mt-[5%]">
      <template v-if="loading">
        <p class="text-lg text-gray-500">Loading your information...</p>
      </template>

      <template v-else>
        <p v-if="error" class="text-red-500">{{ error }}</p>

        <p class="text-2xl">{{ firstName }} {{ middleName }} {{ lastName }} {{ suffix }}</p>
        <p class="text-sm">BS Computer Science 4A</p>

        <div class="flex justify-center mt-6">
          <div class="grid grid-cols-2 gap-4">
            <UButton class="justify-center w-[200px] h-[100px]" color="primary">
              Balance: ₱{{ balance }}
            </UButton>

            <UButton
              class="justify-center w-[200px] h-[100px]"
              color="primary"
              label="Transaction History"
            />

            <UModal>
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
        </div>
      </template>
    </div>
  </UContainer>
</template>
