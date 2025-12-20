// src/types/index.ts

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

// Config untuk Partner (Timeout, Retry, Status Mapping)
export interface PartnerConfig {
  timeout: number;
  retry_attempts: number;
  success_status: string[];
  pending_status: string[];
  failed_status: string[];
}

// Struktur Fee
export interface PartnerFee {
  cap: number;
  fixed: number;
  percentage: number;
}

// Interface Utama Partner
export interface Partner {
  id: string;
  name: string;
  code: string;
  // Sesuaikan dengan respon backend: PAYMENT_GATEWAY, EWALLET, BANK_VA
  type: 'PAYMENT_GATEWAY' | 'EWALLET' | 'BANK_VA' | string; 
  status: 'ACTIVE' | 'INACTIVE';
  
  // Menggunakan Record<string, any> agar fleksibel menerima:
  // - baseUrl, clientId, apiSecret (Ayoconnect)
  // - apiKey, merchantId (Dana)
  // - apiKey, merchantCode (OVO/BCA/BNI/BRI)
  credentials: Record<string, any>; 
  
  webhook_url: string | null;
  config: PartnerConfig;
  fee_structure: PartnerFee;
  created_at: string;
  updated_at: string;
}

// Wrapper Response API Standar
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
  error?: string;
}

// --- Tipe Data untuk Dashboard & Transaksi ---

export interface DashboardStats {
  total_transactions: number;
  success_transactions: number;
  pending_transactions: number;
  active_partners: number;
  today_revenue: number;
  success_rate: string | number;
}

export interface Transaction {
  id: string;
  transaction_id: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  status: string; // SUCCESS, PENDING, FAILED
  created_at: string;
  payment_methods?: { 
    name: string 
  };
  payment_partners?: { 
    name: string; 
    code: string 
  };
}