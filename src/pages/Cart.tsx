import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XMarkIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';
import Button from '../components/ui/Button';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, clearCart, getCartTotal, getCartItemCount } = useApp();

  const handleQuantityChange = (productId: string, size: string, color: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, size, color);
    } else {
      updateCartQuantity(productId, size, color, newQuantity);
    }
  };

  const shipping = cart.length > 0 ? (getCartTotal() >= 100 ? 0 : 15) : 0;
  const tax = getCartTotal() * 0.08; // 8% tax
  const total = getCartTotal() + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          className="text-center max-w-md mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-gray-400 mb-4 sm:mb-6">
            <ShoppingBagIcon className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Your cart is empty</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 px-4">
            Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
          </p>
          <Link to="/shop" className="inline-block w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto">
              Start Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container-responsive py-4 sm:py-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              {getCartItemCount()} {getCartItemCount() === 1 ? 'item' : 'items'} in your cart
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-responsive py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Cart Items</h2>
                  {cart.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-xs sm:text-sm text-gray-500 hover:text-accent-rose transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {cart.map((item, index) => (
                  <motion.div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                    className="p-4 sm:p-6"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.product.id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-accent-rose transition-colors block truncate"
                        >
                          {item.product.name}
                        </Link>
                        <div className="mt-1 text-sm text-gray-600 space-y-1">
                          <p>Size: {item.selectedSize}</p>
                          <p>Color: {item.selectedColor}</p>
                          <p className="font-medium text-gray-900">
                            {formatCurrency(item.product.price)}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(
                              item.product.id,
                              item.selectedSize,
                              item.selectedColor,
                              item.quantity - 1
                            )}
                            className="p-2 hover:bg-gray-50 transition-colors"
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(
                              item.product.id,
                              item.selectedSize,
                              item.selectedColor,
                              item.quantity + 1
                            )}
                            className="p-2 hover:bg-gray-50 transition-colors"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(
                            item.product.id,
                            item.selectedSize,
                            item.selectedColor
                          )}
                          className="p-2 text-gray-400 hover:text-accent-rose transition-colors"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div>
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(getCartTotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                  </span>
                </div>
                {shipping === 0 && getCartTotal() >= 100 && (
                  <p className="text-sm text-green-600">
                    🎉 You've qualified for free shipping!
                  </p>
                )}
                {shipping > 0 && (
                  <p className="text-sm text-gray-600">
                    Add {formatCurrency(100 - getCartTotal())} more for free shipping
                  </p>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">{formatCurrency(tax)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link to="/checkout" className="block">
                  <Button size="lg" className="w-full">
                    Proceed to Checkout
                  </Button>
                </Link>
                <Link to="/shop" className="block">
                  <Button variant="outline" size="lg" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              {/* Security Features */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure 256-bit SSL encryption
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  30-day return policy
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Cart;
