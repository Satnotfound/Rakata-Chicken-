import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import type {
  FinanceEntry,
  FinanceEntryType,
  FinancePaymentMethod,
} from '../types/finance';
import { useAuth } from './AuthContext';

const LEGACY_FINANCE_STORAGE_KEY = 'rakata_finance_entries_v1';
const PENDING_ORDERS_STORAGE_KEY = 'rakata_finance_pending_orders_v1';
const OWNER_PIN_STORAGE_KEY = 'rakata_owner_pin_v1';

const MAX_AMOUNT = 1_000_000_000;

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

function sanitizeId(rawId?: string): string {
  const cleaned = (rawId ?? '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 128);
  if (cleaned.length >= 1) return cleaned;
  return `fin-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function sanitizeDate(dateStr?: string): string {
  if (dateStr && /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(dateStr)) {
    return dateStr;
  }
  return getTodayDateString();
}

function sanitizeType(t: unknown): FinanceEntryType {
  return t === 'expense' ? 'expense' : 'income';
}

function sanitizePaymentMethod(m: unknown): FinancePaymentMethod {
  if (m === 'transfer' || m === 'qris') return m;
  return 'cash';
}

function sanitizeAmount(val: unknown): number {
  const num = Number(val);
  if (!Number.isFinite(num) || num <= 0) return 1;
  return Math.min(Math.round(num), MAX_AMOUNT);
}

function sanitizeText(val: unknown, fallback: string, maxLen: number): string {
  const str = String(val ?? '').trim();
  if (!str) return fallback.slice(0, maxLen);
  return str.slice(0, maxLen);
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

function readLocalQueue(key: string): FinanceEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalQueue(key: string, items: FinanceEntry[]) {
  if (typeof window === 'undefined') return;
  try {
    if (items.length === 0) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, JSON.stringify(items));
    }
  } catch {
    // Ignore storage quota errors gracefully
  }
}

interface FinanceContextValue {
  entries: FinanceEntry[];
  loading: boolean;
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
  const { user, authReady, isVerifiedUser, isAdmin } = useAuth();
  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [ownerPin, setOwnerPinState] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(OWNER_PIN_STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });

  // Subscribe to Firestore ledger entries once authenticated with verified Google account
  useEffect(() => {
    if (!authReady) return;
    if (!isVerifiedUser || !user) {
      setEntries([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const entriesCol = collection(db, 'financeEntries');
    const ledgerQuery = isAdmin
      ? query(entriesCol)
      : query(entriesCol, where('ownerUid', '==', user.uid));

    const unsubscribe = onSnapshot(
      ledgerQuery,
      (snapshot) => {
        const mapped: FinanceEntry[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          const createdTs = data.createdAt;
          const createdAtIso =
            createdTs instanceof Timestamp
              ? createdTs.toDate().toISOString()
              : new Date().toISOString();

          return {
            id: String(data.id || docSnap.id),
            date: String(data.date || getTodayDateString()),
            type: sanitizeType(data.type),
            category: String(data.category || ''),
            paymentMethod: sanitizePaymentMethod(data.paymentMethod),
            amount: Number(data.amount || 0),
            description: String(data.description || ''),
            source: data.source === 'order' ? 'order' : 'manual',
            createdAt: createdAtIso,
          };
        });

        mapped.sort((a, b) => {
          if (a.date !== b.date) return b.date.localeCompare(a.date);
          return b.createdAt.localeCompare(a.createdAt);
        });

        setEntries(mapped);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        handleFirestoreError(error, OperationType.LIST, 'financeEntries');
      }
    );

    return () => unsubscribe();
  }, [authReady, isVerifiedUser, isAdmin, user]);

  // Subscribe to private owner PIN settings
  useEffect(() => {
    if (!authReady || !isVerifiedUser || !user) return;
    const settingsPath = `users/${user.uid}/private/settings`;
    const settingsRef = doc(db, 'users', user.uid, 'private', 'settings');

    const unsubscribe = onSnapshot(
      settingsRef,
      (snapshot) => {
        if (!snapshot.exists()) return;
        const data = snapshot.data();
        const remotePin =
          typeof data.ownerPin === 'string' ? data.ownerPin : null;
        setOwnerPinState(remotePin);
        try {
          if (remotePin) {
            window.localStorage.setItem(OWNER_PIN_STORAGE_KEY, remotePin);
          } else {
            window.localStorage.removeItem(OWNER_PIN_STORAGE_KEY);
          }
        } catch {
          // Ignore storage errors
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, settingsPath);
      }
    );

    return () => unsubscribe();
  }, [authReady, isVerifiedUser, user]);

  // Flush any storefront pending order entries or legacy localStorage entries upon verified owner sign-in
  useEffect(() => {
    if (!authReady || !isVerifiedUser || !user) return;

    const pendingOrders = readLocalQueue(PENDING_ORDERS_STORAGE_KEY);
    const legacyEntries = readLocalQueue(LEGACY_FINANCE_STORAGE_KEY);
    const toMigrate = [...pendingOrders, ...legacyEntries];
    if (toMigrate.length === 0) return;

    const migrate = async () => {
      try {
        const batch = writeBatch(db);
        for (const item of toMigrate.slice(0, 400)) {
          const id = sanitizeId(item.id);
          const ref = doc(db, 'financeEntries', id);
          batch.set(ref, {
            id,
            ownerUid: user.uid,
            date: sanitizeDate(item.date),
            type: sanitizeType(item.type),
            category: sanitizeText(item.category, 'Pesanan WhatsApp', 80),
            paymentMethod: sanitizePaymentMethod(item.paymentMethod),
            amount: sanitizeAmount(item.amount),
            description: sanitizeText(item.description, 'Transaksi RAKATA', 500),
            source: item.source === 'order' ? 'order' : 'manual',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
        await batch.commit();
        writeLocalQueue(PENDING_ORDERS_STORAGE_KEY, []);
        writeLocalQueue(LEGACY_FINANCE_STORAGE_KEY, []);
      } catch (error) {
        console.error('Pending ledger sync error:', error);
      }
    };

    void migrate();
  }, [authReady, isVerifiedUser, user]);

  const setOwnerPin = (pin: string | null) => {
    const normalized = pin && /^[0-9]{4,6}$/.test(pin) ? pin : null;
    setOwnerPinState(normalized);
    try {
      if (normalized) {
        window.localStorage.setItem(OWNER_PIN_STORAGE_KEY, normalized);
      } else {
        window.localStorage.removeItem(OWNER_PIN_STORAGE_KEY);
      }
    } catch {
      // Ignore storage errors
    }

    if (isVerifiedUser && user) {
      const settingsPath = `users/${user.uid}/private/settings`;
      const settingsRef = doc(db, 'users', user.uid, 'private', 'settings');
      void setDoc(settingsRef, {
        ownerUid: user.uid,
        ownerPin: normalized,
        updatedAt: serverTimestamp(),
      }).catch((error) => {
        handleFirestoreError(error, OperationType.WRITE, settingsPath);
      });
    }
  };

  const addEntry = (entry: Omit<FinanceEntry, 'id' | 'createdAt'>) => {
    const id = sanitizeId();
    const sanitized = {
      id,
      date: sanitizeDate(entry.date),
      type: sanitizeType(entry.type),
      category: sanitizeText(entry.category, 'Pemasukan Lainnya', 80),
      paymentMethod: sanitizePaymentMethod(entry.paymentMethod),
      amount: sanitizeAmount(entry.amount),
      description: sanitizeText(entry.description, 'Transaksi RAKATA', 500),
      source: entry.source === 'order' ? ('order' as const) : ('manual' as const),
    };

    // If storefront visitor records an order while owner is not signed in, queue locally for owner sync
    if (!isVerifiedUser || !user) {
      const queued: FinanceEntry = {
        ...sanitized,
        createdAt: new Date().toISOString(),
      };
      const existingQueue = readLocalQueue(PENDING_ORDERS_STORAGE_KEY);
      writeLocalQueue(PENDING_ORDERS_STORAGE_KEY, [queued, ...existingQueue]);
      return;
    }

    const docPath = `financeEntries/${id}`;
    void setDoc(doc(db, 'financeEntries', id), {
      ...sanitized,
      ownerUid: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }).catch((error) => {
      handleFirestoreError(error, OperationType.CREATE, docPath);
    });
  };

  const updateEntry = (
    id: string,
    updated: Omit<FinanceEntry, 'id' | 'createdAt'>
  ) => {
    if (!isVerifiedUser || !user) return;
    const validId = sanitizeId(id);
    const docPath = `financeEntries/${validId}`;
    void updateDoc(doc(db, 'financeEntries', validId), {
      date: sanitizeDate(updated.date),
      type: sanitizeType(updated.type),
      category: sanitizeText(updated.category, 'Pemasukan Lainnya', 80),
      paymentMethod: sanitizePaymentMethod(updated.paymentMethod),
      amount: sanitizeAmount(updated.amount),
      description: sanitizeText(updated.description, 'Transaksi RAKATA', 500),
      source: updated.source === 'order' ? 'order' : 'manual',
      updatedAt: serverTimestamp(),
    }).catch((error) => {
      handleFirestoreError(error, OperationType.UPDATE, docPath);
    });
  };

  const deleteEntry = (id: string) => {
    if (!isVerifiedUser || !user) return;
    const validId = sanitizeId(id);
    const docPath = `financeEntries/${validId}`;
    void deleteDoc(doc(db, 'financeEntries', validId)).catch((error) => {
      handleFirestoreError(error, OperationType.DELETE, docPath);
    });
  };

  const clearAllEntries = () => {
    if (!isVerifiedUser || !user || entries.length === 0) return;

    const runDelete = async () => {
      try {
        const chunkSize = 400;
        for (let i = 0; i < entries.length; i += chunkSize) {
          const batch = writeBatch(db);
          for (const item of entries.slice(i, i + chunkSize)) {
            batch.delete(doc(db, 'financeEntries', sanitizeId(item.id)));
          }
          await batch.commit();
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'financeEntries');
      }
    };

    void runDelete();
  };

  const loadSampleEntries = () => {
    if (!isVerifiedUser || !user) return;
    const existingIds = new Set(entries.map((e) => e.id));
    const samples = generateSampleEntries().filter(
      (s) => !existingIds.has(s.id)
    );
    if (samples.length === 0) return;

    const runLoad = async () => {
      try {
        const batch = writeBatch(db);
        for (const s of samples) {
          const id = sanitizeId(s.id);
          batch.set(doc(db, 'financeEntries', id), {
            id,
            ownerUid: user.uid,
            date: sanitizeDate(s.date),
            type: sanitizeType(s.type),
            category: sanitizeText(s.category, 'Penjualan Langsung (Kasir)', 80),
            paymentMethod: sanitizePaymentMethod(s.paymentMethod),
            amount: sanitizeAmount(s.amount),
            description: sanitizeText(s.description, 'Contoh data UMKM', 500),
            source: s.source === 'order' ? 'order' : 'manual',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
        await batch.commit();
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'financeEntries');
      }
    };

    void runLoad();
  };

  const importEntries = (imported: FinanceEntry[]) => {
    if (!isVerifiedUser || !user) return;
    const existingIds = new Set(entries.map((e) => e.id));
    const newOnes = imported.filter((item) => !existingIds.has(sanitizeId(item.id)));
    if (newOnes.length === 0) return;

    const runImport = async () => {
      try {
        const chunkSize = 400;
        for (let i = 0; i < newOnes.length; i += chunkSize) {
          const batch = writeBatch(db);
          for (const item of newOnes.slice(i, i + chunkSize)) {
            const id = sanitizeId(item.id);
            batch.set(doc(db, 'financeEntries', id), {
              id,
              ownerUid: user.uid,
              date: sanitizeDate(item.date),
              type: sanitizeType(item.type),
              category: sanitizeText(item.category, 'Pemasukan Lainnya', 80),
              paymentMethod: sanitizePaymentMethod(item.paymentMethod),
              amount: sanitizeAmount(item.amount),
              description: sanitizeText(item.description, 'Data impor RAKATA', 500),
              source: item.source === 'order' ? 'order' : 'manual',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          }
          await batch.commit();
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'financeEntries');
      }
    };

    void runImport();
  };

  return (
    <FinanceContext.Provider
      value={{
        entries,
        loading,
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
