import React, { createContext, useContext, useEffect, useState } from 'react';
import type { FinanceEntry } from '../types/finance';

const FINANCE_STORAGE_KEY = 'rakata_finance_entries_v1';
const OWNER_PIN_STORAGE_KEY = 'rakata_owner_pin_v1';

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getRelativeDateString(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function generateSampleEntries(): FinanceEntry[] {
  const nowIso = new Date().toISOString();
  return [
    {
      id: 'sample-1',
      date: getTodayDateString(),
      type: 'income',
      category: 'Pesanan WhatsApp',
      paymentMethod: 'qris',
      amount: 145000,
      description: 'Order Paket SKS 1 (4x) & Ayam Gunting Large (2x) + Cheese Sauce',
      source: 'order',
      createdAt: nowIso,
    },
    {
      id: 'sample-2',
      date: getTodayDateString(),
      type: 'income',
      category: 'Penjualan Langsung (Kasir)',
      paymentMethod: 'cash',
      amount: 210000,
      description: 'Rekap penjualan kasir kantin sesi siang',
      source: 'manual',
      createdAt: nowIso,
    },
    {
      id: 'sample-3',
      date: getTodayDateString(),
      type: 'expense',
      category: 'Bahan Baku (Ayam & Kentang)',
      paymentMethod: 'cash',
      amount: 185000,
      description: 'Belanja dada ayam fillet 3 kg & kentang shoestring 4 pack',
      source: 'manual',
      createdAt: nowIso,
    },
    {
      id: 'sample-4',
      date: getRelativeDateString(1),
      type: 'income',
      category: 'Penjualan Langsung (Kasir)',
      paymentMethod: 'transfer',
      amount: 320000,
      description: 'Pesanan rombongan UKT 1 & UKT 2 (Transfer BCA)',
      source: 'manual',
      createdAt: nowIso,
    },
    {
      id: 'sample-5',
      date: getRelativeDateString(1),
      type: 'expense',
      category: 'Bumbu, Tepung & Saus',
      paymentMethod: 'transfer',
      amount: 95000,
      description: 'Restok bubuk tabur Rendang, Sambel Matah, Seaweed & Cheese Sauce',
      source: 'manual',
      createdAt: nowIso,
    },
    {
      id: 'sample-6',
      date: getRelativeDateString(2),
      type: 'expense',
      category: 'Minyak Goreng & Gas',
      paymentMethod: 'cash',
      amount: 72000,
      description: 'Minyak goreng 2 liter (2x) & isi ulang gas LPG 3kg',
      source: 'manual',
      createdAt: nowIso,
    },
  ];
}

interface FinanceContextValue {
  entries: FinanceEntry[];
  ownerPin: string | null;
  addEntry: (entry: Omit<FinanceEntry, 'id' | 'createdAt'>) => void;
  updateEntry: (id: string, updated: Omit<FinanceEntry, 'id' | 'createdAt'>) => void;
  deleteEntry: (id: string) => void;
  clearAllEntries: () => void;
  loadSampleEntries: () => void;
  importEntries: (imported: FinanceEntry[]) => void;
  setOwnerPin: (pin: string | null) => void;
}

const FinanceContext = createContext<FinanceContextValue | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<FinanceEntry[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = window.localStorage.getItem(FINANCE_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [ownerPin, setOwnerPinState] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(OWNER_PIN_STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(FINANCE_STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // Ignore storage quota errors gracefully
    }
  }, [entries]);

  const setOwnerPin = (pin: string | null) => {
    setOwnerPinState(pin);
    try {
      if (pin) {
        window.localStorage.setItem(OWNER_PIN_STORAGE_KEY, pin);
      } else {
        window.localStorage.removeItem(OWNER_PIN_STORAGE_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  };

  const addEntry = (entry: Omit<FinanceEntry, 'id' | 'createdAt'>) => {
    const newEntry: FinanceEntry = {
      ...entry,
      id: `fin-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    setEntries((prev) => [newEntry, ...prev]);
  };

  const updateEntry = (
    id: string,
    updated: Omit<FinanceEntry, 'id' | 'createdAt'>
  ) => {
    setEntries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAllEntries = () => {
    setEntries([]);
  };

  const loadSampleEntries = () => {
    setEntries((prev) => {
      const existingIds = new Set(prev.map((e) => e.id));
      const samples = generateSampleEntries().filter(
        (s) => !existingIds.has(s.id)
      );
      return [...samples, ...prev];
    });
  };

  const importEntries = (imported: FinanceEntry[]) => {
    setEntries((prev) => {
      const existingIds = new Set(prev.map((e) => e.id));
      const newOnes = imported.filter((item) => !existingIds.has(item.id));
      return [...newOnes, ...prev];
    });
  };

  return (
    <FinanceContext.Provider
      value={{
        entries,
        ownerPin,
        addEntry,
        updateEntry,
        deleteEntry,
        clearAllEntries,
        loadSampleEntries,
        importEntries,
        setOwnerPin,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return ctx;
}
