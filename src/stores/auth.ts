import { defineStore } from 'pinia';
import api from '../api/axios';
import { ref } from 'vue';
import type { User, AuthResponse } from '../types';
import type { AxiosError } from 'axios';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));
  const token = ref<string | null>(localStorage.getItem('token') || null);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await api.post<AuthResponse>('/admin/login', { email, password });
      
      if (data.success) {
        token.value = data.data.token;
        user.value = data.data.user;
        
        localStorage.setItem('token', token.value);
        localStorage.setItem('user', JSON.stringify(user.value));
        return true;
      }
      return false;
    } catch (error: any) {
      const err = error as AxiosError<{ error: string }>;
      throw err.response?.data?.error || 'Login gagal';
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return { user, token, login, logout };
});