import { useMemo, useState } from 'react';
import {
  Banknote,
  BookOpen,
  Check,
  Copy,
  Landmark,
  MessageCircle,
  QrCode,
} from 'lucide-react';
import {
  BANK_ACCOUNTS,
  formatIDR,
  RAKATA_WHATSAPP_NUMBER,
} from '../config/brand';
import { useFinance } from '../context/FinanceContext';
import type { CartItem } from '../types/rakata';

export type PaymentMethodId = 'cash' | 'transfer' | 'qris';

const PAYMENT_OPTIONS: {
  id: PaymentMethodId;
  label: string;
  shortLabel: string;
  icon: typeof Banknote;
}[] = [
  {
    id: 'cash',
    label: 'Tunai (Cash)',
    shortLabel: 'Tunai',
    icon: Banknote,
  },
  {
    id: 'transfer',
    label: 'Transfer Bank',
    shortLabel: 'Transfer',
    icon: Landmark,
  },
  {
    id: 'qris',
    label: 'QRIS / Barcode',
    shortLabel: 'QRIS',
    icon: QrCode,
  },
];

interface CheckoutProps {
  items: CartItem[];
  totalPrice: number;
}

export function getPaymentMethodDisplay(method: PaymentMethodId): string {
  switch (method) {
    case 'cash':
      return 'Tunai (Cash)';
    case 'transfer':
      return 'Transfer Bank (BCA / Mandiri a.n. RAKATA)';
    case 'qris':
      return 'QRIS / Barcode';
  }
}

export function buildWhatsAppMessage(
  customerName: string,
  orderNotes: string,
  paymentMethod: PaymentMethodId,
  items: CartItem[],
  totalPrice: number
): string {
  const formattedOrders = items
    .map((item, index) => {
      const subtotal = item.unitPrice * item.quantity;
      const prefix = items.length > 1 ? `${index + 1}. ` : '';
      return [
        `${prefix}${item.name}`,
        `Ukuran/Paket: ${item.sizeLabel}`,
        `Topping: ${item.toppingName}${
          item.toppingPrice > 0 ? ` (+${formatIDR(item.toppingPrice)})` : ''
        }`,
        `Sauce: ${item.sauceName}`,
        `Jumlah: ${item.quantity}x (${formatIDR(item.unitPrice)})`,
        `Subtotal: ${formatIDR(subtotal)}`,
      ].join('\n');
    })
    .join('\n\n');

  const notesBlock = orderNotes.trim()
    ? `\n\nCatatan:\n${orderNotes.trim()}`
    : '';

  return [
    'Halo RAKATA! Saya ingin memesan:',
    '',
    'Nama:',
    customerName.trim() || '-',
    '',
    'Pesanan:',
    formattedOrders + notesBlock,
    '',
    'Metode Pembayaran:',
    getPaymentMethodDisplay(paymentMethod),
    '',
    'Total Pembayaran:',
    formatIDR(totalPrice),
    '',
    'Mohon konfirmasi pesanan saya. Terima kasih!',
  ].join('\n');
}

// Deterministic crisp QR pattern for QRIS Standar Nasional card
const QR_MATRIX_ROWS = [
  '1111111010110101111111',
  '1000001001101001000001',
  '1011101011010101011101',
  '1011101001011001011101',
  '1011101010100101011101',
  '1000001001110001000001',
  '1111111010101011111111',
  '0000000011010100000000',
  '1011011101101011010110',
  '0100100010010100111001',
  '1101101101110011001011',
  '0011010010101100110100',
  '1010111101010111011010',
  '0110000110101001000111',
  '0000000011011010110100',
  '1111111001010101011011',
  '1000001010111011001100',
  '1011101011000100110011',
  '1011101001101011101100',
  '1011101010011100010111',
  '1000001001100011011001',
  '1111111011011010101110',
];

function QrisBarcodeSvg() {
  const size = QR_MATRIX_ROWS.length;
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-40 h-40 mx-auto"
      role="img"
      aria-label="Kode QRIS Standar Nasional RAKATA"
    >
      <rect width={size} height={size} fill="#FFFFFF" />
      {QR_MATRIX_ROWS.map((row, y) =>
        row.split('').map((cell, x) =>
          cell === '1' ? (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill="#42201D"
            />
          ) : null
        )
      )}
    </svg>
  );
}

export function Checkout({ items, totalPrice }: CheckoutProps) {
  const { addEntry } = useFinance();
  const [customerName, setCustomerName] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('cash');
  const [nameError, setNameError] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedBankId, setCopiedBankId] = useState<string | null>(null);
  const [recordedToLedger, setRecordedToLedger] = useState(false);

  const isNameValid = customerName.trim().length > 0;

  const message = useMemo(
    () =>
      buildWhatsAppMessage(
        customerName,
        orderNotes,
        paymentMethod,
        items,
        totalPrice
      ),
    [customerName, orderNotes, paymentMethod, items, totalPrice]
  );

  const whatsappUrl = useMemo(() => {
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${RAKATA_WHATSAPP_NUMBER}?text=${encoded}`;
  }, [message]);

  const handleInvalidClick = () => {
    setNameError('Mohon masukkan nama Anda terlebih dahulu.');
    const inputEl = document.getElementById('rakata-customer-name');
    inputEl?.focus();
  };

  const handleCopyMessage = async () => {
    if (!isNameValid) {
      handleInvalidClick();
      return;
    }
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignore clipboard failures if blocked by browser policy
    }
  };

  const handleCopyAccount = async (bankId: string, rawNumber: string) => {
    try {
      await navigator.clipboard.writeText(rawNumber);
      setCopiedBankId(bankId);
      window.setTimeout(() => setCopiedBankId(null), 2200);
    } catch {
      // Ignore clipboard failures
    }
  };

  return (
    <div className="space-y-4">
      {/* Payment Method Selector */}
      <div>
        <span className="block text-xs font-bold uppercase tracking-wider text-[#781B19] mb-2">
          Metode Pembayaran
        </span>
        <div
          role="radiogroup"
          aria-label="Pilih metode pembayaran"
          className="grid grid-cols-3 gap-2"
        >
          {PAYMENT_OPTIONS.map((option) => {
            const Icon = option.icon;
            const active = paymentMethod === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setPaymentMethod(option.id)}
                className={`flex flex-col items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl border text-center transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#781B19] text-white border-[#781B19]'
                    : 'bg-white text-[#42201D] border-[#42201D]/15 hover:border-[#781B19]/50'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    active ? 'text-[#F4C343]' : 'text-[#781B19]'
                  }`}
                  aria-hidden="true"
                />
                <span className="text-[11px] font-bold leading-tight">
                  {option.shortLabel}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Payment Method Details */}
        <div className="mt-2.5">
          {paymentMethod === 'cash' && (
            <div className="bg-white rounded-xl p-3.5 border border-[#42201D]/10 text-xs text-[#42201D]/85 leading-relaxed">
              <p className="font-bold text-[#781B19] mb-1">Tunai (Cash)</p>
              <p>
                Bayar langsung di kasir restoran (saat Ambil Sendiri) atau
                serahkan kepada kurir pengantar saat pesanan tiba.
              </p>
            </div>
          )}

          {paymentMethod === 'transfer' && (
            <div className="bg-white rounded-xl p-3.5 border border-[#42201D]/10 space-y-2.5">
              <p className="text-xs font-bold text-[#781B19]">
                Transfer Bank · Rekening Resmi
              </p>
              <div className="space-y-2">
                {BANK_ACCOUNTS.map((bank) => {
                  const isCopied = copiedBankId === bank.id;
                  return (
                    <div
                      key={bank.id}
                      className="flex items-center justify-between gap-2 bg-[#FFF8EA] rounded-lg px-3 py-2 border border-[#42201D]/10"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#42201D]">
                          {bank.bankName}
                        </p>
                        <p className="text-xs font-bold text-[#781B19] tabular-nums">
                          {bank.accountNumber}
                        </p>
                        <p className="text-[11px] text-[#42201D]/70">
                          a.n. {bank.accountHolder}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyAccount(bank.id, bank.rawNumber)
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#F4C343]/30 border border-[#42201D]/15 text-[11px] font-bold text-[#42201D] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      >
                        {isCopied ? (
                          <>
                            <Check
                              className="w-3 h-3 text-[#781B19]"
                              aria-hidden="true"
                            />
                            <span>Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" aria-hidden="true" />
                            <span>Salin Nomor Rekening</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
              <p className="text-[11px] text-[#42201D]/70 leading-relaxed">
                Lampirkan bukti transfer saat mengirim pesanan ke WhatsApp admin
                untuk percepatan konfirmasi.
              </p>
            </div>
          )}

          {paymentMethod === 'qris' && (
            <div className="bg-white rounded-xl p-4 border border-[#42201D]/10 text-center space-y-2.5">
              <div className="flex items-center justify-between text-xs border-b border-[#42201D]/10 pb-2">
                <span className="font-display font-extrabold tracking-wide text-[#781B19]">
                  QRIS Standar Nasional
                </span>
                <span className="font-bold text-[#42201D]">RAKATA</span>
              </div>

              <div className="p-2 bg-white inline-block rounded-lg border border-[#42201D]/10">
                <QrisBarcodeSvg />
              </div>

              <div className="bg-[#FFF8EA] rounded-lg py-2 px-3 border border-[#42201D]/10">
                <p className="text-[11px] text-[#42201D]/70">
                  Total Pembayaran Dinamis
                </p>
                <p className="font-display text-base font-extrabold text-[#781B19] tabular-nums">
                  {formatIDR(totalPrice)}
                </p>
              </div>

              <p className="text-[11px] text-[#42201D]/75 leading-relaxed">
                Scan menggunakan GoPay · OVO · DANA · ShopeePay · BCA Mobile ·
                Livin&apos; by Mandiri · aplikasi mobile banking lainnya.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Customer Name & Notes */}
      <div className="space-y-3">
        <div>
          <label
            htmlFor="rakata-customer-name"
            className="block text-xs font-bold uppercase tracking-wider text-[#781B19] mb-1.5"
          >
            Nama Pemesan <span aria-hidden="true">*</span>
          </label>
          <input
            id="rakata-customer-name"
            type="text"
            value={customerName}
            onChange={(e) => {
              setCustomerName(e.target.value);
              if (e.target.value.trim()) setNameError('');
            }}
            placeholder="Contoh: Budi Santoso"
            className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#42201D]/20 text-sm text-[#42201D] placeholder:text-[#42201D]/45 focus:outline-none focus:ring-2 focus:ring-[#781B19]"
          />
          {nameError && (
            <p className="mt-1 text-xs font-semibold text-[#781B19]" role="alert">
              {nameError}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="rakata-order-notes"
            className="block text-xs font-bold uppercase tracking-wider text-[#781B19] mb-1.5"
          >
            Catatan Pesanan (Opsional)
          </label>
          <textarea
            id="rakata-order-notes"
            rows={2}
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            placeholder="Contoh: Saus dipisah, ambil jam 12.30..."
            className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#42201D]/20 text-sm text-[#42201D] placeholder:text-[#42201D]/45 focus:outline-none focus:ring-2 focus:ring-[#781B19] resize-none"
          />
        </div>
      </div>

      {/* Checkout Action Buttons */}
      <div className="space-y-2">
        {isNameValid ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg bg-[#781B19] hover:bg-[#541412] text-white font-bold text-sm transition-colors"
          >
            <MessageCircle
              className="w-4 h-4 text-[#F4C343] shrink-0"
              aria-hidden="true"
            />
            <span>Checkout via WhatsApp</span>
          </a>
        ) : (
          <button
            type="button"
            onClick={handleInvalidClick}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg bg-[#781B19] hover:bg-[#541412] text-white font-bold text-sm transition-colors cursor-pointer"
          >
            <MessageCircle
              className="w-4 h-4 text-[#F4C343] shrink-0"
              aria-hidden="true"
            />
            <span>Checkout via WhatsApp</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleCopyMessage}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#42201D]/20 bg-white hover:bg-[#FFF8EA] text-[#42201D] font-semibold text-xs transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#781B19]" aria-hidden="true" />
              <span>Format Pesanan Tersalin</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Salin Pesan Pesanan</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            const now = new Date();
            const today = `${now.getFullYear()}-${String(
              now.getMonth() + 1
            ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
            const itemSummary = items
              .map((i) => `${i.quantity}x ${i.name} (${i.sizeLabel})`)
              .join(', ');
            const buyer = customerName.trim()
              ? `Pemesan: ${customerName.trim()} — `
              : '';
            addEntry({
              date: today,
              type: 'income',
              category: 'Pesanan WhatsApp',
              paymentMethod,
              amount: totalPrice,
              description: `${buyer}${itemSummary}`,
              source: 'order',
            });
            setRecordedToLedger(true);
            window.setTimeout(() => setRecordedToLedger(false), 3000);
          }}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-[#781B19] hover:bg-[#781B19]/10 font-semibold text-xs transition-colors cursor-pointer"
        >
          {recordedToLedger ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#16A34A]" aria-hidden="true" />
              <span className="text-[#16A34A]">
                Tercatat ke Pemasukan Owner
              </span>
            </>
          ) : (
            <>
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Catat Order ke Pembukuan Owner</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
