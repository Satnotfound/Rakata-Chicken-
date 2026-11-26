// Replace with the official RAKATA Business WhatsApp number (international format without '+')
export const RAKATA_WHATSAPP_NUMBER = '6285771280997';

export const BRAND_CONTACT = {
  whatsappDisplay: '+62-85771280997',
  instagramHandle: '@rakata_chiken_potato',
  instagramUrl: 'https://www.instagram.com/rakata_chicken_potato/',
  location: 'Kantin Blok M lantai 4,Kantin Blok M Kampus, Universitas Negeri Jkt, Jalan Pemuda III No.2, RT.11/RW.14, Rawamangun, Kec. Pulo Gadung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13220',
  operatingHours: 'Senin – Sabtu, 09.00 – 18.00 WIB',
};

export function formatIDR(amount: number): string {
  return `Rp${amount.toLocaleString('id-ID')}`;
}

export const BANK_ACCOUNTS = [
  {
    id: 'bca',
    bankName: 'Bank BCA',
    accountNumber: '0123-4567-8901',
    rawNumber: '012345678901',
    accountHolder: 'RAKATA',
  },
  {
    id: 'mandiri',
    bankName: 'Bank Mandiri',
    accountNumber: '0123-4567-8901',
    rawNumber: '012345678901',
    accountHolder: 'RAKATA',
  },
] as const;

