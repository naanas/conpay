<script setup lang="ts">
import { onMounted, ref } from 'vue';
import api from '../api/axios';
import StatsCard from '../components/StatsCard.vue';
import StatusBadge from '../components/StatusBadge.vue';
import type { DashboardStats, Transaction, ApiResponse } from '../types';

interface DashboardData {
  stats: DashboardStats;
  recent_transactions: Transaction[];
}

const stats = ref<DashboardStats | null>(null);
const recentTx = ref<Transaction[]>([]);

const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

onMounted(async () => {
  try {
    const { data } = await api.get<ApiResponse<DashboardData>>('/admin/dashboard');
    if (data.success) {
      stats.value = data.data.stats;
      recentTx.value = data.data.recent_transactions;
    }
  } catch (e) { console.error(e); }
});
</script>

<template>
  <div class="space-y-8">
    <h1 class="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
    
    <div v-if="stats" class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatsCard title="Total Transactions" :value="stats.total_transactions" color="blue" />
      <StatsCard title="Successful" :value="stats.success_transactions" color="green" :subtext="`Rate: ${stats.success_rate}%`" />
      <StatsCard title="Pending" :value="stats.pending_transactions" color="yellow" />
      <StatsCard title="Today's Revenue" :value="formatIDR(stats.today_revenue)" color="blue" />
    </div>
    <div v-else class="text-gray-500">Loading stats...</div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 font-bold text-gray-800">Recent Transactions</div>
      <table class="w-full text-left text-sm text-gray-600">
        <thead class="bg-gray-50 text-gray-500 uppercase text-xs">
          <tr><th class="px-6 py-3">Trx ID</th><th class="px-6 py-3">Customer</th><th class="px-6 py-3">Amount</th><th class="px-6 py-3">Status</th></tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="tx in recentTx" :key="tx.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 font-mono text-xs">{{ tx.transaction_id }}</td>
            <td class="px-6 py-4">{{ tx.customer_email }}</td>
            <td class="px-6 py-4 font-medium">{{ formatIDR(tx.amount) }}</td>
            <td class="px-6 py-4"><StatusBadge :status="tx.status" /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>