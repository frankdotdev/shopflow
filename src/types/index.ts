export type ID = string;

export interface Category {
  id: ID;
  name: string;
  image: string;
  description: string;
}

export interface Specification {
  label: string;
  value: string;
}

export interface Product {
  id: ID;
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  discount?: number | null;
  currency: "NGN";
  rating: number;
  reviewCount: number;
  stock: number;
  brand: string;
  images: string[];
  colors: string[];
  sizes: string[];
  specifications: Specification[];
  tags: string[];
  isFeatured: boolean;
  isPopular: boolean;
  isNew: boolean;
  isBestSeller: boolean;
}

export interface CartItem {
  id: ID;
  productId: ID;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export type OrderStatus =
  | "Order Placed"
  | "Payment Confirmed"
  | "Processing"
  | "Packed"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export interface OrderItem {
  productId: ID;
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Order {
  id: ID;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  shippingMethod: string;
  address: Address;
  createdAt: string;
  courier: string;
  estimatedDelivery: string;
}

export interface Address {
  id: ID;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  label?: string;
  isDefault: boolean;
}

export interface WishlistItem {
  productId: ID;
}

export interface Review {
  id: ID;
  productId: ID;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AppNotification {
  id: ID;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  type: "order" | "promo" | "system";
}

export interface Filters {
  categories: string[];
  priceMin: number;
  priceMax: number;
  minRating: number;
  brands: string[];
  sizes: string[];
  colors: string[];
  inStockOnly: boolean;
  discountedOnly: boolean;
}

export type SortOption =
  | "recommended"
  | "newest"
  | "price_asc"
  | "price_desc"
  | "rating"
  | "popular";
