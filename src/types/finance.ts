export type FinanceEntryType = 'income' | 'expense';

export type FinancePaymentMethod = 'cash' | 'transfer' | 'qris';

export interface FinanceEntry {
  id: string;
  date: string; // YYYY-MM-DD
  type: FinanceEntryType;
  category: string;
  paymentMethod: FinancePaymentMethod;
  amount: number;
  description: string;
  source?: 'manual' | 'order';
  createdAt: string;
}

export const INCOME_CATEGORIES = [
  'Penjualan Langsung (Kasir)',
  'Pesanan WhatsApp',
  'Paket Spesial & Event',
  'Modal / Tambahan Kas',
  'Pemasukan Lainnya',
] as const;

export const EXPENSE_CATEGORIES = [
  'Bahan Baku (Ayam & Kentang)',
  'Bumbu, Tepung & Saus',
  'Minyak Goreng & Gas',
  'Kemasan & Alat Makan',
  'Sewa Tempat & Utilitas',
  'Gaji / Upah Karyawan',
  'Operasional & Transport',
  'Pengeluaran Lainnya',
] as const;
