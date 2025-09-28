<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'
import { useCashier } from '~/composables/useCashier'
import { useStudent } from '~/composables/useStudent'

definePageMeta({ middleware: 'auth-cashier' })

const { user, signOut, showError } = useCashier()
const { fetchBalance, purchase, fetchStudentDetails } = useStudent()

const email = user.value?.email
const created_at = user.value?.created_at

const schema = z.object({
  student_id: z.string(),
  amount: z.coerce.number().min(0, 'Amount must be a number'),
})
type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  student_id: '',
  amount: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { student_id, amount } = event.data

  const balance = await fetchBalance(student_id)
  if (balance === null) return

  if (balance > amount) {
    await purchase(student_id, amount, balance)
  } else {
    showError(`Insufficient balance! Needs ${amount - balance} more.`)
  }
}


</script>

<template>
  <div>
    <UAvatar text="S"/>


  </div>
  <!-- <div>
    <p>Cashier Page</p>
    <p>{{ email }}</p>
    <p>{{ created_at }}</p>

    <UForm :schema="schema" :state="state" @submit="onSubmit">
      <UFormField label="Student ID" name="student_id">
        <UInput v-model="state.student_id" />
      </UFormField>
      <UFormField label="Amount" name="amount">
        <UInput v-model="state.amount" type="number" />
      </UFormField>
      <UButton type="submit">Submit</UButton>
    </UForm>

    <UButton @click="signOut">Sign out</UButton>
  </div> -->
</template>
