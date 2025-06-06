// API base URL - ready for backend integration
export const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3001/api';

// Mock API functions - ready to be replaced with real API calls
export const api = {
  // Products
  getProducts: async (filters?: any) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/products`, { ... });
    console.log('Mock API: getProducts called with filters:', filters);
    return new Promise(resolve => setTimeout(resolve, 500));
  },

  getProduct: async (id: string) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/products/${id}`);
    console.log('Mock API: getProduct called with id:', id);
    return new Promise(resolve => setTimeout(resolve, 300));
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

  // Reviews
  getReviews: async (productId: string) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/products/${productId}/reviews`);
    console.log('Mock API: getReviews called with productId:', productId);
    return new Promise(resolve => setTimeout(resolve, 300));
  },

  // Orders
  createOrder: async (orderData: any) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/orders`, { method: 'POST', ... });
    console.log('Mock API: createOrder called with orderData:', orderData);
    return new Promise(resolve => setTimeout(resolve, 500));
  },

  // Newsletter
  subscribeNewsletter: async (email: string) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/newsletter/subscribe`, { method: 'POST', ... });
    console.log('Mock API: subscribeNewsletter called with email:', email);
    return new Promise(resolve => setTimeout(resolve, 300));
  },

  // Contact
  sendContactForm: async (formData: any) => {
    // TODO: Replace with actual API call
    // return fetch(`${API_BASE_URL}/contact`, { method: 'POST', ... });
    console.log('Mock API: sendContactForm called with formData:', formData);
    return new Promise(resolve => setTimeout(resolve, 500));
  }
};