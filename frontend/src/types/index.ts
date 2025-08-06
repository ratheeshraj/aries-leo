export interface Product {
  _id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  brand?: string;
  category: string;
  subcategory?: string;
  tags?: string[];
  productType?: string;
  vendor?: string;
  
  // Pricing
  costPrice?: number;
  retailPrice?: number;
  compareAtPrice?: number;
  salePrice?: number;
  
  // Images
  images: Array<{
    original: string;
    thumb: string;
    medium: string;
  }>;
  videos?: string[];
  
  // Product details
  material?: string;
  ageGroup?: string;
  condition?: string;
  originCountry?: string;
  manufacturer?: string;
  modelNumber?: string;
  
  // Status flags
  isActive: boolean;
  isVisible: boolean;
  isFeatured: boolean;
  status: 'draft' | 'active' | 'archived';
  isDeleted: boolean;
  
  // Shipping
  requiresShipping?: boolean;
  shippingClass?: string;
  taxable?: boolean;
  taxClass?: string;
  
  // Variants
  hasVariants?: boolean;
  
  // Dates
  launchDate?: string;
  discontinueDate?: string;
  
  // Business
  business: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  // Frontend computed properties (for compatibility)
  id?: string;
  price?: number;
  originalPrice?: number;
  sizes?: string[];
  colors?: string[];
  inStock?: boolean;
  stockCount?: number;
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  inventory?: Array<{
    _id: string;
    product: string;
    sku: string;
    barcode: string;
    stockQuantity: number;
    trackInventory: boolean;
    status: string;
    color?: string;
    size?: string;
    isActive: boolean;
    isDeleted: boolean;
    business: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }>;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface WishlistItem {
  product: Product;
  addedAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: Date;
  featuredImage: string;
  tags: string[];
  readTime: number;
}

export interface Testimonial {
  id: string;
  name: string;
  image: string;
  rating: number;
  comment: string;
  location: string;
}

export interface FilterOptions {
  category?: string;
  priceRange?: [number, number];
  sizes?: string[];
  colors?: string[];
  materials?: string[];
  inStock?: boolean;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface AppState {
  cart: CartItem[];
  wishlist: WishlistItem[];
  isLoading: boolean;
  error: string | null;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  trackingNumber?: string;
}

export interface Review {
  comment: string;
  user?: string;
  rating?: number;
  createdAt?: string;
}