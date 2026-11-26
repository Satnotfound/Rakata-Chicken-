import { Flame, Sparkles, Tag, UtensilsCrossed } from 'lucide-react';
import { FramedLabel, NusantaraCloudsSvg } from './BrandElements';

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
    <section
      id="about"
      className="relative bg-[#FFFFFF] text-[#000000] py-14 sm:py-20 overflow-hidden"
    >
      <div
        className="pointer-events-none absolute top-6 right-6 opacity-40 hidden md:block"
        aria-hidden="true"
      >
        <NusantaraCloudsSvg className="w-36 h-28" strokeColor="#E3BD32" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Direct About Us Narrative */}
        <div className="max-w-3xl space-y-3">
          <div>
            <FramedLabel variant="maroon">About Us · RAKATA</FramedLabel>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#000000] [text-wrap:balance]">
            Get to Know RAKATA
          </h2>
          <p className="text-base leading-relaxed text-[#000000]/80">
            RAKATA merupakan UMKM kuliner yang menghadirkan pilihan makanan
            berbahan dasar ayam dan kentang dengan cita rasa lezat, praktis, dan
            terjangkau. Melalui berbagai pilihan topping khas Nusantara, varian
            rasa modern, serta saus favorit, RAKATA ingin memberikan pengalaman
            menikmati makanan yang menyenangkan bagi setiap pelanggan.
          </p>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HIGHLIGHTS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-black/[0.03] rounded-xl p-5 border border-black/10"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-9 h-9 rounded-lg bg-[#8A1C05] text-[#E3BD32] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-base font-bold text-[#000000]">
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-[#000000]/75">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
