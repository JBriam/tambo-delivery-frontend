export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: ProductCategory;
  stock: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCategory {
  id: number;
  name: string;
  description?: string;
}

export interface CartItem {
  id?: number;
  product: Product;
  quantity: number;
  subtotal: number;
}
