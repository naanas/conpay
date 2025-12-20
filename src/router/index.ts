import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// Import Components
import LoginView from '../views/LoginView.vue';
import DashboardLayout from '../layouts/DashboardLayout.vue';
import DashboardView from '../views/DashboardView.vue';
import TransactionsView from '../views/TransactionsView.vue';
import PartnersView from '../views/PartnersView.vue';

// 1. Tambahkan ini biar TypeScript kenal properti custom di 'meta'
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    guest?: boolean;
  }
}

const routes: RouteRecordRaw[] = [
  { 
    path: '/login', 
    name: 'Login',
    component: LoginView, 
    meta: { guest: true } 
  },
  {
    path: '/',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { 
        path: '', 
        name: 'Dashboard', 
        component: DashboardView // Sesuai backend: GET /api/admin/dashboard
      },
      { 
        path: 'transactions', 
        name: 'Transactions', 
        component: TransactionsView // Sesuai backend: GET /api/admin/transactions
      },
      { 
        path: 'partners', 
        name: 'Partners', 
        component: PartnersView // Sesuai backend: GET /api/admin/partners
      },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation Guard
router.beforeEach((to, _from, next) => {
  const auth = useAuthStore();
  
  // 1. Kalau butuh login tapi tidak punya token -> Lempar ke Login
  if (to.meta.requiresAuth && !auth.token) {
    next({ name: 'Login' });
  } 
  // 2. Kalau halaman tamu (Login) tapi sudah login -> Lempar ke Dashboard
  else if (to.meta.guest && auth.token) {
    next({ name: 'Dashboard' });
  } 
  // 3. Lanjut
  else {
    next();
  }
});

export default router;