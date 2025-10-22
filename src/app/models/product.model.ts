import { Category, CategoryType } from './category.model';
import { Brand } from './brand.model';

export interface Product {
  id: string; // UUID en el backend
  slug: string;
  name: string;
  description: string;
  price: number; // BigDecimal del backend
  discountPercentage?: number;
  discountedPrice?: number;
  stock: number;
  thumbnail?: string;
  rating?: number;
  isNewArrival?: boolean;
  isActive: boolean;
  brand: Brand;
  category: Category;
  categoryType: CategoryType;
  createdAt?: Date;
  updatedAt?: Date;
}

// Para el carrito de compras
export interface CartItem {
  id?: string;
  product: Product;
  quantity: number;
  subtotal: number;
}

// Para filtros de productos
export interface ProductFilter {
  categoryId?: string;
  typeId?: string;
  slug?: string;
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  newArrival?: boolean;
}
