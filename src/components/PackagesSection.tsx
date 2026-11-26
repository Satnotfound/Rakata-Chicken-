import { SPECIAL_PACKAGES } from '../data/menuData';
import type { PackageItem } from '../types/rakata';
import {
  FramedLabel,
  GoldenWaveDivider,
  NusantaraCloudsSvg,
} from './BrandElements';
import { PackageCard } from './PackageCard';

interface PackagesSectionProps {
  onOrderPackage: (pkg: PackageItem, potatoChoice?: string) => void;
}

export function PackagesSection({ onOrderPackage }: PackagesSectionProps) {
  return (
    <section
      id="packages"
      className="relative bg-[#8A1C05] text-[#FFFFFF] pt-16 sm:pt-20 overflow-hidden"
    >
      <div
        className="pointer-events-none absolute top-6 right-8 opacity-20 hidden sm:block"
        aria-hidden="true"
      >
        <NusantaraCloudsSvg className="w-44 h-36" strokeColor="#E3BD32" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="max-w-2xl mb-10 space-y-3">
          <div>
            <FramedLabel variant="gold">
              Special Packages · Free Bubuk Premium
            </FramedLabel>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            Special Deals, Better Meals!
          </h2>
          <p className="text-base text-[#FFFFFF]/90">
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

      <GoldenWaveDivider bottomColor="#FFFFFF" />
    </section>
  );
}
