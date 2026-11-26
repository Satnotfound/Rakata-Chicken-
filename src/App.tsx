import { useEffect, useState } from 'react';
import { CheckCircle2, ShoppingBag, X } from 'lucide-react';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Menu } from './components/Menu';
import { Navbar } from './components/Navbar';
import { OwnerFinanceDashboard } from './components/OwnerFinanceDashboard';
import { PackagesSection } from './components/PackagesSection';
import { ShoppingCart } from './components/ShoppingCart';
import {
  ToppingSelector,
  type CustomizerTarget,
} from './components/ToppingSelector';
import { WhyChoose } from './components/WhyChoose';
import { CartProvider, useCart } from './context/CartContext';
import { FinanceProvider } from './context/FinanceContext';
import type { MenuProduct, PackageItem } from './types/rakata';

function RakataStorefront({
  onOpenOwnerPortal,
}: {
  onOpenOwnerPortal: () => void;
}) {
  const { addItem, lastAddedMessage, dismissToast, openCart } = useCart();
  const [customizerTarget, setCustomizerTarget] =
    useState<CustomizerTarget | null>(null);

  const handleAddProduct = (product: MenuProduct, selectedSizeId: string) => {
    if (product.customizable) {
      setCustomizerTarget({
        kind: 'product',
        product,
        initialSizeId: selectedSizeId,
      });
      return;
    }

    const chosenSize =
      product.sizes.find((s) => s.id === selectedSizeId) ?? product.sizes[0];

    addItem({
      kind: 'product',
      itemId: product.id,
      name: product.name,
      sizeLabel: chosenSize.label,
      toppingName: 'Tanpa Topping',
      sauceName: 'Tanpa Saus',
      basePrice: chosenSize.price,
      toppingPrice: 0,
      unitPrice: chosenSize.price,
      quantity: 1,
      image: product.image,
    });
  };

  const handleOrderPackage = (pkg: PackageItem, potatoChoice?: string) => {
    setCustomizerTarget({
      kind: 'package',
      pkg,
      initialPotatoChoice: potatoChoice,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#000000]">
      <Navbar />

      <main className="flex-1">
        <Hero />
        <About />
        <Menu onAddProduct={handleAddProduct} />
        <PackagesSection onOrderPackage={handleOrderPackage} />
        <WhyChoose />
        <Contact />
      </main>

      <Footer onOpenOwnerPortal={onOpenOwnerPortal} />

      <ToppingSelector
        target={customizerTarget}
        onClose={() => setCustomizerTarget(null)}
        onConfirm={(payload) => addItem(payload)}
      />

      <ShoppingCart />

      {/* Subtle Add-to-Cart Toast Feedback */}
      {lastAddedMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-40 max-w-sm bg-[#000000] text-[#FFFFFF] px-4 py-3 rounded-xl shadow-xl border border-[#E3BD32]/50 flex items-center gap-3"
        >
          <CheckCircle2
            className="w-5 h-5 text-[#E3BD32] shrink-0"
            aria-hidden="true"
          />
          <p className="text-xs sm:text-sm font-medium flex-1">
            {lastAddedMessage}
          </p>
          <button
            type="button"
            onClick={() => {
              dismissToast();
              openCart();
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#E3BD32] hover:brightness-95 text-[#000000] font-bold text-xs whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Cart</span>
          </button>
          <button
            type="button"
            onClick={dismissToast}
            aria-label="Tutup notifikasi"
            className="text-white/70 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [viewMode, setViewMode] = useState<'storefront' | 'owner'>(() => {
    if (typeof window === 'undefined') return 'storefront';
    return window.location.hash === '#owner' ? 'owner' : 'storefront';
  });

  useEffect(() => {
    const handleHashChange = () => {
      setViewMode(window.location.hash === '#owner' ? 'owner' : 'storefront');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openOwnerPortal = () => {
    window.location.hash = 'owner';
    setViewMode('owner');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const backToStorefront = () => {
    if (window.location.hash === '#owner') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    setViewMode('storefront');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <FinanceProvider>
      <CartProvider>
        {viewMode === 'owner' ? (
          <OwnerFinanceDashboard onBackToStorefront={backToStorefront} />
        ) : (
          <RakataStorefront onOpenOwnerPortal={openOwnerPortal} />
        )}
      </CartProvider>
    </FinanceProvider>
  );
}
