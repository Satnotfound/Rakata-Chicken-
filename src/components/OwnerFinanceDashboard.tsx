import { useMemo, useRef, useState } from 'react';
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  Banknote,
  BookOpen,
  Download,
  Edit3,
  Landmark,
  Lock,
  Plus,
  QrCode,
  RotateCcw,
  Search,
  Trash2,
  Unlock,
  Upload,
  Wallet,
  X,
} from 'lucide-react';
import { formatIDR } from '../config/brand';
import { useFinance } from '../context/FinanceContext';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  type FinanceEntry,
  type FinanceEntryType,
  type FinancePaymentMethod,
} from '../types/finance';
import { RakataChickenLogo } from './RakataChickenLogo';

interface OwnerFinanceDashboardProps {
  onBackToStorefront: () => void;
}

type PeriodFilter = 'all' | 'today' | '7d' | 'month' | 'custom_month';

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getCurrentMonthString(): string {
  return getTodayDateString().slice(0, 7);
}

function formatPaymentLabel(method: FinancePaymentMethod): string {
  switch (method) {
    case 'cash':
      return 'Tunai (Cash)';
    case 'transfer':
      return 'Transfer Bank';
    case 'qris':
      return 'QRIS';
  }
}

function formatDateID(isoDate: string): string {
  if (!isoDate) return '-';
  const [y, m, d] = isoDate.split('-');
  if (!y || !m || !d) return isoDate;
  return `${d}/${m}/${y}`;
}

export function OwnerFinanceDashboard({
  onBackToStorefront,
}: OwnerFinanceDashboardProps) {
  const {
    entries,
    ownerPin,
    addEntry,
    updateEntry,
    deleteEntry,
    clearAllEntries,
    loadSampleEntries,
    importEntries,
    setOwnerPin,
  } = useFinance();

  // Optional PIN lock state (if owner set a PIN, require unlock on mount)
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => !ownerPin);
  const [pinAttempt, setPinAttempt] = useState('');
  const [pinError, setPinError] = useState('');

  // PIN Settings modal state
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const [pinSettingError, setPinSettingError] = useState('');

  // Filters
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all');
  const [customMonth, setCustomMonth] = useState<string>(getCurrentMonthString());
  const [typeFilter, setTypeFilter] = useState<'all' | FinanceEntryType>('all');
  const [paymentFilter, setPaymentFilter] = useState<
    'all' | FinancePaymentMethod
  >('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Add/Edit Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FinanceEntry | null>(null);
  const [formType, setFormType] = useState<FinanceEntryType>('income');
  const [formDate, setFormDate] = useState<string>(getTodayDateString());
  const [formCategory, setFormCategory] = useState<string>(
    INCOME_CATEGORIES[0]
  );
  const [formPaymentMethod, setFormPaymentMethod] =
    useState<FinancePaymentMethod>('cash');
  const [formAmount, setFormAmount] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  // Inline delete & clear confirmations (never use window.confirm)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotice = (msg: string) => {
    setStatusNotice(msg);
    window.setTimeout(() => setStatusNotice(null), 3200);
  };

  // Filtered entries
  const filteredEntries = useMemo(() => {
    const todayStr = getTodayDateString();
    const currentMonth = getCurrentMonthString();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const sevenDaysStr = `${sevenDaysAgo.getFullYear()}-${String(
      sevenDaysAgo.getMonth() + 1
    ).padStart(2, '0')}-${String(sevenDaysAgo.getDate()).padStart(2, '0')}`;

    const q = searchQuery.trim().toLowerCase();

    return [...entries]
      .filter((entry) => {
        if (periodFilter === 'today' && entry.date !== todayStr) return false;
        if (periodFilter === '7d' && entry.date < sevenDaysStr) return false;
        if (periodFilter === 'month' && !entry.date.startsWith(currentMonth))
          return false;
        if (
          periodFilter === 'custom_month' &&
          customMonth &&
          !entry.date.startsWith(customMonth)
        )
          return false;

        if (typeFilter !== 'all' && entry.type !== typeFilter) return false;
        if (paymentFilter !== 'all' && entry.paymentMethod !== paymentFilter)
          return false;

        if (q) {
          const hay = `${entry.category} ${entry.description} ${formatPaymentLabel(
            entry.paymentMethod
          )}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (a.date !== b.date) return b.date.localeCompare(a.date);
        return b.createdAt.localeCompare(a.createdAt);
      });
  }, [
    entries,
    periodFilter,
    customMonth,
    typeFilter,
    paymentFilter,
    searchQuery,
  ]);

  // Metrics calculated from filtered entries
  const metrics = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    const byPayment: Record<
      FinancePaymentMethod,
      { income: number; expense: number }
    > = {
      cash: { income: 0, expense: 0 },
      transfer: { income: 0, expense: 0 },
      qris: { income: 0, expense: 0 },
    };

    const expenseByCat = new Map<string, number>();
    const incomeByCat = new Map<string, number>();

    for (const item of filteredEntries) {
      if (item.type === 'income') {
        totalIncome += item.amount;
        incomeCount += 1;
        byPayment[item.paymentMethod].income += item.amount;
        incomeByCat.set(
          item.category,
          (incomeByCat.get(item.category) ?? 0) + item.amount
        );
      } else {
        totalExpense += item.amount;
        expenseCount += 1;
        byPayment[item.paymentMethod].expense += item.amount;
        expenseByCat.set(
          item.category,
          (expenseByCat.get(item.category) ?? 0) + item.amount
        );
      }
    }

    const netBalance = totalIncome - totalExpense;
    const marginPercent =
      totalIncome > 0 ? Math.round((netBalance / totalIncome) * 100) : 0;

    const topExpenseCategories = Array.from(expenseByCat.entries())
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    const topIncomeCategories = Array.from(incomeByCat.entries())
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return {
      totalIncome,
      totalExpense,
      netBalance,
      marginPercent,
      incomeCount,
      expenseCount,
      byPayment,
      topExpenseCategories,
      topIncomeCategories,
    };
  }, [filteredEntries]);

  const openNewForm = (presetType: FinanceEntryType = 'income') => {
    setEditingEntry(null);
    setFormType(presetType);
    setFormDate(getTodayDateString());
    setFormCategory(
      presetType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]
    );
    setFormPaymentMethod('cash');
    setFormAmount('');
    setFormDescription('');
    setFormError('');
    setIsFormOpen(true);
  };

  const openEditForm = (entry: FinanceEntry) => {
    setEditingEntry(entry);
    setFormType(entry.type);
    setFormDate(entry.date);
    setFormCategory(entry.category);
    setFormPaymentMethod(entry.paymentMethod);
    setFormAmount(String(entry.amount));
    setFormDescription(entry.description);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleTypeSwitch = (nextType: FinanceEntryType) => {
    setFormType(nextType);
    const categories =
      nextType === 'income'
        ? (INCOME_CATEGORIES as readonly string[])
        : (EXPENSE_CATEGORIES as readonly string[]);
    if (!categories.includes(formCategory)) {
      setFormCategory(categories[0]);
    }
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(formAmount.replace(/\D/g, ''));
    if (!formDate) {
      setFormError('Mohon pilih tanggal transaksi.');
      return;
    }
    if (!numericAmount || numericAmount <= 0) {
      setFormError('Nominal harus lebih dari Rp0.');
      return;
    }
    if (!formDescription.trim()) {
      setFormError('Mohon isi keterangan transaksi.');
      return;
    }

    const payload = {
      date: formDate,
      type: formType,
      category: formCategory,
      paymentMethod: formPaymentMethod,
      amount: numericAmount,
      description: formDescription.trim(),
      source: editingEntry?.source ?? ('manual' as const),
    };

    if (editingEntry) {
      updateEntry(editingEntry.id, payload);
      showNotice('Catatan transaksi berhasil diperbarui.');
    } else {
      addEntry(payload);
      showNotice(
        `${
          formType === 'income' ? 'Pemasukan' : 'Pengeluaran'
        } sebesar ${formatIDR(numericAmount)} berhasil dicatat.`
      );
    }
    setIsFormOpen(false);
  };

  const handleExportCsv = () => {
    if (filteredEntries.length === 0) {
      showNotice('Tidak ada data transaksi untuk diekspor.');
      return;
    }
    const headers = [
      'Tanggal',
      'Tipe',
      'Kategori',
      'Metode Pembayaran',
      'Keterangan',
      'Pemasukan (IDR)',
      'Pengeluaran (IDR)',
    ];
    const escapeCsv = (val: string) => `"${val.replace(/"/g, '""')}"`;

    const rows = filteredEntries.map((entry) => [
      entry.date,
      entry.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      escapeCsv(entry.category),
      escapeCsv(formatPaymentLabel(entry.paymentMethod)),
      escapeCsv(entry.description),
      entry.type === 'income' ? String(entry.amount) : '0',
      entry.type === 'expense' ? String(entry.amount) : '0',
    ]);

    rows.push([]);
    rows.push([
      'RINGKASAN',
      '',
      '',
      '',
      'Total Pemasukan',
      String(metrics.totalIncome),
      '',
    ]);
    rows.push([
      'RINGKASAN',
      '',
      '',
      '',
      'Total Pengeluaran',
      '',
      String(metrics.totalExpense),
    ]);
    rows.push([
      'RINGKASAN',
      '',
      '',
      '',
      'Saldo / Laba Bersih',
      String(metrics.netBalance),
      '',
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rakata-keuangan-${getTodayDateString()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotice('Laporan CSV berhasil diunduh.');
  };

  const handleBackupJson = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rakata-backup-keuangan-${getTodayDateString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotice('File backup JSON berhasil diunduh.');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!Array.isArray(parsed)) {
          showNotice('Format file backup tidak valid.');
          return;
        }
        const valid = parsed.filter(
          (item): item is FinanceEntry =>
            item &&
            typeof item.id === 'string' &&
            typeof item.date === 'string' &&
            (item.type === 'income' || item.type === 'expense') &&
            typeof item.amount === 'number'
        );
        if (valid.length === 0) {
          showNotice('Tidak ditemukan catatan valid di dalam file.');
          return;
        }
        importEntries(valid);
        showNotice(`${valid.length} catatan berhasil dipulihkan.`);
      } catch {
        showNotice('Gagal membaca file backup JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleUnlockPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinAttempt === ownerPin) {
      setIsUnlocked(true);
      setPinAttempt('');
      setPinError('');
    } else {
      setPinError('PIN tidak sesuai. Silakan coba lagi.');
    }
  };

  const handleSavePinSetting = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.length < 4 || !/^\d{4,6}$/.test(newPinInput)) {
      setPinSettingError('PIN harus terdiri dari 4–6 digit angka.');
      return;
    }
    setOwnerPin(newPinInput);
    setNewPinInput('');
    setPinSettingError('');
    setIsPinModalOpen(false);
    showNotice('PIN keamanan Owner berhasil diaktifkan.');
  };

  if (!isUnlocked && ownerPin) {
    return (
      <div className="min-h-screen bg-[#FFF8EA] text-[#42201D] flex flex-col">
        <header className="bg-[#541412] text-white border-b border-white/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2.5">
              <RakataChickenLogo className="w-9 h-6" />
              <span className="font-display text-lg font-extrabold text-[#F4C343]">
                RAKATA · Pembukuan Owner
              </span>
            </div>
            <button
              type="button"
              onClick={onBackToStorefront}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FFF8EA] hover:text-[#F4C343] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Kembali ke Toko</span>
            </button>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <form
            onSubmit={handleUnlockPin}
            className="w-full max-w-sm bg-white rounded-2xl p-6 border border-[#42201D]/10 shadow-sm space-y-4"
          >
            <div className="w-11 h-11 rounded-xl bg-[#781B19] text-[#F4C343] flex items-center justify-center">
              <Lock className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-[#42201D]">
                Akses Pembukuan Owner
              </h1>
              <p className="text-sm text-[#42201D]/75 mt-1">
                Masukkan PIN Owner untuk melihat dan mengelola catatan keuangan
                RAKATA.
              </p>
            </div>
            <div>
              <label
                htmlFor="owner-pin-unlock"
                className="block text-xs font-bold uppercase tracking-wider text-[#781B19] mb-1.5"
              >
                PIN Keamanan
              </label>
              <input
                id="owner-pin-unlock"
                type="password"
                inputMode="numeric"
                value={pinAttempt}
                onChange={(e) => {
                  setPinAttempt(e.target.value);
                  setPinError('');
                }}
                placeholder="Masukkan 4–6 digit PIN"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#FFF8EA] border border-[#42201D]/20 text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#781B19]"
              />
              {pinError && (
                <p className="mt-1.5 text-xs font-semibold text-[#DC2626]" role="alert">
                  {pinError}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-[#781B19] hover:bg-[#541412] text-white font-bold text-sm transition-colors cursor-pointer"
            >
              Buka Pembukuan
            </button>
          </form>
        </main>
      </div>
    );
  }

  const activeCategories =
    formType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="min-h-screen bg-[#FFF8EA] text-[#42201D] flex flex-col">
      {/* Workspace Top Bar (2-zone SaaS Dashboard Contract) */}
      <header className="sticky top-0 z-40 bg-[#541412] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onBackToStorefront}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs sm:text-sm font-semibold text-[#FFF8EA] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Kembali ke Toko</span>
            </button>
            <div className="hidden sm:flex items-center gap-2.5 text-sm truncate">
              <RakataChickenLogo className="w-9 h-6" />
              <span className="font-display font-bold text-[#F4C343]">
                RAKATA
              </span>
              <span className="text-white/40" aria-hidden="true">
                /
              </span>
              <span className="text-[#FFF8EA]/90 font-medium truncate">
                Pembukuan Owner · Pemasukan &amp; Pengeluaran
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsPinModalOpen(true)}
              title="Pengaturan PIN Owner"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/20 text-xs font-semibold text-[#FFF8EA] hover:bg-white/10 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {ownerPin ? (
                <Lock className="w-3.5 h-3.5 text-[#F4C343]" aria-hidden="true" />
              ) : (
                <Unlock className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">
                {ownerPin ? 'PIN Aktif' : 'Atur PIN'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => openNewForm('income')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#F4C343] hover:bg-[#f7cf63] text-[#42201D] font-bold text-xs sm:text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Catat Transaksi</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Title & Quick Action Strip */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#781B19]">
              Business Owner Ledger
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#42201D] mt-1">
              Pencatatan Keuangan RAKATA
            </h1>
            <p className="text-sm text-[#42201D]/75 mt-1">
              Pantau arus kas masuk, biaya bahan baku &amp; operasional, serta
              saldo per metode pembayaran secara real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => openNewForm('income')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-colors whitespace-nowrap cursor-pointer"
            >
              <ArrowDownLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>+ Pemasukan</span>
            </button>
            <button
              type="button"
              onClick={() => openNewForm('expense')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold transition-colors whitespace-nowrap cursor-pointer"
            >
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              <span>- Pengeluaran</span>
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-[#FFF8EA] border border-[#42201D]/15 text-[#42201D] text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Status Toast Notice */}
        {statusNotice && (
          <div
            role="status"
            className="bg-[#541412] text-[#FFF8EA] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between gap-3"
          >
            <span>{statusNotice}</span>
            <button
              type="button"
              onClick={() => setStatusNotice(null)}
              className="text-[#F4C343] hover:underline text-xs font-bold cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}

        {/* KPI Summary Strip */}
        <section
          aria-label="Ringkasan Keuangan"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Total Pemasukan */}
          <div className="bg-white rounded-xl p-5 border border-[#42201D]/10">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#16A34A]">
              <span>Total Pemasukan</span>
              <ArrowDownLeft className="w-4 h-4" aria-hidden="true" />
            </div>
            <p className="font-display text-2xl font-extrabold text-[#42201D] tabular-nums mt-2">
              {formatIDR(metrics.totalIncome)}
            </p>
            <p className="text-xs text-[#42201D]/70 mt-1 tabular-nums">
              {metrics.incomeCount} transaksi masuk
            </p>
          </div>

          {/* Total Pengeluaran */}
          <div className="bg-white rounded-xl p-5 border border-[#42201D]/10">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#DC2626]">
              <span>Total Pengeluaran</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </div>
            <p className="font-display text-2xl font-extrabold text-[#42201D] tabular-nums mt-2">
              {formatIDR(metrics.totalExpense)}
            </p>
            <p className="text-xs text-[#42201D]/70 mt-1 tabular-nums">
              {metrics.expenseCount} transaksi keluar
            </p>
          </div>

          {/* Laba Bersih / Saldo */}
          <div className="bg-white rounded-xl p-5 border border-[#42201D]/10">
            <div
              className={`flex items-center justify-between text-xs font-bold uppercase tracking-wider ${
                metrics.netBalance >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'
              }`}
            >
              <span>
                Saldo / Laba Bersih ·{' '}
                {metrics.netBalance >= 0 ? 'Surplus' : 'Defisit'}
              </span>
              <Wallet className="w-4 h-4" aria-hidden="true" />
            </div>
            <p
              className={`font-display text-2xl font-extrabold tabular-nums mt-2 ${
                metrics.netBalance >= 0 ? 'text-[#42201D]' : 'text-[#DC2626]'
              }`}
            >
              {metrics.netBalance < 0
                ? `-${formatIDR(Math.abs(metrics.netBalance))}`
                : formatIDR(metrics.netBalance)}
            </p>
            <p className="text-xs text-[#42201D]/70 mt-1">
              Selisih pemasukan &amp; pengeluaran
            </p>
          </div>

          {/* Margin & Total Transaksi */}
          <div className="bg-white rounded-xl p-5 border border-[#42201D]/10">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#781B19]">
              <span>Margin Usaha</span>
              <BookOpen className="w-4 h-4" aria-hidden="true" />
            </div>
            <p className="font-display text-2xl font-extrabold text-[#42201D] tabular-nums mt-2">
              {metrics.marginPercent}%
            </p>
            <p className="text-xs text-[#42201D]/70 mt-1 tabular-nums">
              {filteredEntries.length} total catatan pada periode
            </p>
          </div>
        </section>

        {/* Payment Method Breakdown & Top Categories */}
        {entries.length > 0 && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Saldo per Metode Pembayaran */}
            <div className="lg:col-span-6 bg-white rounded-xl p-5 border border-[#42201D]/10 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-base font-bold text-[#42201D]">
                  Arus Kas per Metode Pembayaran
                </h2>
                <span className="text-xs text-[#42201D]/65">
                  Laci Kas vs Rekening
                </span>
              </div>

              <div className="divide-y divide-[#42201D]/10">
                {(
                  [
                    {
                      id: 'cash' as const,
                      label: 'Tunai (Cash)',
                      icon: Banknote,
                    },
                    {
                      id: 'transfer' as const,
                      label: 'Transfer Bank (BCA / Mandiri)',
                      icon: Landmark,
                    },
                    {
                      id: 'qris' as const,
                      label: 'QRIS / Barcode',
                      icon: QrCode,
                    },
                  ] as const
                ).map((ch) => {
                  const Icon = ch.icon;
                  const stat = metrics.byPayment[ch.id];
                  const net = stat.income - stat.expense;
                  return (
                    <div
                      key={ch.id}
                      className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className="w-4 h-4 text-[#781B19] shrink-0"
                          aria-hidden="true"
                        />
                        <span className="text-sm font-semibold text-[#42201D]">
                          {ch.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs tabular-nums">
                        <span className="text-[#16A34A] font-semibold">
                          +{formatIDR(stat.income)}
                        </span>
                        <span className="text-[#DC2626] font-semibold">
                          -{formatIDR(stat.expense)}
                        </span>
                        <span className="font-bold text-[#42201D] min-w-[90px] text-right">
                          {net < 0
                            ? `-${formatIDR(Math.abs(net))}`
                            : formatIDR(net)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rincian Kategori Pengeluaran & Pemasukan */}
            <div className="lg:col-span-6 bg-white rounded-xl p-5 border border-[#42201D]/10 space-y-4">
              <h2 className="font-display text-base font-bold text-[#42201D]">
                Komposisi Pengeluaran Terbesar
              </h2>
              {metrics.topExpenseCategories.length === 0 ? (
                <p className="text-sm text-[#42201D]/65">
                  Belum ada catatan pengeluaran pada periode yang dipilih.
                </p>
              ) : (
                <div className="space-y-3">
                  {metrics.topExpenseCategories.map((cat) => {
                    const pct =
                      metrics.totalExpense > 0
                        ? Math.round((cat.amount / metrics.totalExpense) * 100)
                        : 0;
                    return (
                      <div key={cat.name} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-[#42201D] truncate pr-3">
                            {cat.name}
                          </span>
                          <span className="font-bold text-[#DC2626] tabular-nums shrink-0">
                            {formatIDR(cat.amount)} ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-[#FFF8EA] overflow-hidden">
                          <div
                            className="h-full bg-[#781B19] rounded-full"
                            style={{ width: `${Math.max(pct, 4)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Filter Toolbar & Ledger Table */}
        <section className="bg-white rounded-xl border border-[#42201D]/10 overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-[#42201D]/10 space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Period Filters */}
              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { id: 'all', label: 'Semua Waktu' },
                    { id: 'today', label: 'Hari Ini' },
                    { id: '7d', label: '7 Hari' },
                    { id: 'month', label: 'Bulan Ini' },
                    { id: 'custom_month', label: 'Pilih Bulan' },
                  ] as const
                ).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPeriodFilter(p.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      periodFilter === p.id
                        ? 'bg-[#781B19] text-white'
                        : 'bg-[#FFF8EA] text-[#42201D] hover:bg-[#F4C343]/30'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
                {periodFilter === 'custom_month' && (
                  <input
                    type="month"
                    aria-label="Pilih bulan laporan"
                    value={customMonth}
                    onChange={(e) => setCustomMonth(e.target.value)}
                    className="px-2.5 py-1 rounded-lg border border-[#42201D]/20 text-xs font-semibold text-[#42201D] bg-white"
                  />
                )}
              </div>

              {/* Search + Type + Payment Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 sm:flex-initial">
                  <Search
                    className="w-3.5 h-3.5 text-[#42201D]/50 absolute left-3 top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari catatan / kategori..."
                    className="w-full sm:w-52 pl-8 pr-3 py-1.5 rounded-lg border border-[#42201D]/20 text-xs text-[#42201D] bg-[#FFF8EA]/50 focus:outline-none focus:ring-2 focus:ring-[#781B19]"
                  />
                </div>

                <select
                  aria-label="Filter tipe transaksi"
                  value={typeFilter}
                  onChange={(e) =>
                    setTypeFilter(e.target.value as 'all' | FinanceEntryType)
                  }
                  className="px-2.5 py-1.5 rounded-lg border border-[#42201D]/20 text-xs font-semibold text-[#42201D] bg-white"
                >
                  <option value="all">Semua Tipe</option>
                  <option value="income">Pemasukan</option>
                  <option value="expense">Pengeluaran</option>
                </select>

                <select
                  aria-label="Filter metode pembayaran"
                  value={paymentFilter}
                  onChange={(e) =>
                    setPaymentFilter(
                      e.target.value as 'all' | FinancePaymentMethod
                    )
                  }
                  className="px-2.5 py-1.5 rounded-lg border border-[#42201D]/20 text-xs font-semibold text-[#42201D] bg-white"
                >
                  <option value="all">Semua Metode</option>
                  <option value="cash">Tunai (Cash)</option>
                  <option value="transfer">Transfer Bank</option>
                  <option value="qris">QRIS</option>
                </select>
              </div>
            </div>

            {/* Backup / Restore / Clear Tools */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#42201D]/8 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleBackupJson}
                  disabled={entries.length === 0}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[#42201D]/80 hover:bg-[#FFF8EA] disabled:opacity-40 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Backup JSON</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[#42201D]/80 hover:bg-[#FFF8EA] cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Restore JSON</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json"
                  onChange={handleImportJson}
                  className="hidden"
                />
              </div>

              {entries.length > 0 && (
                <div>
                  {confirmClearAll ? (
                    <div className="inline-flex items-center gap-2 bg-[#FFF8EA] px-2.5 py-1 rounded-lg border border-[#DC2626]/30">
                      <span className="font-semibold text-[#DC2626]">
                        Hapus semua catatan?
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          clearAllEntries();
                          setConfirmClearAll(false);
                          showNotice('Semua catatan pembukuan telah dihapus.');
                        }}
                        className="font-bold text-[#DC2626] hover:underline cursor-pointer"
                      >
                        Ya, Hapus
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmClearAll(false)}
                        className="font-semibold text-[#42201D] hover:underline cursor-pointer"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmClearAll(true)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[#DC2626] hover:bg-[#DC2626]/10 font-semibold cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Reset Pembukuan</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Empty State vs Populated Table */}
          {filteredEntries.length === 0 ? (
            <div className="p-10 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFF8EA] text-[#781B19] mx-auto flex items-center justify-center">
                <BookOpen className="w-6 h-6" aria-hidden="true" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="font-display text-lg font-bold text-[#42201D]">
                  {entries.length === 0
                    ? 'Belum Ada Catatan Keuangan'
                    : 'Tidak Ada Transaksi yang Cocok'}
                </h3>
                <p className="text-sm text-[#42201D]/75">
                  {entries.length === 0
                    ? 'Mulai catat pemasukan penjualan harian serta pengeluaran bahan baku (ayam, kentang, bumbu, minyak, kemasan) untuk memantau laba usaha RAKATA.'
                    : 'Coba ubah filter tanggal, tipe transaksi, atau kata kunci pencarian.'}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => openNewForm('income')}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#F4C343] hover:bg-[#f7cf63] text-[#42201D] font-bold text-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>Catat Transaksi Pertama</span>
                </button>
                {entries.length === 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      loadSampleEntries();
                      showNotice('Contoh data pembukuan UMKM RAKATA berhasil dimuat.');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-[#42201D]/20 bg-white hover:bg-[#FFF8EA] text-[#42201D] font-semibold text-sm transition-colors cursor-pointer"
                  >
                    <span>Muat Contoh Data UMKM</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FFF8EA] border-b border-[#42201D]/10 text-[11px] font-bold uppercase tracking-wider text-[#781B19]">
                    <th className="py-3 px-4 whitespace-nowrap">Tanggal</th>
                    <th className="py-3 px-4 whitespace-nowrap">Tipe</th>
                    <th className="py-3 px-4 whitespace-nowrap">Kategori</th>
                    <th className="py-3 px-4">Keterangan</th>
                    <th className="py-3 px-4 whitespace-nowrap">Metode</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">
                      Nominal
                    </th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#42201D]/8 text-sm">
                  {filteredEntries.map((entry) => {
                    const isIncome = entry.type === 'income';
                    const isDeleting = confirmDeleteId === entry.id;
                    return (
                      <tr
                        key={entry.id}
                        className="hover:bg-[#FFF8EA]/60 transition-colors"
                      >
                        <td className="py-3 px-4 text-xs font-semibold text-[#42201D]/80 tabular-nums whitespace-nowrap">
                          {formatDateID(entry.date)}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-bold ${
                              isIncome ? 'text-[#16A34A]' : 'text-[#DC2626]'
                            }`}
                          >
                            {isIncome ? (
                              <ArrowDownLeft
                                className="w-3.5 h-3.5"
                                aria-hidden="true"
                              />
                            ) : (
                              <ArrowUpRight
                                className="w-3.5 h-3.5"
                                aria-hidden="true"
                              />
                            )}
                            <span>{isIncome ? 'Masuk' : 'Keluar'}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs font-semibold text-[#42201D] whitespace-nowrap">
                          {entry.category}
                        </td>
                        <td className="py-3 px-4 text-xs sm:text-sm text-[#42201D]/85 min-w-[200px]">
                          {entry.description}
                        </td>
                        <td className="py-3 px-4 text-xs font-medium text-[#42201D]/75 whitespace-nowrap">
                          {formatPaymentLabel(entry.paymentMethod)}
                        </td>
                        <td
                          className={`py-3 px-4 text-right font-bold tabular-nums whitespace-nowrap ${
                            isIncome ? 'text-[#16A34A]' : 'text-[#DC2626]'
                          }`}
                        >
                          {isIncome ? '+' : '-'}
                          {formatIDR(entry.amount)}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          {isDeleting ? (
                            <div className="inline-flex items-center gap-2 text-xs">
                              <button
                                type="button"
                                onClick={() => {
                                  deleteEntry(entry.id);
                                  setConfirmDeleteId(null);
                                  showNotice('Catatan berhasil dihapus.');
                                }}
                                className="font-bold text-[#DC2626] hover:underline cursor-pointer"
                              >
                                Hapus
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="font-semibold text-[#42201D]/70 hover:underline cursor-pointer"
                              >
                                Batal
                              </button>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => openEditForm(entry)}
                                aria-label={`Edit catatan ${entry.description}`}
                                className="p-1.5 rounded-lg text-[#42201D]/60 hover:text-[#781B19] hover:bg-[#FFF8EA] cursor-pointer"
                              >
                                <Edit3 className="w-4 h-4" aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(entry.id)}
                                aria-label={`Hapus catatan ${entry.description}`}
                                className="p-1.5 rounded-lg text-[#42201D]/60 hover:text-[#DC2626] hover:bg-[#DC2626]/10 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" aria-hidden="true" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Add / Edit Transaction Modal */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="finance-form-title"
          onClick={() => setIsFormOpen(false)}
        >
          <form
            onSubmit={handleSaveEntry}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-lg bg-[#FFF8EA] text-[#42201D] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="px-5 py-4 bg-[#781B19] text-white flex items-center justify-between">
              <h2 id="finance-form-title" className="font-display text-lg font-bold">
                {editingEntry ? 'Edit Catatan Keuangan' : 'Catat Transaksi Baru'}
              </h2>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                aria-label="Tutup form"
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/15 cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Type Segmented Control */}
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-[#781B19] mb-1.5">
                  Jenis Transaksi
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleTypeSwitch('income')}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-bold transition-colors cursor-pointer ${
                      formType === 'income'
                        ? 'bg-[#16A34A] text-white border-[#16A34A]'
                        : 'bg-white text-[#42201D] border-[#42201D]/15'
                    }`}
                  >
                    <ArrowDownLeft className="w-4 h-4" aria-hidden="true" />
                    <span>Pemasukan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeSwitch('expense')}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-bold transition-colors cursor-pointer ${
                      formType === 'expense'
                        ? 'bg-[#DC2626] text-white border-[#DC2626]'
                        : 'bg-white text-[#42201D] border-[#42201D]/15'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                    <span>Pengeluaran</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="fin-date"
                    className="block text-xs font-bold uppercase tracking-wider text-[#781B19] mb-1.5"
                  >
                    Tanggal
                  </label>
                  <input
                    id="fin-date"
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-white border border-[#42201D]/20 text-sm text-[#42201D] focus:outline-none focus:ring-2 focus:ring-[#781B19]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="fin-payment"
                    className="block text-xs font-bold uppercase tracking-wider text-[#781B19] mb-1.5"
                  >
                    Metode Pembayaran
                  </label>
                  <select
                    id="fin-payment"
                    value={formPaymentMethod}
                    onChange={(e) =>
                      setFormPaymentMethod(
                        e.target.value as FinancePaymentMethod
                      )
                    }
                    className="w-full px-3 py-2.5 rounded-lg bg-white border border-[#42201D]/20 text-sm text-[#42201D] focus:outline-none focus:ring-2 focus:ring-[#781B19]"
                  >
                    <option value="cash">Tunai (Cash)</option>
                    <option value="transfer">Transfer Bank</option>
                    <option value="qris">QRIS</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="fin-category"
                  className="block text-xs font-bold uppercase tracking-wider text-[#781B19] mb-1.5"
                >
                  Kategori
                </label>
                <select
                  id="fin-category"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-white border border-[#42201D]/20 text-sm text-[#42201D] focus:outline-none focus:ring-2 focus:ring-[#781B19]"
                >
                  {activeCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="fin-amount"
                  className="block text-xs font-bold uppercase tracking-wider text-[#781B19] mb-1.5"
                >
                  Nominal (Rp)
                </label>
                <input
                  id="fin-amount"
                  type="text"
                  inputMode="numeric"
                  value={formAmount}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '');
                    setFormAmount(digits);
                    setFormError('');
                  }}
                  placeholder="Contoh: 150000"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#42201D]/20 text-sm font-bold tabular-nums text-[#42201D] focus:outline-none focus:ring-2 focus:ring-[#781B19]"
                />
                {Number(formAmount) > 0 && (
                  <p className="mt-1 text-xs font-semibold text-[#781B19] tabular-nums">
                    Terbaca: {formatIDR(Number(formAmount))}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="fin-description"
                  className="block text-xs font-bold uppercase tracking-wider text-[#781B19] mb-1.5"
                >
                  Keterangan
                </label>
                <textarea
                  id="fin-description"
                  rows={2}
                  value={formDescription}
                  onChange={(e) => {
                    setFormDescription(e.target.value);
                    setFormError('');
                  }}
                  placeholder={
                    formType === 'income'
                      ? 'Contoh: Rekap penjualan shift siang (Ayam Gunting & Kentang)'
                      : 'Contoh: Belanja ayam fillet 5 kg dan kentang goreng'
                  }
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#42201D]/20 text-sm text-[#42201D] resize-none focus:outline-none focus:ring-2 focus:ring-[#781B19]"
                />
              </div>

              {formError && (
                <p className="text-xs font-semibold text-[#DC2626]" role="alert">
                  {formError}
                </p>
              )}
            </div>

            <div className="px-5 py-4 bg-white border-t border-[#42201D]/10 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2.5 rounded-lg border border-[#42201D]/15 text-sm font-semibold text-[#42201D] hover:bg-[#FFF8EA] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#F4C343] hover:bg-[#f7cf63] text-[#42201D] font-bold text-sm cursor-pointer"
              >
                {editingEntry ? 'Simpan Perubahan' : 'Simpan Catatan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Owner PIN Settings Modal */}
      {isPinModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pin-settings-title"
          onClick={() => setIsPinModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#FFF8EA] text-[#42201D] rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="px-5 py-4 bg-[#541412] text-white flex items-center justify-between">
              <h2 id="pin-settings-title" className="font-display text-base font-bold">
                Keamanan PIN Owner
              </h2>
              <button
                type="button"
                onClick={() => setIsPinModalOpen(false)}
                aria-label="Tutup pengaturan PIN"
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSavePinSetting} className="p-5 space-y-4">
              <p className="text-xs text-[#42201D]/80 leading-relaxed">
                Aktifkan PIN 4–6 digit agar halaman pembukuan hanya dapat dibuka
                oleh pemilik usaha saat perangkat dipakai bersama kasir/pelanggan.
              </p>

              <div>
                <label
                  htmlFor="new-owner-pin"
                  className="block text-xs font-bold uppercase tracking-wider text-[#781B19] mb-1.5"
                >
                  {ownerPin ? 'Ganti PIN Baru' : 'Buat PIN Owner'}
                </label>
                <input
                  id="new-owner-pin"
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={newPinInput}
                  onChange={(e) => {
                    setNewPinInput(e.target.value.replace(/\D/g, ''));
                    setPinSettingError('');
                  }}
                  placeholder="4–6 digit angka"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#42201D]/20 text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#781B19]"
                />
                {pinSettingError && (
                  <p className="mt-1 text-xs font-semibold text-[#DC2626]">
                    {pinSettingError}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                {ownerPin ? (
                  <button
                    type="button"
                    onClick={() => {
                      setOwnerPin(null);
                      setIsPinModalOpen(false);
                      showNotice('PIN Owner dinonaktifkan.');
                    }}
                    className="text-xs font-bold text-[#DC2626] hover:underline cursor-pointer"
                  >
                    Nonaktifkan PIN
                  </button>
                ) : (
                  <span />
                )}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPinModalOpen(false)}
                    className="px-3.5 py-2 rounded-lg border border-[#42201D]/15 text-xs font-semibold cursor-pointer"
                  >
                    Tutup
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#781B19] text-white text-xs font-bold cursor-pointer"
                  >
                    Simpan PIN
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
