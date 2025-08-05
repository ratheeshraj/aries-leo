import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  cart: JSON.parse(localStorage.getItem('cart') || '{"items": [], "totalPrice": 0, "totalItems": 0}'),
  wishlist: JSON.parse(localStorage.getItem('wishlist') || '[]'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

// Define the context type
interface AppContextType {
  user: any;
  token: string | null;
  cart: any;
  wishlist: any[];
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (userData: any, token: string) => void;
  logout: () => void;
  updateUser: (userData: any) => void;
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (product: any) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string) => void;
  clearError: () => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_CART_ITEM: 'UPDATE_CART_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  ADD_TO_WISHLIST: 'ADD_TO_WISHLIST',
  REMOVE_FROM_WISHLIST: 'REMOVE_FROM_WISHLIST',
};

// Reducer function
const appReducer = (state: any, action: any) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    case ActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case ActionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case ActionTypes.UPDATE_USER:
      return { ...state, user: action.payload, loading: false };
    case ActionTypes.ADD_TO_CART: {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.cart.items.findIndex(
        (item: any) => item.product._id === product._id
      );

      let updatedItems;
      if (existingItemIndex >= 0) {
        // Update existing item
        updatedItems = [...state.cart.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
      } else {
        // Add new item
        updatedItems = [...state.cart.items, { product, quantity }];
      }

      // Calculate totals
      const totalItems = updatedItems.reduce(
        (total: number, item: any) => total + item.quantity,
        0
      );
      const totalPrice = updatedItems.reduce(
        (total: number, item: any) => {
          const p = item.product;
          const price = p.compareAtPrice ?? p.costPrice ?? p.price ?? 0;
          return total + price * item.quantity;
        },
        0
      );

      const updatedCart = { items: updatedItems, totalItems, totalPrice };
      return { ...state, cart: updatedCart };
    }
    case ActionTypes.REMOVE_FROM_CART: {
      const productId = action.payload;
      const updatedItems = state.cart.items.filter(
        (item: any) => item.product._id !== productId
      );

      // Calculate totals
      const totalItems = updatedItems.reduce(
        (total: number, item: any) => total + item.quantity,
        0
      );
      const totalPrice = updatedItems.reduce(
        (total: number, item: any) => {
          const p = item.product;
          const price = p.compareAtPrice ?? p.costPrice ?? p.price ?? 0;
          return total + price * item.quantity;
        },
        0
      );

      const updatedCart = { items: updatedItems, totalItems, totalPrice };
      return { ...state, cart: updatedCart };
    }
    case ActionTypes.UPDATE_CART_ITEM: {
      const { productId, quantity } = action.payload;
      const updatedItems = state.cart.items.map((item: any) =>
        item.product._id === productId ? { ...item, quantity } : item
      );

      // Calculate totals
      const totalItems = updatedItems.reduce(
        (total: number, item: any) => total + item.quantity,
        0
      );
      const totalPrice = updatedItems.reduce(
        (total: number, item: any) => {
          const p = item.product;
          const price = p.compareAtPrice ?? p.costPrice ?? p.price ?? 0;
          return total + price * item.quantity;
        },
        0
      );

      const updatedCart = { items: updatedItems, totalItems, totalPrice };
      return { ...state, cart: updatedCart };
    }
    case ActionTypes.CLEAR_CART:
      return { ...state, cart: { items: [], totalPrice: 0, totalItems: 0 } };
    case ActionTypes.ADD_TO_WISHLIST: {
      const product = action.payload;
      const productId = product.id || product._id;
      const isAlreadyInWishlist = state.wishlist.some((item: any) => 
        (item.product && (item.product.id === productId || item.product._id === productId)) ||
        (item.id === productId || item._id === productId)
      );
      if (isAlreadyInWishlist) return state;
      // Store in format expected by wishlist page: { product: {...} }
      return { ...state, wishlist: [...state.wishlist, { product }] };
    }
    case ActionTypes.REMOVE_FROM_WISHLIST: {
      const productId = action.payload;
      return { 
        ...state, 
        wishlist: state.wishlist.filter((item: any) => {
          const itemId = item.product ? (item.product.id || item.product._id) : (item.id || item._id);
          return itemId !== productId;
        })
      };
    }
    default:
      return state;
  }
};

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
  }, [state.wishlist]);

  // Save user info and token to localStorage whenever they change
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('user');
    }

    if (state.token) {
      localStorage.setItem('token', state.token);
    } else {
      localStorage.removeItem('token');
    }
  }, [state.user, state.token]);

  // Action creators
  const login = (userData: any, token: string) => {
    dispatch({
      type: ActionTypes.LOGIN_SUCCESS,
      payload: { user: userData, token },
    });
  };

  const logout = () => {
    dispatch({ type: ActionTypes.LOGOUT });
  };

  const updateUser = (userData: any) => {
    dispatch({
      type: ActionTypes.UPDATE_USER,
      payload: userData,
    });
  };

  const addToCart = (product: any, quantity: number = 1) => {
    dispatch({
      type: ActionTypes.ADD_TO_CART,
      payload: { product, quantity },
    });
  };

  const removeFromCart = (productId: string) => {
    dispatch({
      type: ActionTypes.REMOVE_FROM_CART,
      payload: productId,
    });
  };

  const updateCartItem = (productId: string, quantity: number) => {
    dispatch({
      type: ActionTypes.UPDATE_CART_ITEM,
      payload: { productId, quantity },
    });
  };

  const clearCart = () => {
    dispatch({ type: ActionTypes.CLEAR_CART });
  };

  const addToWishlist = (product: any) => {
    dispatch({ type: ActionTypes.ADD_TO_WISHLIST, payload: product });
  };

  const removeFromWishlist = (productId: string) => {
    dispatch({ type: ActionTypes.REMOVE_FROM_WISHLIST, payload: productId });
  };

  const isInWishlist = (productId: string) => {
    return state.wishlist.some((item: any) => {
      const itemId = item.product ? (item.product.id || item.product._id) : (item.id || item._id);
      return itemId === productId;
    });
  };

  const setLoading = (isLoading: boolean) => {
    dispatch({
      type: ActionTypes.SET_LOADING,
      payload: isLoading,
    });
  };

  const setError = (error: string) => {
    dispatch({
      type: ActionTypes.SET_ERROR,
      payload: error,
    });
  };

  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  };

  // Value object to be provided to consumers
  const value = {
    ...state,
    login,
    logout,
    updateUser,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    setLoading,
    setError,
    clearError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook for using the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext;