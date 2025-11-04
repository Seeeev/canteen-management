<script setup lang="ts">
import RegisterCashier from '~/components/admin/RegisterCashierForm.vue'
definePageMeta({
  layout: 'dashboard',
  middleware: 'roles',
})

</script>

<template>
  <div class="flex items-center justify-center">
    <RegisterCashier />
  </div>
</template>
