import { useEffect } from 'react';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { formatIDR } from '../config/brand';
import { useCart } from '../context/CartContext';
import { Checkout } from './Checkout';
import { FoodImage } from './FoodImage';

export function ShoppingCart() {
  const {
    items,
    totalItems,
    totalPrice,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  useEffect(() => {
    if (!isCartOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shopping-cart-title"
      onClick={closeCart}
    >
      <aside
        className="w-full max-w-md h-full bg-[#FFFFFF] text-[#000000] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-5 py-4 bg-[#8A1C05] text-[#FFFFFF] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#E3BD32]" aria-hidden="true" />
            <div>
              <h2 id="shopping-cart-title" className="font-display text-lg font-bold">
                Keranjang Pesanan
              </h2>
              <p className="text-xs text-[#FFFFFF]/80 tabular-nums">
                {totalItems} item dipilih
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-xs font-semibold text-[#E3BD32] hover:underline px-2 py-1 cursor-pointer"
              >
                Kosongkan
              </button>
            )}
            <button
              type="button"
              onClick={closeCart}
              aria-label="Tutup keranjang"
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[#FFFFFF] hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-black/[0.04] border border-black/10 flex items-center justify-center text-[#8A1C05]">
              <ShoppingBag className="w-7 h-7" aria-hidden="true" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-display text-lg font-bold text-[#000000]">
                Keranjang Masih Kosong
              </h3>
              <p className="text-sm text-[#000000]/75 max-w-xs">
                Pilih ayam gunting, kentang goreng, atau paket spesial RAKATA
                favoritmu terlebih dahulu.
              </p>
            </div>
            <a
              href="#menu"
              onClick={closeCart}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#E3BD32] hover:brightness-95 text-[#000000] font-bold text-sm transition-all"
            >
              Jelajahi Menu
            </a>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 bg-black/[0.02]">
            <div className="space-y-3">
              {items.map((item) => {
                const subtotal = item.unitPrice * item.quantity;
                return (
                  <div
                    key={item.cartItemId}
                    className="bg-[#FFFFFF] rounded-xl p-3.5 border border-black/10 shadow-xs space-y-3"
                  >
                    <div className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-black/[0.04] shrink-0">
                        <FoodImage
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-display text-sm font-bold text-[#000000] leading-snug">
                            {item.name}
                          </h3>
                          <button
                            type="button"
                            onClick={() => removeItem(item.cartItemId)}
                            aria-label={`Hapus ${item.name}`}
                            className="text-[#000000]/45 hover:text-[#8A1C05] p-1 rounded cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>

                        <div className="mt-1 space-y-0.5 text-xs text-[#000000]/70">
                          <p>
                            Ukuran: <span className="font-semibold text-[#000000]">{item.sizeLabel}</span>
                          </p>
                          <p>
                            Topping:{' '}
                            <span className="font-semibold text-[#000000]">
                              {item.toppingName}
                            </span>
                            {item.toppingPrice > 0 && (
                              <span className="text-[#8A1C05] font-semibold tabular-nums">
                                {' '}
                                (+{formatIDR(item.toppingPrice)})
                              </span>
                            )}
                          </p>
                          <p>
                            Sauce:{' '}
                            <span className="font-semibold text-[#000000]">
                              {item.sauceName}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-black/10 flex items-center justify-between gap-3">
                      <div className="inline-flex items-center border border-black/15 rounded-lg bg-black/[0.03]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, -1)}
                          aria-label={`Kurangi jumlah ${item.name}`}
                          className="w-8 h-8 flex items-center justify-center text-[#000000] hover:bg-black/10 rounded-l-lg cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, 1)}
                          aria-label={`Tambah jumlah ${item.name}`}
                          className="w-8 h-8 flex items-center justify-center text-[#000000] hover:bg-black/10 rounded-r-lg cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-[11px] text-[#000000]/65 tabular-nums">
                          {formatIDR(item.unitPrice)} x {item.quantity}
                        </div>
                        <div className="font-display text-sm font-extrabold text-[#8A1C05] tabular-nums">
                          {formatIDR(subtotal)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary & WhatsApp Checkout */}
            <div className="pt-4 border-t border-black/15 space-y-4">
              <div className="flex items-baseline justify-between bg-[#FFFFFF] rounded-xl px-4 py-3 border border-black/10">
                <span className="text-sm font-semibold text-[#000000]">
                  Total Pembayaran
                </span>
                <span className="font-display text-xl font-extrabold text-[#8A1C05] tabular-nums">
                  {formatIDR(totalPrice)}
                </span>
              </div>

              <Checkout items={items} totalPrice={totalPrice} />
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
