<script setup lang="ts">
import { Menu, Bell, Search } from 'lucide-vue-next';

defineEmits(['toggleSidebar']);
</script>

<template>
  <header class="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b bg-white/80 backdrop-blur-md border-slate-200 md:px-8">
    <div class="flex items-center gap-4">
      <button @click="$emit('toggleSidebar')" class="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden">
        <Menu class="w-6 h-6" />
      </button>
      
      <h2 class="hidden text-lg font-semibold text-slate-800 sm:block">Admin Console</h2>
    </div>

    <div class="flex items-center gap-3">
      <div class="items-center hidden px-4 py-2 transition-all border border-transparent rounded-full md:flex bg-slate-100 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100">
        <Search class="w-4 h-4 mr-2 text-slate-400" />
        <input type="text" placeholder="Search..." class="w-48 text-sm bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400">
      </div>

      <button class="relative p-2 transition-colors rounded-full text-slate-500 hover:bg-slate-100">
        <Bell class="w-5 h-5" />
        <span class="absolute w-2 h-2 bg-red-500 border-2 border-white rounded-full top-2 right-2"></span>
      </button>
    </div>
  </header>
</template>