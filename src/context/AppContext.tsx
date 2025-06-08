import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AppState, CartItem, WishlistItem, Product } from '../types';

interface AppContextType extends AppState {
  addToCart: (product: Product, quantity: number, size: string, color: string) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateCartQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number; size: string; color: string } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string; size: string; color: string } }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; size: string; color: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_TO_WISHLIST'; payload: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_PERSISTED_STATE'; payload: { cart: CartItem[]; wishlist: WishlistItem[] } };

const initialState: AppState = {
  cart: [],
  wishlist: [],
  isLoading: false,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity, size, color } = action.payload;
      const existingItemIndex = state.cart.findIndex(
        item => item.product.id === product.id && 
                item.selectedSize === size && 
                item.selectedColor === color
      );

      if (existingItemIndex >= 0) {
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex].quantity += quantity;
        return { ...state, cart: updatedCart };
      } else {
        return {
          ...state,
          cart: [...state.cart, { product, quantity, selectedSize: size, selectedColor: color }]
        };
      }
    }

    case 'REMOVE_FROM_CART': {
      const { productId, size, color } = action.payload;
      return {
        ...state,
        cart: state.cart.filter(
          item => !(item.product.id === productId && 
                   item.selectedSize === size && 
                   item.selectedColor === color)
        )
      };
    }

    case 'UPDATE_CART_QUANTITY': {
      const { productId, size, color, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter(
            item => !(item.product.id === productId && 
                     item.selectedSize === size && 
                     item.selectedColor === color)
          )
        };
      }

      const updatedCart = state.cart.map(item =>
        item.product.id === productId && 
        item.selectedSize === size && 
        item.selectedColor === color
          ? { ...item, quantity }
          : item
      );
      return { ...state, cart: updatedCart };
    }

    case 'CLEAR_CART':
      return { ...state, cart: [] };

    case 'ADD_TO_WISHLIST': {
      console.log('[DEBUG] Reducer ADD_TO_WISHLIST:', action.payload.name, action.payload.id);
      const isAlreadyInWishlist = state.wishlist.some(item => item.product.id === action.payload.id);
      console.log('[DEBUG] Already in wishlist?', isAlreadyInWishlist);
      if (isAlreadyInWishlist) return state;
      
      const newState = {
        ...state,
        wishlist: [...state.wishlist, { product: action.payload, addedAt: new Date() }]
      };
      console.log('[DEBUG] New wishlist state:', newState.wishlist.length, 'items');
      return newState;
    }

    case 'REMOVE_FROM_WISHLIST':
      console.log('[DEBUG] Reducer REMOVE_FROM_WISHLIST:', action.payload);
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.product.id !== action.payload)
      };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'LOAD_PERSISTED_STATE':
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Persist cart and wishlist to localStorage
  useEffect(() => {
    console.log('[DEBUG] Loading persisted state from localStorage');
    const savedCart = localStorage.getItem('aries_leo_cart');
    const savedWishlist = localStorage.getItem('aries_leo_wishlist');

    console.log('[DEBUG] Saved cart:', savedCart);
    console.log('[DEBUG] Saved wishlist:', savedWishlist);

    if (savedCart || savedWishlist) {
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];
      const parsedWishlist = savedWishlist ? JSON.parse(savedWishlist) : [];
      
      console.log('[DEBUG] Parsed cart:', parsedCart);
      console.log('[DEBUG] Parsed wishlist:', parsedWishlist);
      
      dispatch({
        type: 'LOAD_PERSISTED_STATE',
        payload: {
          cart: parsedCart,
          wishlist: parsedWishlist
        }
      });
    }
  }, []);

  useEffect(() => {
    console.log('[DEBUG] Saving cart to localStorage:', state.cart);
    localStorage.setItem('aries_leo_cart', JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    console.log('[DEBUG] Saving wishlist to localStorage:', state.wishlist);
    localStorage.setItem('aries_leo_wishlist', JSON.stringify(state.wishlist));
  }, [state.wishlist]);

  const addToCart = (product: Product, quantity: number, size: string, color: string) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity, size, color } });
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId, size, color } });
  };

  const updateCartQuantity = (productId: string, size: string, color: string, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { productId, size, color, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const addToWishlist = (product: Product) => {
    console.log('[DEBUG] Adding to wishlist:', product.name, product.id);
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
  };

  const removeFromWishlist = (productId: string) => {
    console.log('[DEBUG] Removing from wishlist:', productId);
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
  };

  const isInWishlist = (productId: string) => {
    const result = state.wishlist.some(item => item.product.id === productId);
    console.log('[DEBUG] Checking if in wishlist:', productId, result);
    return result;
  };

  const getCartTotal = () => {
    return state.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value: AppContextType = {
    ...state,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getCartTotal,
    getCartItemCount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}