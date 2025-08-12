export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'buyer' | 'seller';
  createdAt: Date;
  subscription?: Subscription;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'monthly' | 'yearly';
  status: 'active' | 'inactive' | 'cancelled';
  startDate: Date;
  endDate: Date;
  price: number;
  stripeSubscriptionId?: string;
}

export interface Product {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: 'new' | 'used' | 'refurbished';
  images: string[];
  quantity: number;
  status: 'active' | 'sold' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'date-new' | 'date-old';
}