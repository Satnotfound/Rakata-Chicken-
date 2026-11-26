import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { RakataChickenLogo } from './RakataChickenLogo';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Menu', href: '#menu' },
  { label: 'Packages', href: '#packages' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  const { totalItems, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#000000]/95 backdrop-blur-md border-b border-white/15 text-[#FFFFFF]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand lockup with chicken emblem beside RAKATA wordmark */}
        <a
          href="#home"
          className="inline-flex items-center gap-2.5 font-display text-xl sm:text-2xl font-extrabold tracking-tight text-[#E3BD32] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3BD32] rounded"
        >
          <RakataChickenLogo className="w-10 h-7 sm:w-11 sm:h-8" />
          <span>RAKATA</span>
        </a>

        {/* Zone 2: Desktop Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#FFFFFF]/90"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="py-1 border-b-2 border-transparent hover:border-[#E3BD32] hover:text-[#E3BD32] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3BD32] rounded-xs"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Cart Action + Mobile Hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={openCart}
            aria-label={`Buka keranjang belanja, ${totalItems} item`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E3BD32] text-[#000000] hover:brightness-95 font-semibold text-sm transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Cart</span>
            <span
              className="tabular-nums font-bold px-1.5 py-0.5 rounded bg-[#8A1C05] text-[#FFFFFF] text-xs leading-none"
              data-testid="cart-badge-count"
            >
              {totalItems}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-[#FFFFFF] hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3BD32]"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden bg-[#000000] border-t border-white/15 px-4 py-3 space-y-1"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[#FFFFFF] hover:bg-[#8A1C05] hover:text-[#E3BD32] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
