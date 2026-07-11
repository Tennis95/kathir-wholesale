export interface Product {
  _id?: string;
  id: string;
  name: string;
  category: string;
  size: string;
  price: number;
  stock: number;
  description?: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type {
  DeliveryAddress,
  Order,
  OrderItem,
  OrderStatus,
} from '@/app/lib/models';
