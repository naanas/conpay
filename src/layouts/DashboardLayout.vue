<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from '../components/Sidebar.vue';
import Navbar from '../components/Navbar.vue';

const isSidebarOpen = ref(false);
</script>

<template>
  <div class="flex h-screen overflow-hidden font-sans bg-slate-50">
    <Sidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <div class="flex flex-col flex-1 min-w-0 transition-all duration-300 md:pl-64">
      <Navbar @toggleSidebar="isSidebarOpen = !isSidebarOpen" />

      <main class="flex-1 p-4 overflow-y-auto md:p-8 scroll-smooth">
        <div class="mx-auto max-w-7xl">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<style>
/* Smooth Transition for Pages */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}
</style>