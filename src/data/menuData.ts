import type {
  MenuCategory,
  MenuProduct,
  PackageItem,
  SauceOption,
  ToppingOption,
} from '../types/rakata';

export const HERO_IMAGE = '/src/assets/images/hero_rakata_feast_1794546256853.jpg';
export const ABOUT_IMAGE = '/src/assets/images/about_rakata_kitchen_1794546257147.jpg';

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
    image: '/src/assets/images/menu_ayam_gunting_1794546258253.jpg',
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
    image: '/src/assets/images/menu_kentang_goreng_1794546257752.jpg',
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
    image: '/src/assets/images/menu_kentang_spiral_1794546258151.jpg',
    customizable: true,
    sizes: [{ id: 'reg', label: 'Regular', price: 15000 }],
  },
  {
    id: 'nasi-putih',
    name: 'Nasi Putih',
    category: 'Rice',
    description:
      'Nasi dengan pilihan rasa yang cocok dipadukan dengan ayam gunting.',
    image: '/src/assets/images/menu_nasi_daun_jeruk_1794546259143.jpg',
    customizable: false,
    sizes: [{ id: 'std', label: 'Regular', price: 5000 }],
  },
  {
    id: 'nasi-daun-jeruk',
    name: 'Nasi Daun Jeruk',
    category: 'Rice',
    description:
      'Nasi dengan pilihan rasa yang cocok dipadukan dengan ayam gunting.',
    image: '/src/assets/images/menu_nasi_daun_jeruk_1794546259143.jpg',
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
    image: '/src/assets/images/menu_ayam_gunting_1794546258253.jpg',
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
    image: '/src/assets/images/menu_kentang_spiral_1794546258151.jpg',
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
    image: '/src/assets/images/menu_nasi_daun_jeruk_1794546259143.jpg',
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
    image: '/src/assets/images/hero_rakata_feast_1794546256853.jpg',
  },
];
