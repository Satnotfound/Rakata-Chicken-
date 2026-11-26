import { useState } from 'react';
import { Check, ShoppingBag } from 'lucide-react';
import { formatIDR } from '../config/brand';
import type { PackageItem } from '../types/rakata';
import { FoodImage } from './FoodImage';

interface PackageCardProps {
  pkg: PackageItem;
  onOrderPackage: (pkg: PackageItem, potatoChoice?: string) => void;
}

export function PackageCard({ pkg, onOrderPackage }: PackageCardProps) {
  const [selectedPotato, setSelectedPotato] = useState<string>(
    pkg.potatoChoiceOptions?.[0] ?? ''
  );

  const savings = pkg.originalPrice - pkg.price;

  return (
    <article className="bg-[#FFF8EA] text-[#42201D] rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5">
      <div>
        {/* Image Header */}
        <div className="aspect-[16/10] w-full bg-[#541412] overflow-hidden relative">
          <FoodImage
            src={pkg.image}
            alt={`${pkg.code} - ${pkg.fullName}`}
            className="w-full h-full object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#42201D]/70 via-transparent to-transparent"
            aria-hidden="true"
          />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-bold tracking-wider uppercase text-white">
            <span>{pkg.code}</span>
            <span className="text-[#F4C343] tabular-nums">
              {pkg.badge ? `${pkg.badge} · ` : ''}Hemat {formatIDR(savings)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#781B19]">
              {pkg.badge ?? `Paket Hemat · ${pkg.code}`}
            </p>
            <h3 className="font-display text-xl font-extrabold text-[#42201D] mt-0.5">
              {pkg.code} — {pkg.fullName}
            </h3>
          </div>

          {/* Price Block */}
          <div className="flex items-baseline gap-2.5">
            <span className="font-display text-2xl font-extrabold text-[#781B19] tabular-nums">
              {formatIDR(pkg.price)}
            </span>
            <span className="text-sm text-[#42201D]/55 line-through tabular-nums">
              {formatIDR(pkg.originalPrice)}
            </span>
            <span className="text-xs font-bold text-[#781B19] tabular-nums">
              (-{formatIDR(savings)})
            </span>
          </div>

          {/* Package Contents */}
          <ul className="space-y-2 text-sm text-[#42201D]/90 pt-2 border-t border-[#42201D]/10">
            {pkg.contents.map((line) => (
              <li key={line} className="flex items-start gap-2">
                <Check
                  className="w-4 h-4 text-[#781B19] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          {/* SKS 2 Potato Selector */}
          {pkg.potatoChoiceOptions && (
            <div className="pt-2 border-t border-[#42201D]/10">
              <p className="text-xs font-bold text-[#781B19] mb-1.5">
                Pilih Kentang:
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                {pkg.potatoChoiceOptions.map((option) => {
                  const active = selectedPotato === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSelectedPotato(option)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold text-left border transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#781B19] text-white border-[#781B19]'
                          : 'bg-white text-[#42201D] border-[#42201D]/15 hover:border-[#781B19]/50'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Now Button */}
      <div className="px-5 pb-5 pt-1">
        <button
          type="button"
          onClick={() =>
            onOrderPackage(
              pkg,
              pkg.potatoChoiceOptions ? selectedPotato : undefined
            )
          }
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#F4C343] hover:bg-[#f7cf63] text-[#42201D] font-bold text-sm transition-colors cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Order Now</span>
        </button>
      </div>
    </article>
  );
}
