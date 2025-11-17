<script setup lang="ts">
import RegisterStudentForm from '~/components/admin/RegisterStudentForm.vue'
import StudentTable from '~/components/admin/StudentTable.vue'
import { useStudentBalance } from '~/composables/useStudentBalance'
definePageMeta({
  layout: 'dashboard',
  middleware: 'roles',
})

// const { deposit, withraw } = useAdmin()

// function onClickDeposit() {
//   withraw({ student_number: '0001', amount: 1 })
// }

// function onClickWithraw() {
//   deposit({ student_number: '0001', amount: -1 })
// }

const email = ref('')
const message = ref('')

const deleteByEmail = async () => {
  try {
    await $fetch('/api/deleteUser', {
      method: 'POST',
      body: { email: email.value },
    })
    message.value = `User ${email.value} deleted successfully`
  } catch (err: any) {
    message.value = err.data?.message || 'Error deleting user'
  }
}
</script>
<template>
  <div class="flex justify-center items-center">
    <RegisterStudentForm />
    <!-- <StudentTable /> -->
    <!-- <UButton label="Deposit" @click="onClickDeposit" />
    <UButton label="Withraw" @click="onClickWithraw" />

    <UInput v-model="email" placeholder="Enter email" />
    <UButton @click="deleteByEmail">Delete User</UButton>
    <p>{{ message }}</p> -->
  </div>
</template>
