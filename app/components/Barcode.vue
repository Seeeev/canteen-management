<template>
  <!-- Pass class from parent if you want to control size -->
  <canvas ref="barcodeCanvas" :class="canvasClass"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import JsBarcode from 'jsbarcode'

/**
 * Props for flexibility
 */
const props = defineProps<{
  value: string // the barcode value
  options?: JsBarcode.Options // any JsBarcode options
  canvasClass?: string // optional Tailwind/extra classes
}>()

const barcodeCanvas = ref<HTMLCanvasElement | null>(null)

/**
 * Function to render barcode
 */
function renderBarcode() {
  if (barcodeCanvas.value) {
    JsBarcode(barcodeCanvas.value, props.value, {
      format: 'CODE128',
      displayValue: true,
      lineColor: '#000000',
      ...props.options, // let parent override defaults
    })
  }
}

onMounted(renderBarcode)

// Re-render if the value or options change
watch(() => [props.value, props.options], renderBarcode, { deep: true })
</script>
