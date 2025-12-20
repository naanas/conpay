<script setup lang="ts">
import { computed } from 'vue';
import { TrendingUp, TrendingDown, Activity, FileText } from 'lucide-vue-next';

const props = defineProps<{
  title: string;
  value: string | number;
  subtext?: string;
  color: 'blue' | 'green' | 'yellow' | 'red';
  iconType?: string; // Optional identifier for icon
}>();

// Mapping warna untuk background & text
const colorMap = {
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-100',   iconBg: 'bg-blue-100' },
  green:  { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', iconBg: 'bg-emerald-100' },
  yellow: { bg: 'bg-amber-50',  text: 'text-amber-600',  border: 'border-amber-100',  iconBg: 'bg-amber-100' },
  red:    { bg: 'bg-rose-50',   text: 'text-rose-600',   border: 'border-rose-100',   iconBg: 'bg-rose-100' },
};

const current = computed(() => colorMap[props.color]);
</script>

<template>
  <div class="p-6 transition-all duration-300 bg-white border shadow-sm rounded-2xl border-slate-100 hover:shadow-md hover:-translate-y-1 group">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm font-medium text-slate-500">{{ title }}</p>
        <h3 class="mt-2 text-2xl font-bold tracking-tight text-slate-800">{{ value }}</h3>
      </div>
      
      <div :class="`p-3 rounded-xl ${current.bg} ${current.text} group-hover:scale-110 transition-transform`">
        <Activity v-if="color === 'blue'" class="w-6 h-6" />
        <TrendingUp v-else-if="color === 'green'" class="w-6 h-6" />
        <TrendingDown v-else-if="color === 'red'" class="w-6 h-6" />
        <FileText v-else class="w-6 h-6" />
      </div>
    </div>
    
    <div v-if="subtext" class="flex items-center mt-4 text-xs font-medium">
      <span :class="`px-2 py-1 rounded-full ${current.bg} ${current.text}`">
        {{ subtext }}
      </span>
      <span class="ml-2 text-slate-400">vs last month</span>
    </div>
  </div>
</template>