// API base URL - ready for backend integration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Authentication API functions
export const authAPI = {
  // Register a new user
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    return response.json();
  },

  // Login user
  login: async (credentials: {
    email: string;
    password: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    return response.json();
  },

  // Get user profile (requires authentication)
  getProfile: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get profile');
    }

    return response.json();
  },

  // Update user profile (requires authentication)
  updateProfile: async (token: string, profileData: any) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update profile');
    }

    return response.json();
  },

  // Add user address (requires authentication)
  addAddress: async (token: string, addressData: any) => {
    const response = await fetch(`${API_BASE_URL}/auth/address`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addressData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add address');
    }

    return response.json();
  },
};

// Product API functions
export const productAPI = {
  // Get all products with optional filters
  getProducts: async (filters?: {
    category?: string;
    priceRange?: [number, number];
    sizes?: string[];
    colors?: string[];
    inStock?: boolean;
    rating?: number;
    onSale?: boolean;
    search?: string;
  }) => {
    const params = new URLSearchParams();
    
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.inStock) params.append('inStock', 'true');
    if (filters?.onSale) params.append('onSale', 'true');
    if (filters?.rating) params.append('rating', filters.rating.toString());
    if (filters?.priceRange) {
      params.append('minPrice', filters.priceRange[0].toString());
      params.append('maxPrice', filters.priceRange[1].toString());
    }
    if (filters?.sizes?.length) params.append('sizes', filters.sizes.join(','));
    if (filters?.colors?.length) params.append('colors', filters.colors.join(','));

    const url = `${API_BASE_URL}/products${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch products');
    }

    return response.json();
  },

  // Get a single product by ID
  getProduct: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch product');
    }

    return response.json();
  },

  // Get featured products
  getFeaturedProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/products/featured`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch featured products');
    }

    return response.json();
  },

  // Get new products
  getNewProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/products/new`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch new products');
    }

    return response.json();
  },
};

// Review API functions
export const reviewAPI = {
  // Get all reviews for a product
  getReviews: async (productId: string) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch reviews');
    }

    return response.json();
  },

  // Add a review for a product
  addReview: async (productId: string, reviewData: { rating: number; comment: string }, token: string) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${productId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add review');
    }

    return response.json();
  },

  // Update a review
  updateReview: async (reviewId: string, reviewData: { rating: number; comment: string }, token: string) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update review');
    }

    return response.json();
  },

  // Delete a review
  deleteReview: async (reviewId: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete review');
    }

    return response.json();
  },

  // Get best reviews
  getBestReviews: async () => {
    const response = await fetch(`${API_BASE_URL}/reviews/best`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch best reviews');
    }

    return response.json();
  },

  // Subscribe to newsletter
  subscribeNewsletter: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/reviews/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to subscribe');
    }

    return response.json();
  },
};

// Legacy API functions - keeping for backward compatibility
export const api = {
  // Products - now using real API
  getProducts: async (filters?: any) => {
    return productAPI.getProducts(filters);
  },

  getProduct: async (id: string) => {
    return productAPI.getProduct(id);
  },

  // Blog
  getBlogPosts: async () => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/blog`);
    return new Promise(resolve => setTimeout(resolve, 400));
  },

  getBlogPost: async (id: string) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/blog/${id}`);
    console.log('Mock API: getBlogPost called with id:', id);
    return new Promise(resolve => setTimeout(resolve, 300));
  },

  // Reviews - now using real API
  getReviews: async (productId: string) => {
    return reviewAPI.getReviews(productId);
  },

  // Orders
  createOrder: async (orderData: any) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/orders`, { method: 'POST', ... });
    console.log('Mock API: createOrder called with orderData:', orderData);
    return new Promise(resolve => setTimeout(resolve, 500));
  },

  // Newsletter - now using real API
  subscribeNewsletter: async (email: string) => {
    return reviewAPI.subscribeNewsletter(email);
  },

  // Contact
  sendContactForm: async (formData: any) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/contact`, { method: 'POST', ... });
    console.log('Mock API: sendContactForm called with formData:', formData);
    return new Promise(resolve => setTimeout(resolve, 500));
  }
};