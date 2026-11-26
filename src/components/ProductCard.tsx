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
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#42201D]/8 flex flex-col transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md">
      {/* Uniform 4:3 Image Frame */}
      <div className="aspect-[4/3] w-full bg-[#FFF8EA] overflow-hidden">
        <FoodImage
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03]"
        />
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2">
          {/* Unboxed metadata line */}
          <p className="text-xs font-semibold uppercase tracking-wider text-[#781B19]">
            {product.category}
            {product.customizable ? ' · Topping & Sauce' : ' · Add-On'}
          </p>

          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-lg font-bold text-[#42201D]">
              {product.name}
            </h3>
            <span className="font-display text-base font-extrabold text-[#781B19] tabular-nums shrink-0">
              {formatIDR(activeSize.price)}
            </span>
          </div>

          <p className="text-sm leading-relaxed text-[#42201D]/80">
            {product.description}
          </p>
        </div>

        <div className="space-y-3 pt-2 border-t border-[#42201D]/8">
          {/* Size Selector */}
          <div>
            <p className="text-xs font-semibold text-[#42201D]/70 mb-1.5">
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
                        ? 'bg-[#781B19] text-white'
                        : 'bg-[#FFF8EA] text-[#42201D] hover:bg-[#F4C343]/30'
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
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#F4C343] hover:bg-[#f7cf63] text-[#42201D] font-bold text-sm transition-colors cursor-pointer"
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
