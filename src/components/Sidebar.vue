<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import { LayoutDashboard, Receipt, Users, LogOut, X, Wallet } from 'lucide-vue-next';
import { useRoute } from 'vue-router';

const props = defineProps<{
  isOpen: boolean
}>();

const emit = defineEmits(['close']);

const auth = useAuthStore();
const route = useRoute();
const isActive = (path: string) => route.path === path;

const menuItems = [
  { path: '/', name: 'Dashboard', icon: LayoutDashboard },
  { path: '/transactions', name: 'Transactions', icon: Receipt },
  { path: '/partners', name: 'Partners', icon: Users },
];
</script>

<template>
  <div 
    v-if="isOpen" 
    @click="$emit('close')"
    class="fixed inset-0 z-20 transition-opacity bg-gray-900/50 md:hidden backdrop-blur-sm"
  ></div>

  <aside 
    class="fixed top-0 left-0 z-30 w-64 h-screen transition-transform duration-300 ease-in-out bg-white border-r border-slate-200 md:translate-x-0"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="flex items-center justify-between h-16 px-6 border-b border-slate-100">
      <div class="flex items-center gap-2 text-indigo-600">
        <div class="p-1.5 bg-indigo-600 rounded-lg text-white">
          <Wallet class="w-5 h-5" />
        </div>
        <span class="text-lg font-bold tracking-tight text-slate-900">Orchestrator</span>
      </div>
      <button @click="$emit('close')" class="md:hidden text-slate-400 hover:text-slate-600">
        <X class="w-6 h-6" />
      </button>
    </div>

    <nav class="flex-1 p-4 mt-4 space-y-1 overflow-y-auto">
      <p class="px-4 mb-3 text-xs font-semibold tracking-wider uppercase text-slate-400">Main Menu</p>
      
      <router-link 
        v-for="item in menuItems" 
        :key="item.path"
        :to="item.path" 
        class="relative flex items-center px-4 py-3 overflow-hidden transition-all duration-200 rounded-xl group"
        :class="isActive(item.path) ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
        @click="$emit('close')" 
      >
        <span v-if="isActive(item.path)" class="absolute left-0 w-1 h-8 -translate-y-1/2 bg-indigo-600 rounded-r-full top-1/2"></span>
        
        <component :is="item.icon" class="w-5 h-5 mr-3 transition-colors" :class="isActive(item.path) ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'" /> 
        {{ item.name }}
      </router-link>
    </nav>

    <div class="p-4 border-t border-slate-100 bg-slate-50/50">
      <div class="flex items-center gap-3 px-2 mb-4">
        <div class="flex items-center justify-center w-10 h-10 font-bold text-white rounded-full shadow-md bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-indigo-500/20">
          {{ auth.user?.name?.charAt(0) || 'A' }}
        </div>
        <div class="overflow-hidden">
          <p class="text-sm font-semibold truncate text-slate-900">{{ auth.user?.name || 'Admin' }}</p>
          <p class="text-xs truncate text-slate-500">{{ auth.user?.email }}</p>
        </div>
      </div>
      <button @click="auth.logout" class="w-full flex items-center justify-center px-4 py-2.5 text-red-600 bg-white border border-red-100 hover:bg-red-50 hover:border-red-200 rounded-lg transition-all text-sm font-medium shadow-sm">
        <LogOut class="w-4 h-4 mr-2" /> Sign Out
      </button>
    </div>
  </aside>
</template>