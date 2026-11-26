import { SPECIAL_PACKAGES } from '../data/menuData';
import type { PackageItem } from '../types/rakata';
import { PackageCard } from './PackageCard';

interface PackagesSectionProps {
  onOrderPackage: (pkg: PackageItem, potatoChoice?: string) => void;
}

export function PackagesSection({ onOrderPackage }: PackagesSectionProps) {
  return (
    <section
      id="packages"
      className="bg-[#781B19] text-white py-16 sm:py-20 border-y border-[#541412]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10 space-y-2">
          <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#F4C343]">
            Special Packages · Free Bubuk Premium
          </p>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            Special Deals, Better Meals!
          </h2>
          <p className="text-base text-[#FFF8EA]/90">
            Lebih hemat, lebih nikmat bersama paket spesial RAKATA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {SPECIAL_PACKAGES.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              onOrderPackage={onOrderPackage}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
