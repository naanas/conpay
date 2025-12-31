<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import api from '../api/axios';
import { X, Code, Save, HelpCircle, Edit3 } from 'lucide-vue-next';
import type { Partner } from '../types';

const props = defineProps<{
  isOpen: boolean;
  partnerToEdit?: Partner | null; // [BARU] Prop untuk data yang akan diedit
}>();

const emit = defineEmits(['close', 'success']);

const loading = ref(false);
const errorMsg = ref('');

// Cek Mode: Apakah sedang Edit atau Create baru?
const isEditMode = computed(() => !!props.partnerToEdit);

// Default Template untuk Mapping Schema
const defaultMapping = {
  request: {
    url: "https://api.partner.com/v1/charge",
    method: "POST",
    headers: {
      "Authorization": "Bearer {{credentials.secret_key}}",
      "Content-Type": "application/json"
    },
    body: {
      "external_id": "{{transaction_id}}",
      "amount": "{{amount}}",
      "payer_email": "{{email}}",
      "description": "Payment for {{description}}"
    }
  },
  response_mapping: {
    "payment_url": "data.actions.desktop_web_checkout_url",
    "virtual_account": "data.account_number",
    "partner_transaction_id": "data.id"
  }
};

const form = reactive({
  name: '',
  code: '',
  type: 'PAYMENT_GATEWAY',
  status: 'INACTIVE',
  fee_fixed: 0,
  fee_percentage: 0,
  credentialsJson: '{\n  "secret_key": "",\n  "merchant_id": ""\n}',
  mappingSchemaJson: JSON.stringify(defaultMapping, null, 2)
});

const partnerTypes = ['PAYMENT_GATEWAY', 'BANK_VA', 'EWALLET', 'QRIS'];

// [BARU] Fungsi Reset Form
const resetForm = () => {
  form.name = '';
  form.code = '';
  form.type = 'PAYMENT_GATEWAY';
  form.status = 'INACTIVE';
  form.fee_fixed = 0;
  form.fee_percentage = 0;
  form.credentialsJson = '{\n  "secret_key": "",\n  "merchant_id": ""\n}';
  form.mappingSchemaJson = JSON.stringify(defaultMapping, null, 2);
};

// [BARU] Watcher untuk mengisi form saat mode Edit aktif
watch(() => props.partnerToEdit, (newVal) => {
  if (newVal) {
    // Mode EDIT: Isi form dengan data existing
    form.name = newVal.name;
    form.code = newVal.code;
    form.type = newVal.type;
    form.status = newVal.status;
    form.fee_fixed = newVal.fee_structure?.fixed || 0;
    form.fee_percentage = newVal.fee_structure?.percentage || 0;
    
    // Pretty Print JSON untuk di-edit
    form.credentialsJson = JSON.stringify(newVal.credentials || {}, null, 2);
    // Gunakan schema yang ada, atau default jika kosong
    const schema = newVal.mapping_schema && Object.keys(newVal.mapping_schema).length > 0 
      ? newVal.mapping_schema 
      : defaultMapping;
    form.mappingSchemaJson = JSON.stringify(schema, null, 2);
  } else {
    // Mode CREATE: Reset form
    resetForm();
  }
}, { immediate: true });

const handleSubmit = async () => {
  loading.value = true;
  errorMsg.value = '';

  try {
    let credentials = {};
    let mapping_schema = {};

    try {
      credentials = JSON.parse(form.credentialsJson);
    } catch (e) {
      throw new Error("Credentials bukan format JSON yang valid.");
    }

    try {
      mapping_schema = JSON.parse(form.mappingSchemaJson);
    } catch (e) {
      throw new Error("Mapping Schema bukan format JSON yang valid.");
    }

    const payload = {
      name: form.name,
      code: form.code,
      type: form.type,
      status: form.status,
      credentials,
      mapping_schema,
      config: {
        timeout: 30000,
        retry_attempts: 3,
        success_status: ["SUCCESS", "PAID", "SETTLED"],
        pending_status: ["PENDING"],
        failed_status: ["FAILED", "EXPIRED"]
      },
      fee_structure: {
        fixed: Number(form.fee_fixed),
        percentage: Number(form.fee_percentage),
        cap: 0
      }
    };

    // [MODIFIKASI] Switch antara POST (Create) dan PUT (Update)
    if (isEditMode.value && props.partnerToEdit) {
      await api.put(`/admin/partners/${props.partnerToEdit.id}`, payload);
    } else {
      await api.post('/admin/partners', payload);
    }
    
    resetForm();
    emit('success');
    emit('close');
  } catch (e: any) {
    console.error(e);
    errorMsg.value = e.response?.data?.message || e.message || 'Gagal menyimpan partner.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all bg-slate-900/60 backdrop-blur-sm">
    <div class="w-full max-w-2xl bg-white shadow-2xl rounded-2xl flex flex-col max-h-[90vh]">
      
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div>
          <h3 class="text-lg font-bold text-slate-800">
            {{ isEditMode ? 'Edit Partner Configuration' : 'Add New Partner' }}
          </h3>
          <p class="text-xs text-slate-500">
            {{ isEditMode ? `Update details for ${props.partnerToEdit?.name}` : 'Integrate a new payment channel dynamically.' }}
          </p>
        </div>
        <button @click="$emit('close')" class="p-2 transition-colors text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl">
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-6 space-y-6 overflow-y-auto">
        
        <div v-if="errorMsg" class="flex items-center gap-2 p-3 text-sm font-medium text-red-600 border border-red-100 rounded-lg bg-red-50">
           <span>⚠️</span> {{ errorMsg }}
        </div>

        <div class="grid grid-cols-2 gap-5">
          <div class="space-y-1.5">
            <label class="text-xs font-bold tracking-wider uppercase text-slate-600">Partner Name</label>
            <input v-model="form.name" type="text" placeholder="e.g. DANA Indonesia" 
              class="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-bold tracking-wider uppercase text-slate-600">Code (Unique)</label>
            <input v-model="form.code" type="text" :disabled="isEditMode" placeholder="e.g. DANA_EWALLET" 
              class="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-mono disabled:bg-slate-100 disabled:text-slate-500" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-5">
          <div class="space-y-1.5">
            <label class="text-xs font-bold tracking-wider uppercase text-slate-600">Type</label>
            <select v-model="form.type" class="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
              <option v-for="t in partnerTypes" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-bold tracking-wider uppercase text-slate-600">Status</label>
            <select v-model="form.status" class="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
              <option value="ACTIVE">Active (Production)</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        <div class="p-4 space-y-3 border bg-slate-50 rounded-xl border-slate-100">
          <h4 class="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-slate-700">
            💰 Fee Structure (Biaya Admin)
          </h4>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-xs text-slate-500">Fixed Fee (IDR)</label>
              <input v-model="form.fee_fixed" type="number" 
                class="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div class="space-y-1">
              <label class="text-xs text-slate-500">Percentage (%)</label>
              <input v-model="form.fee_percentage" type="number" step="0.1" 
                class="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="text-xs font-bold tracking-wider uppercase text-slate-600">Credentials (JSON)</label>
            <span class="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">Secure Storage</span>
          </div>
          <textarea v-model="form.credentialsJson" rows="3" 
            class="w-full px-3 py-2 font-mono text-xs border rounded-lg outline-none text-slate-700 bg-slate-900/5 border-slate-300 focus:ring-2 focus:ring-indigo-500"></textarea>
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-1 text-xs font-bold tracking-wider text-indigo-600 uppercase">
              <Code class="w-3 h-3" /> Universal API Adapter
            </label>
            <div class="relative group">
              <HelpCircle class="w-3 h-3 text-slate-400 cursor-help" />
              <div v-pre class="absolute right-0 bottom-full mb-2 w-64 p-2 bg-slate-800 text-white text-[10px] rounded shadow-xl hidden group-hover:block z-10">
                Gunakan format {{variable}} untuk menyisipkan data dinamis (transaction_id, amount, email, credentials.key).
              </div>
            </div>
          </div>
          <div class="relative">
             <textarea v-model="form.mappingSchemaJson" rows="10" 
              class="w-full px-3 py-2 font-mono text-xs leading-relaxed border rounded-lg outline-none text-slate-300 bg-slate-800 border-slate-700 focus:ring-2 focus:ring-indigo-500"></textarea>
             <div class="absolute top-2 right-2 text-[10px] text-slate-500 font-mono">JSON</div>
          </div>
          <p class="text-[10px] text-slate-500">
            Define how to talk to the partner API. Map our internal fields to their request structure.
          </p>
        </div>

      </div>

      <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
        <button @click="$emit('close')" class="px-4 py-2 text-sm font-medium transition-colors rounded-lg text-slate-600 hover:bg-slate-200">
          Cancel
        </button>
        <button @click="handleSubmit" :disabled="loading" 
          class="flex items-center justify-center gap-2 px-5 py-2 text-sm font-medium text-white transition-all bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 shadow-indigo-600/20 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95">
          <span v-if="loading" class="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin"></span>
          <template v-else>
             <Edit3 v-if="isEditMode" class="w-4 h-4" />
             <Save v-else class="w-4 h-4" />
          </template>
          {{ loading ? 'Saving...' : (isEditMode ? 'Update Partner' : 'Create Partner') }}
        </button>
      </div>

    </div>
  </div>
</template>