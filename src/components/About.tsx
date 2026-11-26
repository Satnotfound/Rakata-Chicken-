import { Flame, Sparkles, Tag, UtensilsCrossed } from 'lucide-react';
import { ABOUT_IMAGE } from '../data/menuData';
import { FoodImage } from './FoodImage';

const HIGHLIGHTS = [
  {
    icon: Flame,
    title: 'Freshly Prepared',
    description:
      'Produk disiapkan untuk memberikan pengalaman menikmati makanan yang lezat.',
  },
  {
    icon: Tag,
    title: 'Affordable Price',
    description: 'Harga terjangkau dengan pilihan menu yang beragam.',
  },
  {
    icon: Sparkles,
    title: 'Various Flavor Options',
    description: 'Beragam pilihan topping dan saus sesuai selera pelanggan.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Nusantara Inspired',
    description:
      'Menghadirkan pilihan rasa khas Indonesia seperti rendang, sambal matah, dan sate maranggi.',
  },
];

export function About() {
  return (
    <section id="about" className="bg-[#FFF8EA] text-[#42201D] py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Image */}
          <div className="lg:col-span-5 flex">
            <div className="w-full rounded-2xl overflow-hidden bg-white shadow-md min-h-[280px] lg:min-h-full">
              <FoodImage
                src={ABOUT_IMAGE}
                alt="Penyajian ayam gunting, kentang goreng, dan aneka bumbu tabur khas Nusantara RAKATA"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Narrative & Highlights */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#781B19]">
                About Us · RAKATA
              </p>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#42201D] [text-wrap:balance]">
                Get to Know RAKATA
              </h2>
              <p className="text-base leading-relaxed text-[#42201D]/85">
                RAKATA merupakan UMKM kuliner yang menghadirkan pilihan makanan
                berbahan dasar ayam dan kentang dengan cita rasa lezat, praktis,
                dan terjangkau. Melalui berbagai pilihan topping khas Nusantara,
                varian rasa modern, serta saus favorit, RAKATA ingin memberikan
                pengalaman menikmati makanan yang menyenangkan bagi setiap
                pelanggan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {HIGHLIGHTS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="bg-white rounded-xl p-5 shadow-sm border border-[#42201D]/8"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-9 h-9 rounded-lg bg-[#FFF8EA] text-[#781B19] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </span>
                      <h3 className="font-display text-base font-bold text-[#42201D]">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-[#42201D]/80">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
