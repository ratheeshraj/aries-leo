import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  HeartIcon, 
  ShoppingCartIcon, 
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import type { Product } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { formatCurrency, calculateDiscount, hexToColorName } from '../../utils/helpers';
import Button from '../ui/Button';


interface ProductCardProps {
  product: Product;
  className?: string;
  onView?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  className = '', 
  onView 
}) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useAppContext();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const carouselInterval = useRef<NodeJS.Timeout | null>(null);

  // Handle both old and new image formats
  interface ProductImage {
    original?: string;
    medium?: string;
    thumb?: string;
  }
  
  const productImages = Array.isArray(product.images) 
    ? product.images.map((img: string | ProductImage) => 
        typeof img === 'string' ? img : img.original || img.medium || img.thumb
      ).filter(Boolean)
    : [];

  const productId = product.id || product._id;
  const isWishlisted = isInWishlist(productId);
  const hasDiscount = product.compareAtPrice && product.compareAtPrice < (product.costPrice || 0);
  const discountPercentage = hasDiscount 
    ? calculateDiscount(product.costPrice!, product.compareAtPrice || 0)
    : 0;

  // Get available colors for the selected size
  const getAvailableColorsForSize = (size: string): string[] => {
    if (!product.inventory || !size) return product.colors || [];
    
    const availableColors = new Set<string>();
    product.inventory.forEach(inv => {
      if (inv.size === size && inv.color && inv.stockQuantity > 0) {
        // Convert hex color to color name if needed
        let colorName = inv.color;
        if (inv.color.startsWith('#')) {
          colorName = hexToColorName(inv.color);
        }
        availableColors.add(colorName);
      }
    });
    
    return Array.from(availableColors);
  };

  // Get available sizes for the product
  const getAvailableSizes = (): string[] => {
    if (!product.inventory) return product.sizes || [];
    
    const availableSizes = new Set<string>();
    product.inventory.forEach(inv => {
      if (inv.size && inv.stockQuantity > 0) {
        availableSizes.add(inv.size);
      }
    });
    
    return Array.from(availableSizes);
  };

  // Get available colors for current selected size
  const availableColors = getAvailableColorsForSize(selectedSize);
  const availableSizes = getAvailableSizes();

  // Update selected color when size changes or on initial load
  useEffect(() => {
    if (selectedSize && availableColors.length > 0) {
      // If current selected color is not available for the new size, select the first available
      if (!availableColors.includes(selectedColor)) {
        setSelectedColor(availableColors[0]);
      }
    } else if (availableColors.length > 0 && selectedColor === '') {
      // On initial load, select the first available color
      setSelectedColor(availableColors[0]);
    } else if (availableColors.length === 0) {
      setSelectedColor('');
    }
  }, [selectedSize, availableColors]);

  // Update selected size on initial load
  useEffect(() => {
    if (availableSizes.length > 0 && !selectedSize) {
      setSelectedSize(availableSizes[0]);
    }
  }, [availableSizes, selectedSize]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get the selected inventory item if size and color are selected
    let selectedInventoryId: string | undefined;
    if (selectedSize && selectedColor && product.inventory) {
      const selectedInventory = product.inventory.find(
        (inv) => {
          // Match exact size
          const sizeMatch = inv.size === selectedSize;
          
          // Match exact color (handle both hex and color names)
          let colorMatch = false;
          if (inv.color && selectedColor) {
            // If the inventory color is hex and selected color is a name, convert
            if (inv.color.startsWith('#')) {
              const colorName = hexToColorName(inv.color);
              colorMatch = colorName === selectedColor;
            } else {
              // Direct string comparison
              colorMatch = inv.color === selectedColor;
            }
          }
          
          return sizeMatch && colorMatch;
        }
      );
      selectedInventoryId = selectedInventory?._id;
    }
    
    addToCart(product, 1, selectedSize, selectedColor, selectedInventoryId);
    
    // Show a temporary success message using a toast notification
    const variantInfo = selectedSize && selectedColor ? ` (${selectedSize}, ${selectedColor})` : '';
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center';
    toast.innerHTML = `
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      ${product.name}${variantInfo} added to cart!
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 2000);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('[DEBUG] ProductCard - handleWishlistToggle called for product:', product.name, productId);
    console.log('[DEBUG] ProductCard - currently wishlisted?', isWishlisted);
    if (isWishlisted) {
      console.log('[DEBUG] ProductCard - removing from wishlist');
      removeFromWishlist(productId);
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

  // Automatic carousel
  useEffect(() => {
    if (!isHovered && productImages.length > 1) {
      carouselInterval.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === productImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000); // Change image every 3 seconds
    }

    return () => {
      if (carouselInterval.current) {
        clearInterval(carouselInterval.current);
      }
    };
  }, [isHovered, productImages.length]);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-shadow duration-300 hover:shadow-lg card-responsive h-full flex flex-col ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="block">
        {/* Product Image */}
        <Link 
          to={`/product/${productId}`} 
          className="block"
          onClick={onView}
        >
          <div className="relative overflow-hidden bg-gray-100 aspect-[3/4]">
            {hasDiscount && (
              <div className="absolute top-1 left-1 sm:top-2 sm:left-2 z-10">
                <span className="bg-accent-rose text-white px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs font-semibold rounded">
                  -{discountPercentage}%
                </span>
              </div>
            )}

            {/* {!product.inStock && (
              <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-10">
                <span className="bg-gray-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs font-semibold rounded">
                  Sold Out
                </span>
              </div>
            )} */}

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className="absolute top-1 right-1 sm:top-2 sm:right-2 z-20 p-1.5 sm:p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50"
            >
              {isWishlisted ? (
                <HeartIconSolid className="w-4 h-4 sm:w-5 sm:h-5 text-accent-rose" />
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
                src={productImages[currentImageIndex] || ''}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300"
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{ opacity: isImageLoading ? 0 : 1 }}
              />

              {/* Image Navigation */}
              {productImages.length > 1 && (
                <>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/20 rounded-full px-3 py-1.5">
                    {productImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setCurrentImageIndex(index);
                        }}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          index === currentImageIndex 
                            ? 'bg-white scale-110' 
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                  {/* Navigation Arrows */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentImageIndex(prev => 
                        prev === 0 ? productImages.length - 1 : prev - 1
                      );
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-black/20 rounded-full hover:bg-black/30 transition-colors duration-200"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentImageIndex(prev => 
                        prev === productImages.length - 1 ? 0 : prev + 1
                      );
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-black/20 rounded-full hover:bg-black/30 transition-colors duration-200"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          <Link 
            to={`/product/${product.id}`} 
            className="block flex-1"
            onClick={onView}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-accent-rose transition-colors">
                  {product.name}
                </h3>
              </div>

              <p className="text-gray-600 text-sm mb-2 line-clamp-2 flex-1">
                {product.description}
              </p>

              <div className="mt-auto">
                {/* Rating */}
                {/* <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(averageRating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-1">
                    {averageRating.toFixed(1)} ({reviewCount} reviews)
                  </span>
                </div> */}
                {/* Review Snippet */}
                {/* {reviews.length > 0 ? (
                  <div className="text-xs text-gray-700 italic mb-2 line-clamp-2">
                    "{reviews[0].comment}"
                    {reviews[0].user && (
                      <span className="ml-1 text-gray-400">- {reviews[0].user}</span>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-gray-400 italic mb-2">No reviews yet</div>
                )} */}

                {/* Price */}
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-xl font-bold text-gray-900">
                    {formatCurrency(product.compareAtPrice || 0)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatCurrency(product.costPrice || 0)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>

          {/* Quick Options */}
          <div className="space-y-2 mb-3">
            {/* Size Selection */}
            {availableSizes && availableSizes.length > 0 && (
              <div>
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
                  {availableSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Color Selection */}
            {availableColors && availableColors.length > 0 && (
              <div>
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
                  {availableColors.map((color) => (
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
            fullWidth
            size="sm"
            leftIcon={<ShoppingCartIcon className="w-4 h-4" />}
          >
             Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// Export both default and named export for compatibility
export default ProductCard;
export { ProductCard };