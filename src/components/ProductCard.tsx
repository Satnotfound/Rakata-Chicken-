import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { formatIDR } from '../config/brand';
import type { MenuProduct } from '../types/rakata';
import { FoodImage } from './FoodImage';

interface ProductCardProps {
  product: MenuProduct;
  onAddProduct: (product: MenuProduct, selectedSizeId: string) => void;
}

export function ProductCard({ product, onAddProduct }: ProductCardProps) {
  const [selectedSizeId, setSelectedSizeId] = useState(product.sizes[0].id);

  const activeSize =
    product.sizes.find((s) => s.id === selectedSizeId) ?? product.sizes[0];

  return (
    <article className="bg-[#FFFFFF] rounded-2xl overflow-hidden shadow-sm border border-black/10 flex flex-col transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md">
      {/* Uniform 4:3 Image Frame */}
      <div
        className={`aspect-[4/3] w-full overflow-hidden ${
          product.imageFit === 'contain' ? 'bg-[#FFFFFF] p-2' : 'bg-black/[0.04]'
        }`}
      >
        <FoodImage
          src={product.image}
          alt={product.name}
          className={`w-full h-full transition-transform duration-300 hover:scale-[1.03] ${
            product.imageFit === 'contain' ? 'object-contain' : 'object-cover'
          }`}
        />
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4 border-t border-black/8">
        <div className="space-y-2">
          {/* Unboxed metadata line */}
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8A1C05]">
            {product.category}
            {product.customizable ? ' · Topping & Sauce' : ' · Add-On'}
          </p>

          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-lg font-bold text-[#000000]">
              {product.name}
            </h3>
            <span className="font-display text-base font-extrabold text-[#8A1C05] tabular-nums shrink-0">
              {formatIDR(activeSize.price)}
            </span>
          </div>

          <p className="text-sm leading-relaxed text-[#000000]/75">
            {product.description}
          </p>
        </div>

        <div className="space-y-3 pt-2 border-t border-black/10">
          {/* Size Selector */}
          <div>
            <p className="text-xs font-semibold text-[#000000]/70 mb-1.5">
              Available Sizes:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((size) => {
                const isSelected = size.id === activeSize.id;
                return (
                  <button
                    key={size.id}
                    type="button"
                    onClick={() => setSelectedSizeId(size.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer tabular-nums whitespace-nowrap ${
                      isSelected
                        ? 'bg-[#8A1C05] text-[#FFFFFF]'
                        : 'bg-black/[0.05] text-[#000000] hover:bg-[#E3BD32]/30'
                    }`}
                  >
                    {size.label} · {formatIDR(size.price)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add to Cart CTA */}
          <button
            type="button"
            onClick={() => onAddProduct(product, activeSize.id)}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#E3BD32] hover:brightness-95 text-[#000000] font-bold text-sm transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>
              {product.customizable ? 'Add to Cart & Customize' : 'Add to Cart'}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
