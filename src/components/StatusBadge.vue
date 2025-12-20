<script setup lang="ts">
defineProps<{
  status: string
}>();

const colors: Record<string, string> = {
  SUCCESS: 'bg-green-100 text-green-700 border-green-200',
  PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  FAILED: 'bg-red-100 text-red-700 border-red-200',
};
</script>

<template>
  <span :class="['px-2.5 py-0.5 rounded-full text-xs font-bold border', colors[status] || 'bg-gray-100 text-gray-600']">
    {{ status }}
  </span>
</template>