import { BookOpen, Instagram, MessageCircle } from 'lucide-react';
import { BRAND_CONTACT, RAKATA_WHATSAPP_NUMBER } from '../config/brand';
import { RakataChickenLogo } from './RakataChickenLogo';

const FOOTER_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Our Menu', href: '#menu' },
  { label: 'Special Packages', href: '#packages' },
  { label: 'Contact', href: '#contact' },
];

interface FooterProps {
  onOpenOwnerPortal: () => void;
}

export function Footer({ onOpenOwnerPortal }: FooterProps) {
  const whatsappUrl = `https://wa.me/${RAKATA_WHATSAPP_NUMBER}`;

  return (
    <footer className="bg-[#000000] text-[#FFFFFF] border-t-4 border-[#8A1C05]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pb-10 border-b border-white/15">
          {/* Brand Summary */}
          <div className="md:col-span-5 space-y-2.5">
            <div className="flex items-center gap-3">
              <RakataChickenLogo className="w-11 h-8" />
              <h2 className="font-display text-xl font-extrabold text-[#E3BD32]">
                RAKATA – Chicken and Potato
              </h2>
            </div>
            <p className="text-sm font-semibold text-[#FFFFFF]/90">
              Good Food, Great Mood!
            </p>
            <p className="text-sm text-[#FFFFFF]/75 max-w-sm leading-relaxed pt-1">
              Ayam gunting dan kentang pilihan dengan bumbu tabur khas Nusantara
              dan saus favorit.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#E3BD32] mb-3">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[#FFFFFF]/85 hover:text-[#E3BD32] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Owner Tools */}
          <div className="md:col-span-3 space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#E3BD32] mb-3">
                Social Media
              </h3>
              <div className="flex flex-col gap-2.5 text-sm">
                <a
                  href={BRAND_CONTACT.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#FFFFFF]/85 hover:text-[#E3BD32] transition-colors"
                >
                  <Instagram className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Instagram ({BRAND_CONTACT.instagramHandle})</span>
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#FFFFFF]/85 hover:text-[#E3BD32] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#E3BD32] mb-2">
                Business Owner
              </h3>
              <button
                type="button"
                onClick={onOpenOwnerPortal}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#8A1C05] hover:bg-[#E3BD32] text-[#FFFFFF] hover:text-[#000000] text-xs font-bold transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Pembukuan Keuangan</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FFFFFF]/70">
          <p>© 2026 RAKATA. All Rights Reserved.</p>
          <p>Chicken &amp; Potato · Nusantara Flavors</p>
        </div>
      </div>
    </footer>
  );
}
