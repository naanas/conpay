<script setup lang="ts">
import { onMounted, ref } from 'vue';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge.vue';
import type { Transaction, ApiResponse } from '../types';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-vue-next';

const transactions = ref<Transaction[]>([]);
const currentPage = ref(1);
const loading = ref(false);

const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

const fetchTransactions = async (page = 1) => {
  loading.value = true;
  try {
    const { data } = await api.get<ApiResponse<Transaction[]>>(`/admin/transactions?page=${page}&limit=10`);
    if (data.success) {
      transactions.value = data.data;
      currentPage.value = page;
    }
  } catch (e) { console.error(e); } finally { loading.value = false; }
};

onMounted(() => fetchTransactions(1));
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-800">Transactions</h1>
        <p class="mt-1 text-sm text-slate-500">Monitor semua transaksi yang masuk.</p>
      </div>
      <button class="flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors bg-white border rounded-lg shadow-sm border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600">
        <Filter class="w-4 h-4 mr-2" /> Filter Data
      </button>
    </div>

    <div class="overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-200">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-slate-600">
          <thead class="text-xs font-semibold uppercase border-b bg-slate-50/50 border-slate-200 text-slate-500">
            <tr>
              <th class="px-6 py-4">Date</th>
              <th class="px-6 py-4">Transaction ID</th>
              <th class="px-6 py-4">Customer</th>
              <th class="px-6 py-4">Method</th>
              <th class="px-6 py-4">Amount</th>
              <th class="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="loading">
              <td colspan="6" class="p-12 text-center text-slate-400">
                <div class="flex flex-col items-center">
                  <div class="w-8 h-8 mb-2 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
                  Loading data...
                </div>
              </td>
            </tr>
            <tr v-else-if="transactions.length === 0">
              <td colspan="6" class="p-8 text-center text-slate-500">Tidak ada data transaksi.</td>
            </tr>
            <tr v-else v-for="tx in transactions" :key="tx.id" class="transition-colors duration-150 hover:bg-slate-50 group">
              <td class="px-6 py-4 text-xs whitespace-nowrap text-slate-500">
                {{ new Date(tx.created_at).toLocaleDateString('id-ID') }}
                <div class="text-[10px] text-slate-400">{{ new Date(tx.created_at).toLocaleTimeString('id-ID') }}</div>
              </td>
              <td class="px-6 py-4 font-mono text-xs font-medium text-indigo-600 cursor-pointer group-hover:underline">
                #{{ tx.transaction_id.substring(0, 8) }}...
              </td>
              <td class="px-6 py-4">
                 <div class="font-medium text-slate-800">{{ tx.customer_name }}</div>
                 <div class="text-xs text-slate-400">{{ tx.customer_email }}</div>
              </td>
              <td class="px-6 py-4 text-xs whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-1 font-medium rounded bg-slate-100 text-slate-600">{{ tx.payment_partners?.code }}</span>
                  <span class="text-slate-500">{{ tx.payment_methods?.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4 font-bold text-slate-800 whitespace-nowrap">{{ formatIDR(tx.amount) }}</td>
              <td class="px-6 py-4 whitespace-nowrap"><StatusBadge :status="tx.status" /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/30">
        <span class="text-xs text-slate-500">Page {{ currentPage }}</span>
        <div class="flex gap-2">
          <button 
            @click="fetchTransactions(currentPage - 1)" 
            :disabled="currentPage === 1"
            class="p-2 transition-colors bg-white border rounded-lg border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft class="w-4 h-4 text-slate-600" />
          </button>
          <button 
            @click="fetchTransactions(currentPage + 1)" 
            :disabled="transactions.length < 10" 
            class="p-2 transition-colors bg-white border rounded-lg border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight class="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>