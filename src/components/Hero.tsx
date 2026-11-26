import { ArrowRight } from 'lucide-react';
import {
  FramedLabel,
  GoldenWaveDivider,
  NusantaraCloudsSvg,
} from './BrandElements';

export function Hero() {
  return (
    <section
      id="home"
      className="relative bg-[#8A1C05] text-[#FFFFFF] overflow-hidden"
    >
      {/* Subtle Nusantara golden line-art clouds ornament */}
      <div
        className="pointer-events-none absolute -top-4 right-4 sm:right-12 opacity-20 lg:opacity-25"
        aria-hidden="true"
      >
        <NusantaraCloudsSvg
          className="w-40 h-32 sm:w-56 sm:h-44"
          strokeColor="#E3BD32"
        />
      </div>

      {/* Subtle golden wave corner accent on bottom-left */}
      <svg
        viewBox="0 0 260 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="pointer-events-none absolute bottom-10 left-0 w-44 sm:w-64 opacity-15"
        aria-hidden="true"
      >
        <path
          d="M0 10 C40 90 150 65 230 180 L0 180 Z"
          fill="#E3BD32"
        />
      </svg>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 lg:pt-16 pb-10 sm:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Copy Column */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <FramedLabel variant="gold">GOOD FOOD, GREAT MOOD!</FramedLabel>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-[3.1rem] font-extrabold leading-[1.12] tracking-tight text-[#FFFFFF] [text-wrap:balance]">
              CRISPY BITES, AUTHENTIC FLAVORS!
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-[#FFFFFF]/90 max-w-xl">
              Temukan kenikmatan ayam gunting dan kentang pilihan dengan berbagai
              varian rasa, topping khas Nusantara, dan harga yang ramah di
              kantong.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <a
                href="#menu"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#E3BD32] text-[#000000] hover:brightness-95 font-bold text-sm sm:text-base shadow-sm transition-all duration-150 hover:-translate-y-0.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>

              <a
                href="#menu"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg border border-white/50 text-[#FFFFFF] hover:bg-white/10 font-semibold text-sm sm:text-base transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3BD32]"
              >
                Explore Our Menu
              </a>
            </div>

            <div className="pt-3 border-t border-white/20 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-[#FFFFFF]/85">
              <span>Ayam Gunting</span>
              <span aria-hidden="true" className="text-[#E3BD32]">
                ·
              </span>
              <span>Kentang Goreng &amp; Spiral</span>
              <span aria-hidden="true" className="text-[#E3BD32]">
                ·
              </span>
              <span>Topping Khas Nusantara</span>
            </div>
          </div>

          {/* Brand Tagline Feature Card matching the RAKATA Brand Guide */}
          <div className="lg:col-span-5">
            <div className="relative bg-[#E3BD32] text-[#8A1C05] rounded-2xl p-6 sm:p-8 shadow-xl overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-[#000000]/80">
                    RAKATA
                  </span>
                  <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded bg-[#000000] text-[#FFFFFF] tabular-nums">
                    Mulai Rp5.000
                  </span>
                </div>

                <p className="font-display text-2xl sm:text-3xl font-black tracking-tight uppercase leading-[1.12] text-[#8A1C05]">
                  SAATNYA UNTUK LEDAKAN RASA!
                </p>

                <div className="pt-3 border-t border-[#8A1C05]/20 flex items-center justify-between gap-4">
                  <p className="text-xs sm:text-sm font-semibold text-[#000000]/85 leading-snug">
                    Ayam gunting renyah, kentang pilihan, dan bumbu tabur khas
                    Nusantara.
                  </p>
                  <NusantaraCloudsSvg
                    className="w-20 h-14 shrink-0 opacity-85"
                    strokeColor="#8A1C05"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Golden Rolling Wave Divider transitioning directly into About Us */}
      <GoldenWaveDivider bottomColor="#FFFFFF" />
    </section>
  );
}
