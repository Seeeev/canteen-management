<script setup lang="ts">
import TransactionTable from '~/components/admin/TransactionTable.vue'

definePageMeta({
  layout: 'dashboard',
})
</script>
<template>
  <UContainer><TransactionTable /></UContainer>
</template>
