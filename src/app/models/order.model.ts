import { User } from './user.model';
import { Product } from './product.model';

export interface Order {
  id: string; // UUID en el backend
  orderDate: Date;
  user?: User;
  latitude?: number;
  longitude?: number;
  deliveryMethod: DeliveryMethod;
  totalAmount: number;
  orderStatus: OrderStatus;
  orderItems: OrderItem[];
  discount?: Discount;
  payment?: Payment;
  deliveryPerson?: DeliveryPerson;
  delivery?: Delivery;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItem {
  id?: string;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Discount {
  id: string;
  code: string;
  name: string;
  description?: string;
  discountPercentage: number;
  isActive: boolean;
}

export interface Payment {
  id: string;
  paymentMethod: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  transactionId?: string;
}

export interface DeliveryPerson {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  vehicleType: string;
  licenseNumber: string;
}

export interface Delivery {
  id: string;
  deliveryPerson: DeliveryPerson;
  estimatedTime: number; // en minutos
  deliveryStatus: DeliveryStatus;
  trackingCode: string;
}

// Enums
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum DeliveryMethod {
  HOME_DELIVERY = 'HOME_DELIVERY',
  PICKUP = 'PICKUP'
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  DIGITAL_WALLET = 'DIGITAL_WALLET',
  PAYPAL = 'PAYPAL'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum DeliveryStatus {
  PREPARING = 'PREPARING',
  ON_THE_WAY = 'ON_THE_WAY',
  DELIVERED = 'DELIVERED'
}

// DTOs para requests
export interface OrderRequest {
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  orderItems: OrderItemRequest[];
  discountCode?: string;
  deliveryAddress?: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    street: string;
    references?: string;
    district: string;
    province: string;
    department: string;
  };
  latitude?: number;
  longitude?: number;
}

export interface OrderItemRequest {
  productId: string;
  quantity: number;
}
