import { Clock, Instagram, MapPin, MessageCircle, Phone } from 'lucide-react';
import { BRAND_CONTACT, RAKATA_WHATSAPP_NUMBER } from '../config/brand';

export function Contact() {
  const directWhatsappUrl = `https://wa.me/${RAKATA_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'Halo RAKATA! Saya ingin bertanya tentang menu dan pemesanan.'
  )}`;

  const contactItems = [
    {
      icon: Phone,
      label: 'WhatsApp Business',
      value: BRAND_CONTACT.whatsappDisplay,
    },
    {
      icon: Instagram,
      label: 'Instagram',
      value: BRAND_CONTACT.instagramHandle,
    },
    {
      icon: MapPin,
      label: 'Business Location',
      value: BRAND_CONTACT.location,
    },
    {
      icon: Clock,
      label: 'Operating Hours',
      value: BRAND_CONTACT.operatingHours,
    },
  ];

  return (
    <section id="contact" className="bg-black/[0.03] text-[#000000] py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-10 shadow-sm border border-black/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#8A1C05]">
              Contact Us
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#000000] [text-wrap:balance]">
              Let&apos;s Connect with RAKATA!
            </h2>
            <p className="text-base leading-relaxed text-[#000000]/75">
              Have questions or want to place an order? Get in touch with us!
            </p>

            <div className="pt-2">
              <a
                href={directWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#8A1C05] hover:bg-[#000000] text-[#FFFFFF] font-bold text-sm transition-colors"
              >
                <MessageCircle
                  className="w-4 h-4 text-[#E3BD32]"
                  aria-hidden="true"
                />
                <span>Chat via WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contactItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="bg-black/[0.03] rounded-xl p-5 border border-black/10"
                >
                  <div className="flex items-center gap-2.5 text-[#8A1C05] mb-2">
                    <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {item.label}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#000000] leading-relaxed">
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
