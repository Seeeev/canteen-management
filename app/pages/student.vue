<script setup lang="ts">
import { useSupabaseClient, useRouter } from '#imports'
import type { Database } from '~/types/database.types'
import { useUserInfo } from '~/composables/useUserInfo'
import TransactionHistory from '~/components/student/TransactionHistory.vue'

definePageMeta({ middleware: ['auth-user', 'roles'] })

const supabase = useSupabaseClient<Database>()
const router = useRouter()
const user = useSupabaseUser()

const buttonColor = 'bg-red-400 hover:bg-red-500'

onBeforeMount(async () => {
  if (user.value?.user_metadata.role != 'student') {
    await supabase.auth.signOut()
    router.push('/login')
  }
})

const { id, student_number, balance, firstName, middleName, lastName, suffix, loading, error } =
  useUserInfo()
const { getEnrollment } = useStudent()

const fullName = ref('')
const major = ref('')
const program = ref('')

watch(
  () => student_number.value,
  async (newStudentNumber) => {
    if (!newStudentNumber || newStudentNumber.startsWith('-')) return

    const result = await getEnrollment(newStudentNumber)
    if (result) {
      fullName.value = result.fullName
      major.value = result.major ?? ''
      program.value = result.program ?? ''
    }
  },
  { immediate: true },
)

async function signOut() {
  const { error: signOutError } = await supabase.auth.signOut()
  if (signOutError) {
    console.error(signOutError.message)
  } else {
    router.push('/login')
  }
}

function showProfile() {
  router.push(`/students/${id.value}`)
}
</script>

<template>
  <div class="bg-gradient-to-b from-red-700 to-black min-h-screen flex items-center justify-center">
    <UContainer>
      <div class="flex flex-col text-center">
        <template v-if="loading">
          <p class="text-lg text-white">Loading your information...</p>
        </template>

        <template v-else>
          <p v-if="error" class="text-red-500">{{ error }}</p>

          <p class="text-2xl text-white">{{ fullName }}</p>
          <p class="text-sm text-white">{{ program }} {{ major }}</p>

          <div class="flex justify-center mt-6">
            <div class="grid grid-cols-2 gap-4">
              <UButton class="justify-center w-[200px] h-[100px]" color="neutral">
                Balance: ₱{{ balance }}
              </UButton>

              <UModal>
                <UButton
                  class="justify-center w-[200px] h-[100px]"
                  color="neutral"
                  label="Transaction History"
                />
                <template #content>
                  <TransactionHistory :student_number="student_number" />
                </template>
              </UModal>

              <UModal :ui="{ content: 'sm:w-[200px]' }">
                <UButton
                  class="justify-center w-[200px] h-[100px]"
                  color="neutral"
                  label="Show ID Number"
                />
                <template #content>
                  <Barcode :value="student_number" />
                </template>
              </UModal>

              <UButton
                class="justify-center w-[200px] h-[100px]"
                color="neutral"
                label="Siena E-Menu"
              />

              <UButton class="justify-center col-span-2" color="neutral" label="Settings" />
              <UButton
                class="justify-center col-span-2"
                color="neutral"
                label="Profile"
                @click="showProfile"
              />

              <UButton
                @click="signOut"
                class="justify-center col-span-2"
                color="neutral"
                label="Sign Out"
              />
            </div>
          </div>
        </template>
      </div>
    </UContainer>
  </div>
</template>
