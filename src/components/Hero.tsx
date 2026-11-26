import { ArrowRight } from 'lucide-react';
import { HERO_IMAGE } from '../data/menuData';
import { FoodImage } from './FoodImage';

export function Hero() {
  return (
    <section
      id="home"
      className="bg-[#781B19] text-white border-b border-[#541412]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Copy Column */}
          <div className="lg:col-span-6 space-y-6">
            <p className="text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase text-[#F4C343]">
              GOOD FOOD, GREAT MOOD!
            </p>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-[3.1rem] font-extrabold leading-[1.12] tracking-tight text-white [text-wrap:balance]">
              CRISPY BITES, AUTHENTIC FLAVORS!
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-[#FFF8EA]/90 max-w-xl">
              Temukan kenikmatan ayam gunting dan kentang pilihan dengan berbagai
              varian rasa, topping khas Nusantara, dan harga yang ramah di
              kantong.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#menu"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#F4C343] text-[#42201D] hover:bg-[#f7cf63] font-bold text-sm sm:text-base shadow-sm transition-transform duration-150 hover:-translate-y-0.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>

              <a
                href="#menu"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg border border-[#FFF8EA]/40 text-[#FFF8EA] hover:bg-white/10 font-semibold text-sm sm:text-base transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4C343]"
              >
                Explore Our Menu
              </a>
            </div>

            <div className="pt-4 border-t border-white/15 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-[#FFF8EA]/80">
              <span>Ayam Gunting</span>
              <span aria-hidden="true" className="text-[#F4C343]">
                ·
              </span>
              <span>Kentang Goreng &amp; Spiral</span>
              <span aria-hidden="true" className="text-[#F4C343]">
                ·
              </span>
              <span>Topping Khas Nusantara</span>
            </div>
          </div>

          {/* Visual Showcase Column */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden bg-[#541412] shadow-xl aspect-[16/10] lg:aspect-[4/3]">
              <FoodImage
                src={HERO_IMAGE}
                alt="Hidangan RAKATA Chicken and Potato: ayam gunting renyah, kentang goreng, kentang spiral, nasi daun jeruk, dan saus keju serta sambal"
                className="w-full h-full object-cover"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#42201D]/60 via-transparent to-transparent"
                aria-hidden="true"
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs sm:text-sm text-[#FFF8EA]">
                <span className="font-semibold tracking-wide">
                  RAKATA – Chicken and Potato
                </span>
                <span className="font-semibold text-[#F4C343] tabular-nums">
                  Mulai Rp5.000
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
