<script setup lang="ts">
import { ref } from 'vue'
import { useStudentBalance } from '~/composables/useStudentBalance'

definePageMeta({
  layout: 'dashboard',
})

const { getStudent, deposit, withdraw } = useStudentBalance()
const { recordTransaction } = useStudent()

// Form state
const studentNumber = ref('')
const amount = ref<number | null>(null)
const studentData = ref<any>(null)
const loading = ref(false)

const fetchStudent = async () => {
  if (!studentNumber.value) return
  loading.value = true
  try {
    studentData.value = await getStudent(studentNumber.value)
  } catch (e: any) {
    useToast().add({ title: 'Error', description: e.message, color: 'error' })
    studentData.value = null
  } finally {
    loading.value = false
  }
}

const onDeposit = async () => {
  if (!studentNumber.value || !amount.value) return
  loading.value = true
  try {
    studentData.value = await deposit(studentNumber.value, amount.value)
    await recordTransaction({
      amount: amount.value,
      cashier_id: 4,
      student_number: studentNumber.value,
      transaction_type: 'deposite',
    })
    useToast().add({ title: 'Success', description: 'Deposit successful', color: 'success' })
    amount.value = null
  } catch (e: any) {
    useToast().add({ title: 'Error', description: e.message, color: 'error' })
  } finally {
    loading.value = false
  }
}

const onWithdraw = async () => {
  if (!studentNumber.value || !amount.value) return
  loading.value = true
  try {
    studentData.value = await withdraw(studentNumber.value, amount.value)
    await recordTransaction({
      amount: amount.value,
      cashier_id: 4,
      student_number: studentNumber.value,
      transaction_type: 'withdraw',
    })
    useToast().add({ title: 'Success', description: 'Withdrawal successful', color: 'success' })
    amount.value = null
  } catch (e: any) {
    useToast().add({ title: 'Error', description: e.message, color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="p-4 space-y-6 max-w-md mx-auto">
    <h2 class="text-xl font-semibold">Student Balance Management</h2>

    <!-- Student lookup -->
    <div class="flex gap-2">
      <UInput v-model="studentNumber" placeholder="Student Number" />
      <UButton @click="fetchStudent" :loading="loading">Fetch</UButton>
    </div>

    <!-- Show student info -->
    <div v-if="studentData" class="p-4 border rounded space-y-2">
      <div><strong>Name:</strong> {{ studentData.first_name }} {{ studentData.last_name }}</div>
      <div><strong>Student Number:</strong> {{ studentData.student_number }}</div>
      <div>
        <strong>Balance:</strong> ₱{{
          Number(studentData.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })
        }}
      </div>
    </div>

    <!-- Deposit / Withdraw -->
    <div v-if="studentData" class="space-y-2">
      <UInput v-model.number="amount" type="number" placeholder="Amount" :min="0" />
      <div class="flex gap-2">
        <UButton @click="onDeposit" :loading="loading" color="success">Deposit</UButton>
        <UButton @click="onWithdraw" :loading="loading" color="warning">Withdraw</UButton>
      </div>
    </div>
  </div>
</template>
