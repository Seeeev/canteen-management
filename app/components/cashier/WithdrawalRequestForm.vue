<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const { checkStudentExists, getStudentBalance, createWithdrawalRequest } = useStudent()

const loading = ref(false)
const showConfirm = ref(false)
const studentBalance = ref<number | null>(null)

// Zod schema
const withdrawalSchema = z.object({
  student_number: z
    .string()
    .min(1, 'Student ID is required')
    .refine(async (val) => await checkStudentExists(val), {
      message: 'Student ID does not exist',
    }),
  amount: z.coerce.number().min(1, 'Amount must be greater than 0'),
})

type WithdrawalSchema = z.infer<typeof withdrawalSchema>

const withdrawalState = reactive<Partial<WithdrawalSchema>>({
  student_number: '',
  amount: undefined,
})

// Watch the student_number to fetch balance (if valid)
watch(
  () => withdrawalState.student_number,
  async (val) => {
    studentBalance.value = null
    if (!val) return

    if (await checkStudentExists(val)) {
      studentBalance.value = await getStudentBalance(val)
    }
  },
)

let formPayload: WithdrawalSchema | null = null

// When the form is submitted, prepare payload and open confirm modal
async function onSubmit(event: FormSubmitEvent<WithdrawalSchema>) {
  const { student_number, amount } = event.data

  if (studentBalance.value !== null && amount !== undefined && amount > studentBalance.value) {
    useToast().add({
      title: 'Insufficient Balance',
      description: "Amount exceeds the student's current balance.",
      color: 'error',
    })
    return
  }

  formPayload = event.data
  showConfirm.value = true
}

// When user confirms → do the creation
async function confirmRequest() {
  if (!formPayload) {
    showConfirm.value = false
    return
  }

  loading.value = true

  try {
    await createWithdrawalRequest(formPayload)

    useToast().add({
      title: 'Request Submitted',
      description: 'Withdrawal request successfully created.',
      color: 'success',
    })

    // Reset form + balance
    withdrawalState.student_number = ''
    withdrawalState.amount = undefined
    studentBalance.value = null
  } catch (err) {
    console.error(err)
    useToast().add({
      title: 'Error',
      description: 'Failed to create withdrawal request.',
      color: 'error',
    })
  } finally {
    loading.value = false
    showConfirm.value = false
  }
}
</script>

<template>
  <div>
    <UForm :schema="withdrawalSchema" :state="withdrawalState" @submit="onSubmit" class="space-y-4">
      <!-- Student ID -->
      <UFormField name="student_number" label="Student ID">
        <UInput v-model="withdrawalState.student_number" class="w-full" />
      </UFormField>

      <!-- Show balance if loaded -->
      <div v-if="studentBalance !== null" class="text-sm text-white">
        <strong>Current Balance:</strong> ₱{{ Number(studentBalance).toLocaleString() }}
      </div>

      <!-- Amount -->
      <UFormField name="amount" label="Amount">
        <UInput v-model="withdrawalState.amount" class="w-full" />
      </UFormField>

      <!-- Submit Button -->
      <UButton
        type="submit"
        :loading="loading"
        :disabled="loading"
        class="w-full justify-center bg-red-800 hover:bg-red-700"
      >
        Request
      </UButton>
    </UForm>

    <!-- Confirmation Modal (using latest API) -->
    <UModal v-model:open="showConfirm" :dismissible="false">
      <!-- Trigger slot (required, though not used visually) -->
      <template #default>
        <div style="display: none"></div>
      </template>

      <!-- Modal content -->
      <template #content>
        <div class="p-6 bg-white rounded-lg shadow-md space-y-4">
          <h2 class="text-xl font-bold">Confirm Withdrawal</h2>
          <p>
            Student ID: <strong>{{ withdrawalState.student_number }}</strong>
          </p>
          <p>
            Amount: <strong>₱{{ withdrawalState.amount }}</strong>
          </p>

          <div class="flex justify-end gap-3">
            <UButton color="neutral" @click="showConfirm = false">Cancel</UButton>
            <UButton color="error" :loading="loading" @click="confirmRequest"> Confirm </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
