import type { ContactFormData, ContactSubmission, TeamMember } from '../types';

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

  // Delete user address (requires authentication)
  deleteAddress: async (token: string, addressId: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/address/${addressId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete address');
    }

    return response.json();
  },
};

// Product API functions
export const productAPI = {
  // Get all products with optional filters
  getProducts: async (filters?: {
    category?: string | string[];
    priceRange?: [number, number];
    sizes?: string[];
    colors?: string[];
    inStock?: boolean;
    rating?: number;
    onSale?: boolean;
    featured?: boolean;
    newArrivals?: boolean;
    search?: string;
    material?: string[];
    brand?: string[];
    gender?: string[];
    status?: string[];
  }) => {
    const params = new URLSearchParams();
    
    // Handle category - can be string or array
    if (filters?.category) {
      if (Array.isArray(filters.category)) {
        if (filters.category.length > 0) {
          params.append('category', filters.category.join(','));
        }
      } else {
        params.append('category', filters.category);
      }
    }
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.inStock) params.append('inStock', 'true');
    if (filters?.onSale) params.append('onSale', 'true');
    if (filters?.featured) params.append('featured', 'true');
    if (filters?.newArrivals) params.append('newArrivals', 'true');
    if (filters?.rating) params.append('rating', filters.rating.toString());
    if (filters?.priceRange) {
      params.append('minPrice', filters.priceRange[0].toString());
      params.append('maxPrice', filters.priceRange[1].toString());
    }
    if (filters?.sizes?.length) params.append('sizes', filters.sizes.join(','));
    if (filters?.colors?.length) params.append('colors', filters.colors.join(','));
    if (filters?.material?.length) params.append('material', filters.material.join(','));
    if (filters?.brand?.length) params.append('brand', filters.brand.join(','));
    if (filters?.gender?.length) params.append('gender', filters.gender.join(','));
    if (filters?.status?.length) params.append('status', filters.status.join(','));

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

// Order API functions
export const orderAPI = {
  // Create a new order
  createOrder: async (orderData: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create order');
    }

    return response.json();
  },

  // Get user's orders
  getMyOrders: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/myorders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch orders');
    }

    return response.json();
  },

  // Get order by ID
  getOrderById: async (orderId: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch order');
    }

    return response.json();
  },
};

// Contact API functions
export const contactAPI = {
  // Submit a contact form
  submitContactForm: async (formData: ContactFormData) => {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit contact form');
    }

    return response.json();
  },

  // Get all contact submissions (admin only)
  getAllContacts: async (token: string): Promise<{ success: boolean; count: number; contacts: ContactSubmission[] }> => {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch contacts');
    }

    return response.json();
  },

  // Get a single contact submission by ID (admin only)
  getContactById: async (contactId: string, token: string): Promise<{ success: boolean; contact: ContactSubmission }> => {
    const response = await fetch(`${API_BASE_URL}/contact/${contactId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch contact');
    }

    return response.json();
  },

  // Update contact status (admin only)
  updateContactStatus: async (contactId: string, status: ContactSubmission['status'], token: string): Promise<{ success: boolean; message: string; contact: ContactSubmission }> => {
    const response = await fetch(`${API_BASE_URL}/contact/${contactId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update contact status');
    }

    return response.json();
  },

  // Delete a contact submission (admin only)
  deleteContact: async (contactId: string, token: string): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`${API_BASE_URL}/contact/${contactId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete contact');
    }

    return response.json();
  },
};

// Team API functions
export const teamAPI = {
  // Get team members from Airtable
  getTeamMembers: async (): Promise<{ success: boolean; data: TeamMember[] }> => {
    const response = await fetch(`${API_BASE_URL}/airTable/getTeamMembers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch team members');
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

  // Orders - now using real API
  createOrder: async (orderData: any, token?: string) => {
    if (!token) {
      throw new Error('Authentication token required');
    }
    return orderAPI.createOrder(orderData, token);
  },

  // Newsletter - now using real API
  subscribeNewsletter: async (email: string) => {
    return reviewAPI.subscribeNewsletter(email);
  },

  // Contact
  sendContactForm: async (formData: any) => {
    return contactAPI.submitContactForm(formData);
  }
};