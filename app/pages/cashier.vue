<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'
import type { Database } from '~/types/database.types'

definePageMeta({ middleware: 'auth-cashier' })

type UserRow = Database['public']['Tables']['users']['Row']

const supabase = useSupabaseClient<Database>()
const router = useRouter()
async function signOut() {
  await supabase.auth.signOut()
  router.push('/cashier-login')
}
const user = useSupabaseUser()

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

async function recordTransaction(options: { amount: number; student_id: string }) {
  const { error } = await supabase.from('transactions').insert({
    amount: options.amount * -1,
    cashier_id: parseInt(user.value!.id),
    student_id: options.student_id,
  })
  if (error) {
    toast.add({ title: 'Error', description: error.message, color: 'error' })
  }
}

async function deductBalance(option: { student_id: string; amount: number; balance: number }) {
  // subtract the amount to the balance
  var currentBalance = option.balance - option.amount

  const { error } = await supabase
    .from('users')
    .update({ balance: currentBalance })
    .eq('student_id', option.student_id)
  if (error) {
    toast.add({ title: 'Error', description: error.message, color: 'error' })
  } else {
    await recordTransaction({
      amount: option.amount,
      student_id: option.student_id,
    })

    toast.add({
      title: 'Success',
      description: `${option.amount} has beed sucessfuly deducted to ${option.student_id}.`,
      color: 'success',
    })
  }
}

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  // get the balance of the student if id exist
  const { data, error } = await supabase
    .from('users')
    .select('balance, student_id')
    .eq('student_id', event.data.student_id)
  if (error) {
    toast.add({ title: 'Error', description: error.message, color: 'error' })
  } else {
    var amount = event.data.amount
    var student_id = event.data.student_id
    var balance = data.at(0)?.balance!
    // check if balance is enough to buy
    if (data.at(0)) {
      if (data.at(0)!.balance! > event.data.amount) {
        // record transaction and deduct balance if balance is enough
        await deductBalance({
          amount,
          student_id,
          balance,
        })
      } else {
        toast.add({
          title: 'Error',
          description: `Balance not enough! Needs ${
            event.data.amount - data.at(0)!.balance!
          } more.`,
          color: 'error',
        })
      }
    }
  }

  // check if both student id exists and has sufficient balance
  // var doesStudentIdExist = await studentIdExist(event.data.student_id)
  // var sufficientBanlance = await hasSufficientBanlance({
  //   amount: event.data.amount,
  //   stundent_id: event.data.student_id,
  // })

  // if (doesStudentIdExist && hasSufficientBanlance) {
  // }
}

async function studentIdExist(student_id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('student_id')
    .eq('student_id', student_id)
    .single()
  if (data?.student_id) {
    return true
  }
  return false
}

async function postTransaction(options: { amount: number; stundent_id: string }) {
  const { error } = await supabase.from('transactions').insert({
    amount: options.amount,
    cashier_id: parseInt(user.value!.id),
    student_id: options.stundent_id,
  })

  if (error) {
    toast.add({ title: 'Error', description: error.message, color: 'error' })
  } else {
    toast.add({ title: 'Success', description: 'Transaction success!', color: 'success' })
  }
}

// onMounted(async () => {
//   const { error } = await supabase.from('users').upsert({
//     balance: 2332,
//     course: 'Course A',
//     year: '1',
//     section: 'A',
//     email: 'asdasdkn@gmail.com',
//     first_name: 'asdasd',
//     middle_name: 'asdasd',
//     last_name: 'asdas',
//     student_id: '8234872634',

//   }, {
//     onConflict: 'student_id'
//   })

//   if (error) {
//     toast.add({ title: 'error', description: error.message, color: 'error' })
//   }
// })
</script>
<template>
  <div>
    <p>cashier page</p>
    <p>{{ email }}</p>
    <p>{{ created_at }}</p>

    <UForm :schema="schema" :state="state" @submit="onSubmit">
      <UFormField label="Student ID" name="student_id">
        <UInput v-model="state.student_id" />
      </UFormField>
      <UFormField label="Amount" name="amount">
        <UInput v-model="state.amount" type="number" />
      </UFormField>
      <UButton type="submit"> Submit </UButton>
    </UForm>

    <UButton @click="signOut">Sign out</UButton>
  </div>
</template>
