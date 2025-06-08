import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import type { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatCurrency, calculateDiscount } from '../../utils/helpers';
import Button from '../ui/Button';


interface ProductCardProps {
  product: Product;
  className?: string;
  viewMode?: 'grid' | 'list';
  onView?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  className = '', 
  viewMode = 'grid', 
  onView 
}) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const isWishlisted = isInWishlist(product.id);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount 
    ? calculateDiscount(product.originalPrice!, product.price)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, selectedSize, selectedColor);
    
    // Show a temporary success message using a toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center';
    toast.innerHTML = `
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      ${product.name} added to cart!
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 2000);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('[DEBUG] ProductCard - handleWishlistToggle called for product:', product.name, product.id);
    console.log('[DEBUG] ProductCard - currently wishlisted?', isWishlisted);
    if (isWishlisted) {
      console.log('[DEBUG] ProductCard - removing from wishlist');
      removeFromWishlist(product.id);
    } else {
      console.log('[DEBUG] ProductCard - adding to wishlist');
      addToWishlist(product);
    }
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
  };

  return (
    <motion.div
      whileHover={{ y: viewMode === 'grid' ? -4 : 0 }}
      className={`group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-shadow duration-300 hover:shadow-lg card-responsive ${
        viewMode === 'list' ? 'flex' : ''
      } ${className}`}
    >
      <div className={`${viewMode === 'list' ? 'flex w-full' : 'block'}`}>
        {/* Product Image */}
        <Link 
          to={`/product/${product.id}`} 
          className={`block ${viewMode === 'list' ? 'flex-shrink-0' : ''}`}
          onClick={onView}
        >
          <div className={`relative overflow-hidden bg-gray-100 ${
            viewMode === 'list' ? 'w-32 h-32 sm:w-48 sm:h-48' : 'aspect-[3/4]'
          }`}>
            {hasDiscount && (
              <div className="absolute top-1 left-1 sm:top-2 sm:left-2 z-10">
                <span className="bg-accent-rose text-white px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs font-semibold rounded">
                  -{discountPercentage}%
                </span>
              </div>
            )}

            {!product.inStock && (
              <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-10">
                <span className="bg-gray-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs font-semibold rounded">
                  Sold Out
                </span>
              </div>
            )}

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className="absolute top-1 right-1 sm:top-2 sm:right-2 z-20 p-1.5 sm:p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50"
            >
              {isWishlisted ? (
                <HeartSolid className="w-4 h-4 sm:w-5 sm:h-5 text-accent-rose" />
              ) : (
                <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              )}
            </button>

            {/* Image Carousel */}
            <div className="relative w-full h-full">
              {isImageLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300"
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{ opacity: isImageLoading ? 0 : 1 }}
              />

              {/* Image Navigation */}
              {product.images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Link>

        {/* Product Info */}
        <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
          <Link 
            to={`/product/${product.id}`} 
            className="block"
            onClick={onView}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-accent-rose transition-colors">
                {product.name}
              </h3>
            </div>

            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
              {product.description}
            </p>

            {/* Rating */}
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-1">
                ({product.reviewCount})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-xl font-bold text-gray-900">
                {formatCurrency(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  {formatCurrency(product.originalPrice!)}
                </span>
              )}
            </div>
          </Link>

          {/* Quick Options */}
          <div className={`space-y-2 mb-3 ${viewMode === 'list' ? 'flex flex-wrap gap-4 space-y-0' : ''}`}>
            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div className={viewMode === 'list' ? 'flex-1 min-w-20' : ''}>
                <label className="text-xs font-medium text-gray-700 block mb-1">
                  Size:
                </label>
                <select
                  value={selectedSize}
                  onChange={(e) => {
                    e.stopPropagation();
                    setSelectedSize(e.target.value);
                  }}
                  className="text-xs border border-gray-300 rounded px-2 py-1 w-full"
                  style={{ backgroundColor: 'white' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {product.sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div className={viewMode === 'list' ? 'flex-1 min-w-20' : ''}>
                <label className="text-xs font-medium text-gray-700 block mb-1">
                  Color:
                </label>
                <select
                  value={selectedColor}
                  onChange={(e) => {
                    e.stopPropagation();
                    setSelectedColor(e.target.value);
                  }}
                  className="text-xs border border-gray-300 rounded px-2 py-1 w-full"
                  style={{ backgroundColor: 'white' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {product.colors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={(event) => handleAddToCart(event)}
            disabled={!product.inStock}
            fullWidth
            size="sm"
            leftIcon={<ShoppingCartIcon className="w-4 h-4" />}
          >
            {product.inStock ? 'Add to Cart' : 'Sold Out'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// Export both default and named export for compatibility
export default ProductCard;
export { ProductCard };