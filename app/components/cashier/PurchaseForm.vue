<script setup lang="ts">
import type { colorPicker } from '#build/ui'
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'
import { email } from 'zod/v4'

const props = defineProps<{ cashier_id: number }>()

const { fetchBalance, purchase } = useStudent()

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
  const { student_number, amount } = event.data

  const balance = await fetchBalance(student_number)
  if (balance === null) return

  if (balance > amount) {
    await purchase(student_number, amount, balance, props.cashier_id)
  } else {
    showError(`Insufficient balance! Needs ${amount - balance} more.`)
  }
}
</script>
<template>
  <div>
    <UForm :schema="purchaseSchema" :state="purchaseState" class="space-y-4" @submit="onSubmit">
      <UFormField label="Student ID" name="id">
        <template #label>
          <span class="text-white">Student ID</span>
        </template>
        <UInput v-model="purchaseState.student_number" class="w-full">
          <template #trailing>
            <UButton
              variant="link"
              size="lg"
              icon="i-lucide-scan-barcode"
              aria-label="Scan barcode"
              @click="() => console.log('hello')"
            />
          </template>
        </UInput>
      </UFormField>

      <UFormField label="Amount" name="amount">
        <template #label>
          <span class="text-white">Amount</span>
        </template>
        <UInput v-model="purchaseState.amount" class="w-full" />
      </UFormField>

      <UButton type="submit" class="w-full justify-center hover:bg-red-700 bg-red-800"
        >Purchase</UButton
      >
    </UForm>
  </div>
</template>
