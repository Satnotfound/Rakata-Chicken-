import { ChefHat, Coins, Layers, Users } from 'lucide-react';

const BENEFITS = [
  {
    icon: ChefHat,
    title: 'Delicious & Crispy',
    description: 'Enjoy crispy chicken and potatoes.',
  },
  {
    icon: Coins,
    title: 'Affordable',
    description: 'Delicious meals at accessible prices.',
  },
  {
    icon: Layers,
    title: 'Flavor Variety',
    description: 'Choose from Indonesian and modern flavors.',
  },
  {
    icon: Users,
    title: 'Perfect for Every Moment',
    description: 'Suitable for snacks, lunch, and sharing.',
  },
];

export function WhyChoose() {
  return (
    <section className="bg-[#FFFFFF] text-[#000000] py-16 sm:py-20 border-b border-black/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#8A1C05] mb-2">
            Our Promise
          </p>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#000000]">
            Why RAKATA?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="bg-black/[0.03] rounded-2xl p-6 border border-black/10 transition-transform duration-150 hover:-translate-y-0.5"
              >
                <div className="w-11 h-11 rounded-xl bg-[#8A1C05] text-[#E3BD32] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#000000] mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#000000]/75">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
