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
  const activeGalleryImages =
    (selectedPotato && pkg.galleryImagesByPotatoChoice?.[selectedPotato]) ||
    pkg.galleryImages;

  return (
    <article className="bg-[#FFFFFF] text-[#000000] rounded-2xl overflow-hidden shadow-lg border border-black/10 flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5">
      <div>
        {/* Image Header (Single or Multi-Item Package Collage) */}
        <div className="w-full overflow-hidden bg-[#FFFFFF]">
          {activeGalleryImages && activeGalleryImages.length > 1 ? (
            <div
              className={`aspect-[16/10] w-full grid ${
                activeGalleryImages.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
              } divide-x divide-black/10`}
            >
              {activeGalleryImages.map((imgItem, idx) => (
                <div
                  key={`${pkg.id}-${selectedPotato}-img-${idx}`}
                  className={`h-full w-full overflow-hidden ${
                    imgItem.fit === 'cover' ? 'bg-black/[0.04]' : 'bg-[#FFFFFF] p-1.5'
                  }`}
                >
                  <FoodImage
                    src={imgItem.src}
                    alt={`${pkg.code} - ${imgItem.alt}`}
                    className={`w-full h-full ${
                      imgItem.fit === 'cover' ? 'object-cover' : 'object-contain'
                    }`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="aspect-[16/10] w-full bg-[#FFFFFF] p-2 overflow-hidden">
              <FoodImage
                src={activeGalleryImages?.[0]?.src ?? pkg.image}
                alt={`${pkg.code} - ${pkg.fullName}`}
                className={`w-full h-full ${
                  activeGalleryImages?.[0]?.fit === 'cover'
                    ? 'object-cover'
                    : 'object-contain'
                }`}
              />
            </div>
          )}

          <div className="bg-[#000000] px-4 py-2 flex items-center justify-between text-xs font-bold tracking-wider uppercase text-[#FFFFFF]">
            <span>{pkg.code}</span>
            <span className="text-[#E3BD32] tabular-nums">
              {pkg.badge ? `${pkg.badge} · ` : ''}Hemat {formatIDR(savings)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#8A1C05]">
              {pkg.badge ?? `Paket Hemat · ${pkg.code}`}
            </p>
            <h3 className="font-display text-xl font-extrabold text-[#000000] mt-0.5">
              {pkg.code} — {pkg.fullName}
            </h3>
          </div>

          {/* Price Block */}
          <div className="flex items-baseline gap-2.5">
            <span className="font-display text-2xl font-extrabold text-[#8A1C05] tabular-nums">
              {formatIDR(pkg.price)}
            </span>
            <span className="text-sm text-[#000000]/50 line-through tabular-nums">
              {formatIDR(pkg.originalPrice)}
            </span>
            <span className="text-xs font-bold text-[#8A1C05] tabular-nums">
              (-{formatIDR(savings)})
            </span>
          </div>

          {/* Package Contents */}
          <ul className="space-y-2 text-sm text-[#000000]/85 pt-2 border-t border-black/10">
            {pkg.contents.map((line) => (
              <li key={line} className="flex items-start gap-2">
                <Check
                  className="w-4 h-4 text-[#8A1C05] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          {/* SKS 2 Potato Selector */}
          {pkg.potatoChoiceOptions && (
            <div className="pt-2 border-t border-black/10">
              <p className="text-xs font-bold text-[#8A1C05] mb-1.5">
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
                          ? 'bg-[#8A1C05] text-[#FFFFFF] border-[#8A1C05]'
                          : 'bg-[#FFFFFF] text-[#000000] border-black/15 hover:border-[#8A1C05]'
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
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#E3BD32] hover:brightness-95 text-[#000000] font-bold text-sm transition-all cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Order Now</span>
        </button>
      </div>
    </article>
  );
}
