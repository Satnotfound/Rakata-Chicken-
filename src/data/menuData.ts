import type {
  MenuCategory,
  MenuProduct,
  PackageItem,
  SauceOption,
  ToppingOption,
} from '../types/rakata';

export const MENU_CATEGORIES: MenuCategory[] = [
  'All Menu',
  'Chicken',
  'Potato',
  'Rice',
];

export const MENU_PRODUCTS: MenuProduct[] = [
  {
    id: 'ayam-gunting',
    name: 'Ayam Gunting',
    category: 'Chicken',
    description:
      'Ayam gunting renyah dengan potongan praktis dan pilihan topping yang menggugah selera.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-26_at_14.46.21__1__6597f546.jpeg',
    imageFit: 'contain',
    customizable: true,
    sizes: [
      { id: 's', label: 'Small (S)', price: 10000 },
      { id: 'm', label: 'Medium (M)', price: 15000 },
      { id: 'l', label: 'Large (L)', price: 25000 },
    ],
  },
  {
    id: 'kentang-goreng',
    name: 'Kentang Goreng',
    category: 'Potato',
    description: 'Kentang goreng dengan tekstur renyah dan rasa gurih.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-26_at_14.46.21__2__eaef2cee.jpeg',
    imageFit: 'contain',
    customizable: true,
    sizes: [
      { id: 's', label: 'Small (S)', price: 10000 },
      { id: 'm', label: 'Medium (M)', price: 15000 },
      { id: 'l', label: 'Large (L)', price: 25000 },
    ],
  },
  {
    id: 'kentang-spiral',
    name: 'Kentang Spiral',
    category: 'Potato',
    description: 'Kentang spiral dengan bentuk unik dan tekstur renyah.',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-26_at_14.58.28_321165fa.jpeg',
    imageFit: 'contain',
    customizable: true,
    sizes: [{ id: 'reg', label: 'Regular', price: 15000 }],
  },
  {
    id: 'nasi-putih',
    name: 'Nasi Putih',
    category: 'Rice',
    description:
      'Nasi dengan pilihan rasa yang cocok dipadukan dengan ayam gunting.',
    image: '/assets/aistudio/_______________replica__________________________________________________________________________d52b03e5.jpeg',
    imageFit: 'cover',
    customizable: false,
    sizes: [{ id: 'std', label: 'Regular', price: 5000 }],
  },
  {
    id: 'nasi-daun-jeruk',
    name: 'Nasi Daun Jeruk',
    category: 'Rice',
    description:
      'Nasi dengan pilihan rasa yang cocok dipadukan dengan ayam gunting.',
    image: '/assets/aistudio/Thai_Green_Rice__an_original_Thai_Recipe_from_LinsFood_95df0048.jpeg',
    imageFit: 'cover',
    customizable: false,
    sizes: [{ id: 'std', label: 'Regular', price: 6000 }],
  },
];

export const TOPPING_OPTIONS: ToppingOption[] = [
  // A. Bubuk Tabur Khas Nusantara
  {
    id: 'rendang',
    name: 'Rendang',
    category: 'nusantara',
    categoryLabel: 'Bubuk Tabur Khas Nusantara',
    extraPrice: 0,
  },
  {
    id: 'sambel-matah',
    name: 'Sambel Matah',
    category: 'nusantara',
    categoryLabel: 'Bubuk Tabur Khas Nusantara',
    extraPrice: 0,
  },
  {
    id: 'sate-maranggi',
    name: 'Sate Maranggi',
    category: 'nusantara',
    categoryLabel: 'Bubuk Tabur Khas Nusantara',
    extraPrice: 0,
  },
  // B. Bubuk Tabur Reguler
  {
    id: 'barbeque',
    name: 'Barbeque',
    category: 'reguler',
    categoryLabel: 'Bubuk Tabur Reguler',
    extraPrice: 0,
  },
  {
    id: 'balado',
    name: 'Balado',
    category: 'reguler',
    categoryLabel: 'Bubuk Tabur Reguler',
    extraPrice: 0,
  },
  {
    id: 'keju-manis',
    name: 'Keju Manis',
    category: 'reguler',
    categoryLabel: 'Bubuk Tabur Reguler',
    extraPrice: 0,
  },
  // C. Bubuk Tabur Premium (+Rp2.000 on ala carte, free on packages)
  {
    id: 'seaweed',
    name: 'Seaweed',
    category: 'premium',
    categoryLabel: 'Bubuk Tabur Premium',
    extraPrice: 2000,
  },
  {
    id: 'honey-butter',
    name: 'Honey Butter',
    category: 'premium',
    categoryLabel: 'Bubuk Tabur Premium',
    extraPrice: 2000,
  },
  {
    id: 'sour-cream-onion',
    name: 'Sour Cream & Onion',
    category: 'premium',
    categoryLabel: 'Bubuk Tabur Premium',
    extraPrice: 2000,
  },
];

export const SAUCE_OPTIONS: SauceOption[] = [
  { id: 'hot-spicy', name: 'Hot and Spicy' },
  { id: 'bbq-sauce', name: 'Barbeque' },
  { id: 'cheese-sauce', name: 'Cheese Sauce' },
  { id: 'no-sauce', name: 'Tanpa Saus' },
];

const IMG_AYAM_GUNTING =
  '/assets/aistudio/WhatsApp_Image_2026-11-26_at_14.46.21__1__6597f546.jpeg';
const IMG_KENTANG_GORENG =
  '/assets/aistudio/WhatsApp_Image_2026-11-26_at_14.46.21__2__eaef2cee.jpeg';
const IMG_KENTANG_SPIRAL =
  '/assets/aistudio/WhatsApp_Image_2026-11-26_at_14.58.28_321165fa.jpeg';
const IMG_NASI_PUTIH =
  '/assets/aistudio/_______________replica__________________________________________________________________________d52b03e5.jpeg';
const IMG_MAGIC_WATER = '/assets/aistudio/___1__75102b9d.jpeg';

export const SPECIAL_PACKAGES: PackageItem[] = [
  {
    id: 'sks-1',
    code: 'SKS 1',
    fullName: 'Satu Kali Sikat 1',
    price: 20000,
    originalPrice: 22000,
    badge: 'BEST VALUE',
    contents: [
      '1x Ayam Gunting Small',
      '1x Kentang Goreng Small',
      'Free Bubuk Premium',
    ],
    image: IMG_AYAM_GUNTING,
    galleryImages: [
      { src: IMG_AYAM_GUNTING, alt: 'Ayam Gunting', fit: 'contain' },
    ],
  },
  {
    id: 'sks-2',
    code: 'SKS 2',
    fullName: 'Satu Kali Sikat 2',
    price: 28000,
    originalPrice: 31000,
    contents: [
      '1x Ayam Gunting Regular',
      '1x Kentang Spiral / Kentang Goreng Regular',
      'Free Bubuk Premium',
    ],
    potatoChoiceOptions: ['Kentang Spiral Regular', 'Kentang Goreng Regular'],
    image: IMG_AYAM_GUNTING,
    galleryImages: [
      { src: IMG_AYAM_GUNTING, alt: 'Ayam Gunting', fit: 'contain' },
      { src: IMG_KENTANG_SPIRAL, alt: 'Kentang Spiral', fit: 'contain' },
    ],
    galleryImagesByPotatoChoice: {
      'Kentang Spiral Regular': [
        { src: IMG_AYAM_GUNTING, alt: 'Ayam Gunting', fit: 'contain' },
        { src: IMG_KENTANG_SPIRAL, alt: 'Kentang Spiral', fit: 'contain' },
      ],
      'Kentang Goreng Regular': [
        { src: IMG_AYAM_GUNTING, alt: 'Ayam Gunting', fit: 'contain' },
        { src: IMG_KENTANG_GORENG, alt: 'Kentang Goreng', fit: 'contain' },
      ],
    },
  },
  {
    id: 'ukt-1',
    code: 'UKT 1',
    fullName: 'Udah Kenyang Total 1',
    price: 15000,
    originalPrice: 16000,
    contents: [
      '1x Ayam Gunting Small',
      '1x Nasi Putih',
      'Free Bubuk Premium',
    ],
    image: IMG_AYAM_GUNTING,
    galleryImages: [
      { src: IMG_NASI_PUTIH, alt: 'Nasi Putih', fit: 'cover' },
      { src: IMG_AYAM_GUNTING, alt: 'Ayam Gunting', fit: 'contain' },
    ],
  },
  {
    id: 'ukt-2',
    code: 'UKT 2',
    fullName: 'Udah Kenyang Total 2',
    price: 23000,
    originalPrice: 26000,
    contents: [
      '1x Ayam Gunting Regular',
      '1x Nasi Putih',
      '1x Magic Water',
      'Free Bubuk Premium',
    ],
    image: IMG_AYAM_GUNTING,
    galleryImages: [
      { src: IMG_AYAM_GUNTING, alt: 'Ayam Gunting', fit: 'contain' },
      { src: IMG_NASI_PUTIH, alt: 'Nasi Putih', fit: 'cover' },
      { src: IMG_MAGIC_WATER, alt: 'Magic Water', fit: 'contain' },
    ],
  },
];
