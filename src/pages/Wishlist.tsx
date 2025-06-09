import React from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useApp } from '../context/AppContext';
import Button from '../components/ui/Button';
import ProductCard from '../components/product/ProductCard';
import { formatCurrency } from '../utils/helpers';
import { mockProducts } from '../data/mockData';
import { useScrollToTop } from '../hooks/useScrollToTop';

export const Wishlist: React.FC = () => {
  useScrollToTop();
  const { wishlist, removeFromWishlist, addAllToCart } = useApp();

  console.log('[DEBUG] Wishlist page - wishlist from context:', wishlist);
  console.log('[DEBUG] Wishlist page - wishlist length:', wishlist.length);

  const wishlistItems = wishlist.map(item => item.product);

  console.log('[DEBUG] Wishlist page - wishlistItems:', wishlistItems);

  const clearAllWishlist = () => {
    wishlistItems.forEach(product => {
      removeFromWishlist(product.id);
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <HeartIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Save items you love to your wishlist. They'll be here when you're ready to purchase.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => window.location.href = '/shop'}
            >
              Continue Shopping
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <HeartSolidIcon className="w-8 h-8 text-accent-rose mr-3" />
                My Wishlist
              </h1>
              <p className="text-gray-600 mt-2">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            {wishlistItems.length > 0 && (
              <Button
                variant="outline"
                onClick={clearAllWishlist}
                className="text-accent-rose border-accent-rose hover:bg-accent-light"
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </motion.div>

        {/* Wishlist Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {wishlistItems.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="relative"
            >
              <ProductCard product={product} />
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow z-10"
                title="Remove from wishlist"
              >
                <TrashIcon className="w-4 h-4 text-accent-rose" />
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Summary */}
        <motion.div
          className="mt-12 bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Wishlist Summary</h3>
              <p className="text-gray-600">
                Total value: {formatCurrency(
                  wishlistItems.reduce((sum, product) => sum + (product?.price || 0), 0)
                )}
              </p>
            </div>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => window.location.href = '/shop'}
              >
                Continue Shopping
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  addAllToCart(wishlistItems, 1, 'default-size', 'default-color');
                }}
              >
                Add All to Cart
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Recently Viewed or Recommendations */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockProducts
              .filter(product => !wishlist.some(item => item.product.id === product.id))
              .slice(0, 4)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
