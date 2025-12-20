<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { Wallet, Eye, EyeOff } from 'lucide-vue-next'; // Import Icon

const email = ref('');
const password = ref('');
const showPassword = ref(false); // State untuk toggle
const errorMsg = ref('');
const loading = ref(false);
const auth = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    await auth.login(email.value, password.value);
    router.push('/');
  } catch (err: any) {
    errorMsg.value = err;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="relative flex items-center justify-center min-h-screen overflow-hidden bg-slate-50">
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-3xl"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-3xl"></div>

    <div class="relative z-10 w-full max-w-md p-8 mx-4 border border-white shadow-xl bg-white/80 backdrop-blur-xl md:p-10 rounded-3xl shadow-indigo-100">
      <div class="mb-8 text-center">
        <div class="inline-flex items-center justify-center w-12 h-12 mb-4 text-white bg-indigo-600 shadow-lg rounded-xl shadow-indigo-600/30">
          <Wallet class="w-6 h-6" />
        </div>
        <h2 class="text-2xl font-bold tracking-tight text-slate-900">Welcome Back</h2>
        <p class="mt-2 text-sm text-slate-500">Sign in to manage your payment orchestration.</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block mb-2 text-xs font-semibold uppercase text-slate-700">Email Address</label>
          <input 
            v-model="email" 
            type="email" 
            required 
            class="w-full px-4 py-3 font-medium transition-all border outline-none bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder:text-slate-400" 
            placeholder="admin@example.com"
          >
        </div>

        <div>
          <label class="block mb-2 text-xs font-semibold uppercase text-slate-700">Password</label>
          <div class="relative">
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'"
              required 
              class="w-full px-4 py-3 pr-12 font-medium transition-all border outline-none bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder:text-slate-400" 
              placeholder="••••••••"
            >
            <button 
              type="button"
              @click="showPassword = !showPassword"
              class="absolute p-1 transition-colors -translate-y-1/2 right-3 top-1/2 text-slate-400 hover:text-indigo-600"
            >
              <Eye v-if="!showPassword" class="w-5 h-5" />
              <EyeOff v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div v-if="errorMsg" class="flex items-center gap-2 p-3 text-sm border rounded-lg text-rose-600 bg-rose-50 border-rose-100">
          <span class="font-bold">Error:</span> {{ errorMsg }}
        </div>

        <button 
          type="submit" 
          :disabled="loading" 
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Signing in...' : 'Sign In Dashboard' }}
        </button>
      </form>
    </div>
  </div>
</template>