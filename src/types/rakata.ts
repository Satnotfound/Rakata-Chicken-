export type MenuCategory = 'All Menu' | 'Chicken' | 'Potato' | 'Rice';

export type ProductSizeOption = {
  id: string;
  label: string;
  price: number;
};

export type MenuProduct = {
  id: string;
  name: string;
  category: Exclude<MenuCategory, 'All Menu'>;
  description: string;
  image: string;
  sizes: ProductSizeOption[];
  customizable: boolean;
};

export type ToppingCategory = 'nusantara' | 'reguler' | 'premium';

export type ToppingOption = {
  id: string;
  name: string;
  category: ToppingCategory;
  categoryLabel: string;
  extraPrice: number;
};

export type SauceOption = {
  id: string;
  name: string;
};

export type PackageItem = {
  id: string;
  code: string;
  fullName: string;
  price: number;
  originalPrice: number;
  badge?: string;
  contents: string[];
  potatoChoiceOptions?: string[];
  image: string;
};

export type CartItem = {
  cartItemId: string;
  kind: 'product' | 'package';
  itemId: string;
  name: string;
  sizeLabel: string;
  toppingName: string;
  toppingCategoryLabel?: string;
  sauceName: string;
  potatoChoice?: string;
  basePrice: number;
  toppingPrice: number;
  unitPrice: number;
  quantity: number;
  image: string;
};
