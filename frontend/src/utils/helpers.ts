import { SHIPPING_PRICE } from "../constant/contant";
import type { Product, FilterOptions } from "../types";

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

// Format date
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
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
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(func: T, wait: number): T => {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  }) as T;
};

// Filter products based on filters
export const filterProducts = (products: Product[], filters: FilterOptions): Product[] => {
  return products.filter((product) => {
    // Category filter
    if (filters.category && filters.category !== "All" && product.category !== filters.category) {
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
      if (!filters.sizes.some((size) => product.sizes!.includes(size))) {
        return false;
      }
    }

    // Color filter
    if (filters.colors && filters.colors.length > 0 && product.colors) {
      if (!filters.colors.some((color) => product.colors!.includes(color))) {
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
    case "price-low":
      return sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
    case "price-high":
      return sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
    case "name":
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    case "rating":
      return sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case "newest":
      // In a real app, you'd sort by created date
      return sortedProducts.reverse();
    case "featured":
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
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      (product.description && product.description.toLowerCase().includes(lowercaseQuery)) ||
      product.category.toLowerCase().includes(lowercaseQuery) ||
      (product.tags && product.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))) ||
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

  return "★".repeat(fullStars) + (hasHalfStar ? "☆" : "") + "☆".repeat(emptyStars);
};

// Calculate shipping cost (example logic)
export const calculateShipping = (subtotal: number): number => {
  if (subtotal >= 2000) return 0; // Free shipping over ₹2000
  return SHIPPING_PRICE; // Standard shipping cost
};

// Calculate tax (example logic)
export const calculateTax = (subtotal: number, state: string = "CA"): number => {
  const taxRates: { [key: string]: number } = {
    CA: 0.0875, // California
    NY: 0.08, // New York
    TX: 0.0625, // Texas
    FL: 0.06, // Florida
  };

  const rate = taxRates[state] || 0.05; // Default 5%
  return subtotal * rate;
};

// Get image URL with fallback
export const getImageUrl = (url: string, fallback: string = "/placeholder-product.jpg"): string => {
  return url || fallback;
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
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
      console.error("Error saving to localStorage:", error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  },
};

// Transform backend product to frontend format
export const transformProduct = (
  backendProduct: any,
  inventories?: any[],
  categories?: Array<{ _id: string; name: string }>
): Product => {
  // Extract sizes and colors from inventory
  let sizes: string[] = [];
  let colors: string[] = [];
  let productInventory: any[] = [];

  if (inventories && inventories.length > 0) {
    // Filter inventories for this product
    productInventory = inventories.filter((inv) => inv.product === backendProduct._id);

    // Extract unique sizes and colors
    const uniqueSizes = new Set<string>();
    const uniqueColors = new Set<string>();

    productInventory.forEach((inv) => {
      if (inv.size) {
        uniqueSizes.add(inv.size);
      }
      if (inv.color) {
        // Convert hex color to color name if possible
        if (inv.color.startsWith("#")) {
          try {
            // Enhanced hex to color name mapping
            const colorMap: { [key: string]: string } = {
              "#000000": "Black",
              "#FFFFFF": "White",
              "#FF0000": "Red",
              "#00FF00": "Green",
              "#0000FF": "Blue",
              "#FFFF00": "Yellow",
              "#FF00FF": "Magenta",
              "#00FFFF": "Cyan",
              "#808080": "Gray",
              "#C0C0C0": "Silver",
              "#800000": "Maroon",
              "#808000": "Olive",
              "#008000": "Green",
              "#800080": "Purple",
              "#008080": "Teal",
              "#000080": "Navy",
              "#219091": "Teal", // From the example data
              "#FFA500": "Orange",
              "#FFC0CB": "Pink",
              "#A52A2A": "Brown",
              "#FFD700": "Gold",
              "#FF6347": "Tomato",
              "#32CD32": "Lime Green",
              "#4169E1": "Royal Blue",
              "#8A2BE2": "Blue Violet",
              "#DC143C": "Crimson",
              "#00CED1": "Dark Turquoise",
              "#FF1493": "Deep Pink",
              "#228B22": "Forest Green",
              "#DAA520": "Goldenrod",
              "#FF69B4": "Hot Pink",
              "#4B0082": "Indigo",
              "#F0E68C": "Khaki",
              "#7CFC00": "Lawn Green",
              "#FF4500": "Orange Red",
              "#DA70D6": "Orchid",
              "#CD853F": "Peru",
              "#DDA0DD": "Plum",
              "#F5DEB3": "Wheat",
              "#FFB6C1": "Light Pink",
              "#87CEEB": "Sky Blue",
              "#98FB98": "Pale Green",
              "#FFA07A": "Light Salmon",
              "#20B2AA": "Light Sea Green",
              "#87CEFA": "Light Sky Blue",
              "#778899": "Light Slate Gray",
              "#B0C4DE": "Light Steel Blue",
              "#FFFFE0": "Light Yellow",
              "#EE82EE": "Violet",
            };
            const colorName = colorMap[inv.color.toUpperCase()] || inv.color;
            uniqueColors.add(colorName);
          } catch {
            uniqueColors.add(inv.color);
          }
        } else {
          uniqueColors.add(inv.color);
        }
      }
    });

    sizes = Array.from(uniqueSizes);
    colors = Array.from(uniqueColors);
  }

  // Map category ID to category name if categories are provided
  let categoryName = backendProduct.category;
  console.log("categories", categories);
  console.log("backendProduct.category", backendProduct.category);
  if (categories && backendProduct.category) {
    const category = categories.find((cat) => cat._id.toString() === backendProduct.category.toString());
    if (category) {
      categoryName = category.name;
    }
  }

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
    sizes: sizes, // Use extracted sizes from inventory
    colors: colors, // Use extracted colors from inventory
    inventory: productInventory, // Store actual inventory data for filtering
    category: backendProduct.category, // Keep original category ID for filtering
    categoryName: categoryName, // Add category name for display
  };
};

// Transform backend products array to frontend format
export const transformProducts = (
  backendProducts: any[],
  inventories?: any[],
  categories?: Array<{ _id: string; name: string }>
): Product[] => {
  return backendProducts.map((product) => transformProduct(product, inventories, categories));
};

// Color conversion utility
export const hexToColorName = (hex: string): string => {
  const colorMap: { [key: string]: string } = {
    "#000000": "Black",
    "#FFFFFF": "White",
    "#FF0000": "Red",
    "#00FF00": "Green",
    "#0000FF": "Blue",
    "#FFFF00": "Yellow",
    "#FF00FF": "Magenta",
    "#00FFFF": "Cyan",
    "#808080": "Gray",
    "#C0C0C0": "Silver",
    "#800000": "Maroon",
    "#808000": "Olive",
    "#008000": "Green",
    "#800080": "Purple",
    "#008080": "Teal",
    "#000080": "Navy",
    "#219091": "Teal",
    "#FFA500": "Orange",
    "#FFC0CB": "Pink",
    "#A52A2A": "Brown",
    "#FFD700": "Gold",
    "#FF6347": "Tomato",
    "#32CD32": "Lime Green",
    "#4169E1": "Royal Blue",
    "#8A2BE2": "Blue Violet",
    "#DC143C": "Crimson",
    "#00CED1": "Dark Turquoise",
    "#FF1493": "Deep Pink",
    "#228B22": "Forest Green",
    "#DAA520": "Goldenrod",
    "#FF69B4": "Hot Pink",
    "#4B0082": "Indigo",
    "#F0E68C": "Khaki",
    "#7CFC00": "Lawn Green",
    "#FF4500": "Orange Red",
    "#DA70D6": "Orchid",
    "#CD853F": "Peru",
    "#DDA0DD": "Plum",
    "#F5DEB3": "Wheat",
    "#FFB6C1": "Light Pink",
    "#87CEEB": "Sky Blue",
    "#98FB98": "Pale Green",
    "#FFA07A": "Light Salmon",
    "#20B2AA": "Light Sea Green",
    "#87CEFA": "Light Sky Blue",
    "#778899": "Light Slate Gray",
    "#B0C4DE": "Light Steel Blue",
    "#FFFFE0": "Light Yellow",
    "#EE82EE": "Violet",
    "#db0a3f": "Red",
  };
  return colorMap[hex.toUpperCase()] || hex;
};
