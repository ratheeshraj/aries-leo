import type { Product, FilterOptions } from '../types';

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

// Format date
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

// Calculate discount percentage
export const calculateDiscount = (originalPrice: number, currentPrice: number): number => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

// Generate slug from string
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T => {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  }) as T;
};

// Filter products based on filters
export const filterProducts = (products: Product[], filters: FilterOptions): Product[] => {
  return products.filter(product => {
    // Category filter
    if (filters.category && filters.category !== 'All' && product.category !== filters.category) {
      return false;
    }

    // Price range filter
    if (filters.priceRange && product.price) {
      const [min, max] = filters.priceRange;
      if (product.price < min || product.price > max) {
        return false;
      }
    }

    // Size filter
    if (filters.sizes && filters.sizes.length > 0 && product.sizes) {
      if (!filters.sizes.some(size => product.sizes!.includes(size))) {
        return false;
      }
    }

    // Color filter
    if (filters.colors && filters.colors.length > 0 && product.colors) {
      if (!filters.colors.some(color => product.colors!.includes(color))) {
        return false;
      }
    }

    // Material filter
    if (filters.materials && filters.materials.length > 0 && product.material) {
      if (!filters.materials.includes(product.material)) {
        return false;
      }
    }

    // In stock filter
    if (filters.inStock !== undefined && product.inStock !== filters.inStock) {
      return false;
    }

    return true;
  });
};

// Sort products based on sort option
export const sortProducts = (products: Product[], sortBy: string): Product[] => {
  const sortedProducts = [...products];

  switch (sortBy) {
    case 'price-low':
      return sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
    case 'price-high':
      return sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
    case 'name':
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    case 'rating':
      return sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'newest':
      // In a real app, you'd sort by created date
      return sortedProducts.reverse();
    case 'featured':
    default:
      return sortedProducts.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }
};

// Search products
export const searchProducts = (products: Product[], query: string): Product[] => {
  if (!query.trim()) return products;

  const lowercaseQuery = query.toLowerCase();
  return products.filter(product =>
    product.name.toLowerCase().includes(lowercaseQuery) ||
    (product.description && product.description.toLowerCase().includes(lowercaseQuery)) ||
    product.category.toLowerCase().includes(lowercaseQuery) ||
    (product.tags && product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))) ||
    (product.material && product.material.toLowerCase().includes(lowercaseQuery))
  );
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate star rating display
export const generateStarRating = (rating: number): string => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(emptyStars);
};

// Calculate shipping cost (example logic)
export const calculateShipping = (subtotal: number, country: string = 'IN'): number => {
  if (subtotal >= 2000) return 0; // Free shipping over ₹2000
  return 199; // Standard shipping cost
};

// Calculate tax (example logic)
export const calculateTax = (subtotal: number, state: string = 'CA'): number => {
  const taxRates: { [key: string]: number } = {
    'CA': 0.0875, // California
    'NY': 0.08,   // New York
    'TX': 0.0625, // Texas
    'FL': 0.06,   // Florida
  };
  
  const rate = taxRates[state] || 0.05; // Default 5%
  return subtotal * rate;
};

// Get image URL with fallback
export const getImageUrl = (url: string, fallback: string = '/placeholder-product.jpg'): string => {
  return url || fallback;
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

// Local storage helpers
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

// Transform backend product to frontend format
export const transformProduct = (backendProduct: any): Product => {
  return {
    ...backendProduct,
    id: backendProduct._id, // Add id for compatibility
    price: backendProduct.salePrice || backendProduct.retailPrice || 0,
    originalPrice: backendProduct.compareAtPrice || backendProduct.retailPrice,
    featured: backendProduct.isFeatured,
    inStock: true, // Default to true since backend doesn't have this field
    stockCount: 0, // Default since backend doesn't have this field
    rating: 0, // Default since backend doesn't have this field
    reviewCount: 0, // Default since backend doesn't have this field
    sizes: [], // Default since backend doesn't have this field
    colors: [], // Default since backend doesn't have this field
  };
};

// Transform backend products array to frontend format
export const transformProducts = (backendProducts: any[]): Product[] => {
  return backendProducts.map(transformProduct);
};