import { useEffect, useState } from 'react';
import { Check, Minus, Plus, X } from 'lucide-react';
import { formatIDR } from '../config/brand';
import { SAUCE_OPTIONS, TOPPING_OPTIONS } from '../data/menuData';
import type {
  MenuProduct,
  PackageItem,
  SauceOption,
  ToppingOption,
} from '../types/rakata';
import { FoodImage } from './FoodImage';

export type CustomizerTarget =
  | {
      kind: 'product';
      product: MenuProduct;
      initialSizeId: string;
    }
  | {
      kind: 'package';
      pkg: PackageItem;
      initialPotatoChoice?: string;
    };

interface ToppingSelectorProps {
  target: CustomizerTarget | null;
  onClose: () => void;
  onConfirm: (payload: {
    kind: 'product' | 'package';
    itemId: string;
    name: string;
    sizeLabel: string;
    toppingName: string;
    toppingCategoryLabel: string;
    sauceName: string;
    potatoChoice?: string;
    basePrice: number;
    toppingPrice: number;
    unitPrice: number;
    quantity: number;
    image: string;
  }) => void;
}

export function ToppingSelector({
  target,
  onClose,
  onConfirm,
}: ToppingSelectorProps) {
  const [selectedSizeId, setSelectedSizeId] = useState<string>('');
  const [selectedTopping, setSelectedTopping] = useState<ToppingOption>(
    TOPPING_OPTIONS[0]
  );
  const [selectedSauce, setSelectedSauce] = useState<SauceOption>(
    SAUCE_OPTIONS[0]
  );
  const [potatoChoice, setPotatoChoice] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (!target) return;
    setQuantity(1);
    if (target.kind === 'product') {
      setSelectedSizeId(target.initialSizeId || target.product.sizes[0].id);
      setSelectedTopping(TOPPING_OPTIONS[0]);
      setSelectedSauce(SAUCE_OPTIONS[0]);
      setPotatoChoice('');
    } else {
      setSelectedSizeId('pkg');
      // Default to first Premium topping on packages to highlight Free Bubuk Premium
      const firstPremium =
        TOPPING_OPTIONS.find((t) => t.category === 'premium') ??
        TOPPING_OPTIONS[0];
      setSelectedTopping(firstPremium);
      setSelectedSauce(SAUCE_OPTIONS[0]);
      setPotatoChoice(
        target.initialPotatoChoice ??
          target.pkg.potatoChoiceOptions?.[0] ??
          ''
      );
    }
  }, [target]);

  useEffect(() => {
    if (!target) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [target, onClose]);

  if (!target) return null;

  const isPackage = target.kind === 'package';

  const basePrice =
    target.kind === 'product'
      ? (
          target.product.sizes.find((s) => s.id === selectedSizeId) ??
          target.product.sizes[0]
        ).price
      : target.pkg.price;

  const sizeLabel =
    target.kind === 'product'
      ? (
          target.product.sizes.find((s) => s.id === selectedSizeId) ??
          target.product.sizes[0]
        ).label
      : target.pkg.code;

  // Special packages include Free Bubuk Premium!
  const effectiveToppingPrice = isPackage ? 0 : selectedTopping.extraPrice;
  const unitPrice = basePrice + effectiveToppingPrice;
  const finalTotal = unitPrice * quantity;

  const itemTitle =
    target.kind === 'product'
      ? target.product.name
      : `${target.pkg.code} – ${target.pkg.fullName}`;

  const itemImage =
    target.kind === 'product' ? target.product.image : target.pkg.image;

  const nusantaraToppings = TOPPING_OPTIONS.filter(
    (t) => t.category === 'nusantara'
  );
  const regulerToppings = TOPPING_OPTIONS.filter(
    (t) => t.category === 'reguler'
  );
  const premiumToppings = TOPPING_OPTIONS.filter(
    (t) => t.category === 'premium'
  );

  const handleSubmit = () => {
    onConfirm({
      kind: target.kind,
      itemId: target.kind === 'product' ? target.product.id : target.pkg.id,
      name: itemTitle,
      sizeLabel:
        isPackage && potatoChoice ? `${sizeLabel} (${potatoChoice})` : sizeLabel,
      toppingName: selectedTopping.name,
      toppingCategoryLabel: selectedTopping.categoryLabel,
      sauceName: selectedSauce.name,
      potatoChoice: potatoChoice || undefined,
      basePrice,
      toppingPrice: effectiveToppingPrice,
      unitPrice,
      quantity,
      image: itemImage,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customizer-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-2xl max-h-[92vh] bg-[#FFF8EA] text-[#42201D] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-5 py-4 bg-[#781B19] text-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#541412] shrink-0">
              <FoodImage
                src={itemImage}
                alt={itemTitle}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#F4C343]">
                {isPackage ? 'Customize Package' : 'Customize Menu'}
              </p>
              <h3
                id="customizer-title"
                className="font-display text-lg font-bold truncate"
              >
                {itemTitle}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pilihan topping"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#FFF8EA] hover:bg-white/15 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto px-5 py-5 space-y-6">
          {/* Size Selection for Products with multiple sizes */}
          {target.kind === 'product' && target.product.sizes.length > 1 && (
            <div>
              <div className="flex items-baseline justify-between mb-2.5">
                <h4 className="font-display text-sm font-bold uppercase tracking-wide text-[#781B19]">
                  1. Pilih Ukuran
                </h4>
                <span className="text-xs text-[#42201D]/70">Wajib pilih 1</span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {target.product.sizes.map((size) => {
                  const active = size.id === selectedSizeId;
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSelectedSizeId(size.id)}
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#781B19] text-white border-[#781B19]'
                          : 'bg-white text-[#42201D] border-[#42201D]/15 hover:border-[#781B19]/50'
                      }`}
                    >
                      <div className="text-xs font-semibold">{size.label}</div>
                      <div
                        className={`text-sm font-bold tabular-nums mt-0.5 ${
                          active ? 'text-[#F4C343]' : 'text-[#781B19]'
                        }`}
                      >
                        {formatIDR(size.price)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Potato Choice for SKS 2 */}
          {target.kind === 'package' && target.pkg.potatoChoiceOptions && (
            <div>
              <div className="flex items-baseline justify-between mb-2.5">
                <h4 className="font-display text-sm font-bold uppercase tracking-wide text-[#781B19]">
                  Pilih Varian Kentang (SKS 2)
                </h4>
                <span className="text-xs text-[#42201D]/70">Wajib pilih 1</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {target.pkg.potatoChoiceOptions.map((option) => {
                  const active = potatoChoice === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setPotatoChoice(option)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#781B19] text-white border-[#781B19]'
                          : 'bg-white text-[#42201D] border-[#42201D]/15 hover:border-[#781B19]/50'
                      }`}
                    >
                      <span>{option}</span>
                      {active && (
                        <Check
                          className="w-4 h-4 text-[#F4C343] shrink-0"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Topping Selection */}
          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <h4 className="font-display text-sm font-bold uppercase tracking-wide text-[#781B19]">
                Pilih Bubuk Tabur (Topping)
              </h4>
              <span className="text-xs text-[#42201D]/70">
                {isPackage ? 'Free Bubuk Premium' : 'Pilih 1 rasa favorit'}
              </span>
            </div>

            {/* A. Nusantara */}
            <div>
              <p className="text-xs font-bold text-[#42201D]/75 mb-2">
                A. Bubuk Tabur Khas Nusantara · Gratis
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {nusantaraToppings.map((topping) => {
                  const active = selectedTopping.id === topping.id;
                  return (
                    <button
                      key={topping.id}
                      type="button"
                      onClick={() => setSelectedTopping(topping)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#781B19] text-white border-[#781B19]'
                          : 'bg-white text-[#42201D] border-[#42201D]/15 hover:border-[#781B19]/50'
                      }`}
                    >
                      <span className="truncate">{topping.name}</span>
                      <span
                        className={`text-xs tabular-nums ml-2 shrink-0 ${
                          active ? 'text-[#F4C343]' : 'text-[#42201D]/60'
                        }`}
                      >
                        Rp0
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* B. Reguler */}
            <div>
              <p className="text-xs font-bold text-[#42201D]/75 mb-2">
                B. Bubuk Tabur Reguler · Gratis
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {regulerToppings.map((topping) => {
                  const active = selectedTopping.id === topping.id;
                  return (
                    <button
                      key={topping.id}
                      type="button"
                      onClick={() => setSelectedTopping(topping)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#781B19] text-white border-[#781B19]'
                          : 'bg-white text-[#42201D] border-[#42201D]/15 hover:border-[#781B19]/50'
                      }`}
                    >
                      <span className="truncate">{topping.name}</span>
                      <span
                        className={`text-xs tabular-nums ml-2 shrink-0 ${
                          active ? 'text-[#F4C343]' : 'text-[#42201D]/60'
                        }`}
                      >
                        Rp0
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* C. Premium */}
            <div>
              <p className="text-xs font-bold text-[#781B19] mb-2">
                C. Bubuk Tabur Premium ·{' '}
                {isPackage ? 'Gratis (Included in Package)' : '+ Rp2.000'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {premiumToppings.map((topping) => {
                  const active = selectedTopping.id === topping.id;
                  return (
                    <button
                      key={topping.id}
                      type="button"
                      onClick={() => setSelectedTopping(topping)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#781B19] text-white border-[#781B19]'
                          : 'bg-white text-[#42201D] border-[#F4C343]/70 hover:border-[#781B19]'
                      }`}
                    >
                      <span className="truncate">{topping.name}</span>
                      <span
                        className={`text-xs font-semibold tabular-nums ml-2 shrink-0 ${
                          active ? 'text-[#F4C343]' : 'text-[#781B19]'
                        }`}
                      >
                        {isPackage ? 'Free' : '+Rp2.000'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* D. Sauce Selection */}
          <div>
            <div className="flex items-baseline justify-between mb-2.5">
              <h4 className="font-display text-sm font-bold uppercase tracking-wide text-[#781B19]">
                D. Pilih Sauce
              </h4>
              <span className="text-xs text-[#42201D]/70">Gratis</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAUCE_OPTIONS.map((sauce) => {
                const active = selectedSauce.id === sauce.id;
                return (
                  <button
                    key={sauce.id}
                    type="button"
                    onClick={() => setSelectedSauce(sauce)}
                    className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#781B19] text-white border-[#781B19]'
                        : 'bg-white text-[#42201D] border-[#42201D]/15 hover:border-[#781B19]/50'
                    }`}
                  >
                    {sauce.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky Footer with Quantity & Live Final Price */}
        <div className="px-5 py-4 bg-white border-t border-[#42201D]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center justify-between sm:justify-start gap-4">
            <div className="inline-flex items-center border border-[#42201D]/20 rounded-lg bg-[#FFF8EA]">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Kurangi jumlah"
                className="w-10 h-10 flex items-center justify-center text-[#42201D] hover:bg-[#42201D]/10 rounded-l-lg cursor-pointer"
              >
                <Minus className="w-4 h-4" aria-hidden="true" />
              </button>
              <span className="w-10 text-center font-bold text-sm tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Tambah jumlah"
                className="w-10 h-10 flex items-center justify-center text-[#42201D] hover:bg-[#42201D]/10 rounded-r-lg cursor-pointer"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div>
              <div className="text-xs text-[#42201D]/70">
                Harga Satuan:{' '}
                <span className="font-semibold tabular-nums">
                  {formatIDR(unitPrice)}
                </span>
                {effectiveToppingPrice > 0 && (
                  <span className="text-[#781B19]"> (+Rp2.000 Premium)</span>
                )}
              </div>
              <div className="font-display text-lg font-extrabold text-[#781B19] tabular-nums">
                {formatIDR(finalTotal)}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#F4C343] hover:bg-[#f7cf63] text-[#42201D] font-bold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Add to Cart · {formatIDR(finalTotal)}
          </button>
        </div>
      </div>
    </div>
  );
}
