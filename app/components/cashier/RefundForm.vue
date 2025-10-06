<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const { fetchBalance, purchase, refund } = useStudent()

const toast = useToast()

const purchaseSchema = z.object({
  student_number: z.string(),
  amount: z.coerce.number().min(0, 'Amount must be a number'),
})

type PurchaseSchema = z.output<typeof purchaseSchema>

const purchaseState = reactive<Partial<PurchaseSchema>>({
  student_number: '',
  amount: undefined,
})

async function onSubmit(event: FormSubmitEvent<PurchaseSchema>) {
  await refund({ student_number: event.data.student_number, transaction_number: event.data.amount })
  // const { student_id, amount } = event.data

  // const balance = await fetchBalance(student_id)
  // if (balance === null) return

  // if (balance > amount) {
  //   await purchase(student_id, amount, balance, 1)
  // } else {
  //   toast.add({
  //     title: 'Error',
  //     description: `Insufficient balance! Needs ${amount - balance} more.`,
  //     color: 'error',
  //   })
  // }
}
</script>
<template>
  <div>
    <UForm :schema="purchaseSchema" :state="purchaseState" class="space-y-4" @submit="onSubmit">
      <UFormField label="Student ID" name="id">
        <UInput v-model="purchaseState.student_number" class="w-full" />
      </UFormField>

      <UFormField label="Amount" name="amount">
        <UInput v-model="purchaseState.amount" class="w-full" />
      </UFormField>

      <UButton type="submit" class="w-full justify-center"> Refund </UButton>
    </UForm>
  </div>
</template>
