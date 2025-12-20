<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import api from '../api/axios';
import type { Partner, ApiResponse } from '../types';
import PartnerCard from '../components/PartnerCard.vue';
import { 
  Activity, Server, Smartphone, Building2 
} from 'lucide-vue-next';

const partners = ref<Partner[]>([]);
const loading = ref(true);

// Logic Pengelompokan (Grouping)
const gateways = computed(() => partners.value.filter(p => p.type === 'PAYMENT_GATEWAY'));
const banks = computed(() => partners.value.filter(p => p.type === 'BANK_VA'));
const ewallets = computed(() => partners.value.filter(p => p.type === 'EWALLET'));

onMounted(async () => {
  try {
    const { data } = await api.get<ApiResponse<Partner[]>>('/admin/partners');
    if (data.success) {
      partners.value = data.data;
    }
  } catch (e) {
    console.error("Failed to fetch partners:", e);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="pb-12 space-y-8">
    <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-800">Payment Partners</h1>
        <p class="mt-1 text-sm text-slate-500">Manage integration credentials, fees, and configurations.</p>
      </div>
      <button class="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
        <Activity class="w-4 h-4" /> Add New Partner
      </button>
    </div>

    <div v-if="loading" class="py-20 text-center">
      <div class="w-10 h-10 mx-auto mb-4 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
      <p class="text-sm text-slate-500">Loading partners configuration...</p>
    </div>

    <template v-else>
      
      <section v-if="gateways.length > 0" class="animate-fade-in">
        <div class="flex items-center gap-2 pb-2 mb-4 border-b border-slate-200">
          <div class="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
            <Server class="w-5 h-5" />
          </div>
          <h2 class="text-lg font-bold text-slate-700">Payment Gateways</h2>
          <span class="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full ml-auto">{{ gateways.length }} Connected</span>
        </div>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <PartnerCard v-for="p in gateways" :key="p.id" :partner="p" />
        </div>
      </section>

      <section v-if="banks.length > 0" class="animate-fade-in" :class="{ 'mt-10': gateways.length > 0 }">
        <div class="flex items-center gap-2 pb-2 mb-4 border-b border-slate-200">
          <div class="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
            <Building2 class="w-5 h-5" />
          </div>
          <h2 class="text-lg font-bold text-slate-700">Bank Virtual Accounts</h2>
          <span class="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full ml-auto">{{ banks.length }} Connected</span>
        </div>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <PartnerCard v-for="p in banks" :key="p.id" :partner="p" />
        </div>
      </section>

      <section v-if="ewallets.length > 0" class="animate-fade-in" :class="{ 'mt-10': banks.length > 0 || gateways.length > 0 }">
        <div class="flex items-center gap-2 pb-2 mb-4 border-b border-slate-200">
          <div class="p-1.5 bg-purple-100 text-purple-600 rounded-lg">
            <Smartphone class="w-5 h-5" />
          </div>
          <h2 class="text-lg font-bold text-slate-700">E-Wallets</h2>
          <span class="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full ml-auto">{{ ewallets.length }} Connected</span>
        </div>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <PartnerCard v-for="p in ewallets" :key="p.id" :partner="p" />
        </div>
      </section>

      <div v-if="partners.length === 0" class="py-16 text-center bg-white border border-dashed rounded-2xl border-slate-300">
        <p class="font-medium text-slate-500">No partners found.</p>
        <p class="mt-1 text-sm text-slate-400">Start by adding a new payment partner.</p>
      </div>
    </template>
  </div>
</template>

<style>
/* Simple Fade In Animation */
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>