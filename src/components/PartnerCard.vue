<script setup lang="ts">
import { ref } from 'vue';
import { 
  DollarSign, Shield, Clock, RotateCw, 
  Eye, EyeOff, Globe, Hash, Key 
} from 'lucide-vue-next';
import type { Partner } from '../types';

const props = defineProps<{
  partner: Partner;
}>();

// State lokal untuk menyimpan status show/hide credential per field
const visibleCredentials = ref<Record<string, boolean>>({});

const toggleVisibility = (key: string) => {
  visibleCredentials.value[key] = !visibleCredentials.value[key];
};

// Helper: Format Rupiah
const formatIDR = (val: number) => 
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

// Helper: Ubah camelCase jadi Title Case (misal: merchantCode -> Merchant Code)
const formatKey = (key: string) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

// Helper: Deteksi field sensitif (Key, Secret, Password)
const isSensitive = (key: string) => /key|secret|password|token/i.test(key);
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden transition-all duration-300 bg-white border shadow-sm group rounded-2xl border-slate-200 hover:shadow-md hover:border-indigo-200">
    
    <div class="p-5 border-b border-slate-100 bg-slate-50/50">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-10 h-10 text-sm font-bold bg-white border rounded-lg shadow-sm border-slate-200 text-slate-700">
            {{ partner.code.substring(0, 3).toUpperCase() }}
          </div>
          <div>
            <h3 class="text-base font-bold leading-tight text-slate-800">{{ partner.name }}</h3>
            <span class="text-[10px] font-mono bg-slate-200 px-1.5 py-0.5 rounded text-slate-600 mt-1 inline-block">
              {{ partner.code }}
            </span>
          </div>
        </div>
        <span :class="partner.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-rose-100 text-rose-700 border-rose-200'" class="px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide">
          {{ partner.status }}
        </span>
      </div>
    </div>

    <div class="flex flex-col flex-1 p-5 space-y-5">
      
      <div class="grid grid-cols-2 p-3 border rounded-lg bg-slate-50 border-slate-100 gap-y-2 gap-x-4">
        <div class="col-span-2 text-[10px] font-semibold text-slate-400 uppercase flex items-center gap-1 mb-1">
          <DollarSign class="w-3 h-3" /> Fee Structure
        </div>
        <div>
          <p class="text-[10px] text-slate-500">Fixed Fee</p>
          <p class="text-xs font-semibold text-slate-700">{{ formatIDR(partner.fee_structure.fixed) }}</p>
        </div>
        <div>
          <p class="text-[10px] text-slate-500">Percentage</p>
          <p class="text-xs font-semibold text-slate-700">{{ partner.fee_structure.percentage }}%</p>
        </div>
      </div>

      <div class="flex-1">
        <h4 class="text-[10px] font-semibold text-slate-400 uppercase mb-2 flex items-center gap-1">
          <Shield class="w-3 h-3" /> Credentials
        </h4>
        <div class="space-y-2">
          <div v-for="(val, key) in partner.credentials" :key="key" class="bg-slate-50 p-2.5 rounded border border-slate-100 flex flex-col relative group/item">
            <div class="flex items-center gap-1.5 mb-1">
              <Globe v-if="key === 'baseUrl'" class="w-3 h-3 text-slate-400" />
              <Key v-else-if="isSensitive(String(key))" class="w-3 h-3 text-slate-400" />
              <Hash v-else class="w-3 h-3 text-slate-400" />
              
              <span class="text-[9px] text-slate-500 uppercase font-bold tracking-wider">{{ formatKey(String(key)) }}</span>
            </div>
            
            <div class="flex justify-between items-center min-h-[1.25rem]">
              <span class="w-full pr-6 font-mono text-xs truncate select-all text-slate-700">
                <template v-if="isSensitive(String(key)) && !visibleCredentials[key]">
                  ••••••••••••••••••••
                </template>
                <template v-else>
                  {{ val }}
                </template>
              </span>

              <button 
                v-if="isSensitive(String(key))"
                @click="toggleVisibility(String(key))"
                class="absolute p-1 transition-all rounded opacity-0 right-2 bottom-2 text-slate-400 hover:text-indigo-600 hover:bg-white group-hover/item:opacity-100 focus:opacity-100"
                :title="visibleCredentials[key] ? 'Hide' : 'Show'"
              >
                <EyeOff v-if="visibleCredentials[key]" class="w-3.5 h-3.5" />
                <Eye v-else class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3 text-[10px] text-slate-500 pt-3 border-t border-slate-100 mt-auto">
        <span class="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded" title="Timeout">
          <Clock class="w-3 h-3" /> {{ partner.config.timeout / 1000 }}s
        </span>
        <span class="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded" title="Retry Attempts">
          <RotateCw class="w-3 h-3" /> {{ partner.config.retry_attempts }}x
        </span>
      </div>
    </div>
  </div>
</template>