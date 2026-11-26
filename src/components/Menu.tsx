import { useState } from 'react';
import { MENU_CATEGORIES, MENU_PRODUCTS } from '../data/menuData';
import type { MenuCategory, MenuProduct } from '../types/rakata';
import { ProductCard } from './ProductCard';

interface MenuProps {
  onAddProduct: (product: MenuProduct, selectedSizeId: string) => void;
}

export function Menu({ onAddProduct }: MenuProps) {
  const [activeCategory, setActiveCategory] =
    useState<MenuCategory>('All Menu');

  const filteredProducts =
    activeCategory === 'All Menu'
      ? MENU_PRODUCTS
      : MENU_PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <section
      id="menu"
      className="bg-black/[0.03] text-[#000000] py-16 sm:py-20 border-t border-black/10"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Category Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#8A1C05]">
              Our Menu
            </p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#000000]">
              Explore Our Menu
            </h2>
            <p className="text-base text-[#000000]/75">
              Find Your Favorite Taste!
            </p>
          </div>

          {/* Interactive Category Filter Controls */}
          <div
            role="tablist"
            aria-label="Filter kategori menu"
            className="inline-flex flex-wrap items-center gap-1.5 p-1.5 bg-[#FFFFFF] rounded-xl border border-black/10 shadow-xs self-start md:self-auto"
          >
            {MENU_CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#8A1C05] text-[#FFFFFF]'
                      : 'text-[#000000]/75 hover:text-[#8A1C05] hover:bg-black/[0.04]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddProduct={onAddProduct}
            />
          ))}
        </div>

        {/* Customization Reference Strip */}
        <div className="mt-10 bg-[#FFFFFF] rounded-2xl p-6 border border-black/10 grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
          <div>
            <h3 className="font-display font-bold text-[#8A1C05] mb-1.5">
              Bubuk Tabur Khas Nusantara
            </h3>
            <p className="text-[#000000]/75">
              Rendang · Sambel Matah · Sate Maranggi
            </p>
          </div>
          <div>
            <h3 className="font-display font-bold text-[#8A1C05] mb-1.5">
              Bubuk Tabur Reguler
            </h3>
            <p className="text-[#000000]/75">Barbeque · Balado · Keju Manis</p>
          </div>
          <div>
            <h3 className="font-display font-bold text-[#8A1C05] mb-1.5">
              Bubuk Tabur Premium (+Rp2.000)
            </h3>
            <p className="text-[#000000]/75">
              Seaweed · Honey Butter · Sour Cream &amp; Onion
            </p>
          </div>
          <div>
            <h3 className="font-display font-bold text-[#8A1C05] mb-1.5">
              Pilihan Sauce
            </h3>
            <p className="text-[#000000]/75">
              Hot and Spicy · Barbeque · Cheese Sauce
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
