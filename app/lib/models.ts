// MongoDB Collections Schema Definitions

export interface Product {
  _id?: string;
  id: string;
  name: string;
  category: string;
  price: number;
  size: string;
  stock: number;
  inStock: boolean;
  image?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DeliveryAddress {
  postcode: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county: string;
  country: string;
}

export type OrderStatus =
  | 'Pending Review'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface Order {
  _id?: string;
  orderId: string;
  invoiceNo: string;
  fullName: string;
  companyName?: string;
  email: string;
  mobile: string;
  deliveryAddress: DeliveryAddress;
  notes?: string;
  items: OrderItem[];
  totalItems: number;
  subtotal: number;
  vat: number;
  totalAmount: number;
  termsConfirmed: boolean;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface User {
  _id?: string;
  email: string;
  shopName: string;
  contactPerson: string;
  phoneNumber: string;
  deliveryAddress: string;
  postcode: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Cart {
  _id?: string;
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: Date;
}

export interface Review {
  _id?: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Wishlist {
  _id?: string;
  userId: string;
  productIds: string[];
  createdAt: Date;
  updatedAt: Date;
}
