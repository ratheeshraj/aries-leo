import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HeartIcon, 
  MinusIcon, 
  PlusIcon, 
  TruckIcon, 
  ShieldCheckIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  CalendarIcon,
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useAppContext } from '../../context/AppContext';
import { formatCurrency, hexToColorName, transformProduct, transformProducts } from '../../utils/helpers';
import Button from '../../components/ui/Button';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import { productAPI, reviewAPI } from '../../utils/api';
import type { Product, Review } from '../../types';
import SizeGuide from '../../components/product/SizeGuide';
import ProductCard from '../../components/product/ProductCard';

// Define Inventory type
interface InventoryItem {
  _id: string;
  product: string;
  sku: string;
  barcode: string;
  stockQuantity: number;
  trackInventory: boolean;
  status: string;
  color?: string;
  size?: string;
  isActive: boolean;
  isDeleted: boolean;
  business: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Extended Review interface for local use
interface ExtendedReview extends Review {
  id?: string;
  _id?: string;
  name?: string;
  rating?: number;
  isPending?: boolean;
}

function isHexColor(str: string) {
  return /^#([0-9A-Fa-f]{3}){1,2}$/.test(str);
}

// Helper to get inventory for selected size and color
function getSelectedInventory(inventory: InventoryItem[], size: string, color: string) {
  return inventory.find(
    (item) => {
      // Match exact size
      const sizeMatch = item.size === size;
      
      // Match exact color (handle both hex and color names)
      let colorMatch = false;
      if (item.color && color) {
        // If the inventory color is hex and selected color is a name, convert
        if (item.color.startsWith('#')) {
          const colorName = hexToColorName(item.color);
          colorMatch = colorName === color;
        } else {
          // Direct string comparison
          colorMatch = item.color === color;
        }
      }
      
      return sizeMatch && colorMatch;
    }
  );
}

// Helper to get available colors for a specific size
function getAvailableColorsForSize(inventory: InventoryItem[], size: string): string[] {
  if (!inventory || !size) return [];
  
  const availableColors = new Set<string>();
  inventory.forEach(inv => {
    if (inv.size === size && inv.color) {
      // Convert hex color to color name if needed
      let colorName = inv.color;
      if (inv.color.startsWith('#')) {
        colorName = hexToColorName(inv.color);
      }
      availableColors.add(colorName);
    }
  });
  
  return Array.from(availableColors);
}

const ProductDetail: React.FC = () => {
  useScrollToTop();
  
  const { id } = useParams<{ id: string }>();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, isAuthenticated } = useAppContext();
  
  // More robust authentication check
  const isUserAuthenticated = isAuthenticated || !!localStorage.getItem('token');
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<ExtendedReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewForm, setReviewForm] = useState({
    rating: '',
    comment: ''
  });
  const [reviewSubmitLoading, setReviewSubmitLoading] = useState(false);
  const [reviewSubmitError, setReviewSubmitError] = useState<string | null>(null);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]); // Add inventory state
  const [maxQuantity, setMaxQuantity] = useState<number>(1); // Track max quantity
  const [quantityWarning, setQuantityWarning] = useState<string>(''); // Inline quantity warning

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await productAPI.getProduct(id);
        const transformedProduct = transformProduct(response.data.product);
        setProduct(transformedProduct);
        
        // Set inventory from API response
        setInventory(response.data.inventory || []);
        
        // Set default selections
        if (transformedProduct.sizes && transformedProduct.sizes.length > 0) {
          setSelectedSize(transformedProduct.sizes[0]);
        }
        // Color selection will be handled by useEffect based on selected size
        
        // Set max quantity based on inventory
        const inv = (response.data.inventory && response.data.inventory[0]) || null;
        setMaxQuantity(inv && inv.stockQuantity ? inv.stockQuantity : 1);
        
        // Fetch related products
        const relatedResponse = await productAPI.getProducts({
          category: transformedProduct.category
        });
        const transformedRelated = transformProducts(relatedResponse.products || []);
        setRelatedProducts(transformedRelated.filter((p: Product) => p._id !== id));
        
        // Fetch reviews
        setReviewsLoading(true);
        try {
          const reviewsResponse = await reviewAPI.getReviews(id);
          setReviews(reviewsResponse.reviews || []);
          
          // Calculate average rating
          if (reviewsResponse.reviews && reviewsResponse.reviews.length > 0) {
            const avg = reviewsResponse.reviews.reduce((sum: number, review: ExtendedReview) => sum + (review.rating || 0), 0) / reviewsResponse.reviews.length;
            setAverageRating(avg);
          }

          // Check if user has already reviewed this product
          if (isUserAuthenticated && reviewsResponse.reviews) {
            const userToken = localStorage.getItem('token');
            if (userToken) {
              try {
                // Decode the token to get user info (simple approach)
                const tokenPayload = JSON.parse(atob(userToken.split('.')[1]));
                const userId = tokenPayload.id || tokenPayload._id;
                
                const userReview = reviewsResponse.reviews.find((review: Review) => 
                  review.user === userId || review.user === tokenPayload.email
                );
                setHasUserReviewed(!!userReview);
              } catch (err) {
                console.error('Error checking user review:', err);
              }
            }
          }
        } catch (reviewErr) {
          console.error('Error fetching reviews:', reviewErr);
          setReviewsError('Failed to fetch reviews');
        } finally {
          setReviewsLoading(false);
        }
        
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, isUserAuthenticated]);

  // Update maxQuantity when selectedSize or selectedColor changes (for variants)
  useEffect(() => {
    if (!inventory.length) return;
    if (!selectedSize || !selectedColor) {
      setMaxQuantity(1);
      setQuantity(1);
      return;
    }
    const inv = getSelectedInventory(inventory, selectedSize, selectedColor);
    setMaxQuantity(inv && inv.stockQuantity ? inv.stockQuantity : 1);
    setQuantity((q) => Math.min(q, inv && inv.stockQuantity ? inv.stockQuantity : 1));
  }, [selectedSize, selectedColor, inventory]);

  // Update selected color when size changes or on initial load
  useEffect(() => {
    if (selectedSize && inventory.length > 0) {
      const availableColors = getAvailableColorsForSize(inventory, selectedSize);
      if (availableColors.length > 0) {
        // If current selected color is not available for the new size, select the first available
        if (!availableColors.includes(selectedColor)) {
          setSelectedColor(availableColors[0]);
        }
      } else if (selectedColor !== '') {
        // If no colors available for this size, clear the selection
        setSelectedColor('');
      }
    } else if (inventory.length > 0 && selectedColor === '' && selectedSize === '') {
      // On initial load, select the first available color for the first size
      const firstSize = inventory.find(inv => inv.size)?.size;
      if (firstSize) {
        const availableColors = getAvailableColorsForSize(inventory, firstSize);
        if (availableColors.length > 0) {
          setSelectedColor(availableColors[0]);
        }
      }
    }
  }, [selectedSize, inventory]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-rose mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error ? 'Error loading product' : 'Product not found'}
          </h2>
          <p className="text-gray-600 mb-6">
            {error || 'The product you are looking for does not exist.'}
          </p>
          <Link to="/shop">
            <Button variant="outline">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Handle both old and new image formats
  const productImages = Array.isArray(product.images) 
    ? product.images.map((img: string | { original?: string; medium?: string; thumb?: string }) =>
        typeof img === 'string' ? img : img.original || img.medium || img.thumb
      )
    : [];

  const productId = product.id || product._id;
  const isWishlisted = isInWishlist(productId);
  const hasDiscount = product.compareAtPrice && product.compareAtPrice < (product.costPrice || 0);
  const discountPercentage = hasDiscount 
    ? Math.round(((product.costPrice! - (product.compareAtPrice || 0)) / product.costPrice!) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }
    
    // Get the selected inventory item
    const selectedInventory = getSelectedInventory(inventory, selectedSize, selectedColor);
    if (!selectedInventory) {
      alert('Selected variant is not available');
      return;
    }
    
    addToCart(product, quantity, selectedSize, selectedColor, selectedInventory._id);
    
    // Show a success message
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center';
    toast.innerHTML = `
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      ${product.name} (${selectedSize}, ${selectedColor}) added to cart!
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 2000);
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(product);
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  // Handle review form change
  const handleReviewFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle review form submit
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.rating || !reviewForm.comment.trim()) {
      setReviewSubmitError('Please provide both rating and comment');
      return;
    }

    setReviewSubmitLoading(true);
    setReviewSubmitError(null);
    
    try {
      if (!isUserAuthenticated) {
        setReviewSubmitError('Please login to submit a review');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setReviewSubmitError('Authentication token not found. Please login again.');
        return;
      }

      // Get user info from context or localStorage
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
      const userName = userInfo.name || 'Anonymous';
      
      // Get user ID from token
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenPayload.id || tokenPayload._id;

      // Create the new review object for immediate display
      const newReview = {
        id: `temp-${Date.now()}`, // Temporary ID until server response
        user: userId,
        name: userName,
        rating: parseInt(reviewForm.rating),
        comment: reviewForm.comment,
        createdAt: new Date().toISOString(),
        isPending: true // Flag to show it's being submitted
      };

      // Optimistically add the review to the list immediately
      setReviews(prevReviews => [newReview, ...prevReviews]);
      
      // Update average rating immediately
      const newReviews = [newReview, ...reviews];
      const newAvg = newReviews.reduce((sum: number, review: ExtendedReview) => sum + (review.rating || 0), 0) / newReviews.length;
      setAverageRating(newAvg);

      // Submit to server
      if (!id) {
        throw new Error('Product ID not found');
      }
      console.log('Submitting review for product ID:', id);
      const response = await reviewAPI.addReview(id, {
        rating: parseInt(reviewForm.rating),
        comment: reviewForm.comment
      }, token);
      console.log('Review submission response:', response);

      // Update the review with the real server data
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === newReview.id 
            ? {
                ...response.review,
                isPending: false
              }
            : review
        )
      );

      // Reset form
      setReviewForm({ rating: '', comment: '' });
      setHasUserReviewed(true);
      
      // Show success message
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center';
      toast.innerHTML = `
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Review submitted successfully!
      `;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 3000);

    } catch (err) {
      // Remove the optimistically added review on error
      setReviews(prevReviews => prevReviews.filter(review => !review.isPending));
      
      // Revert average rating
      const originalReviews = reviews.filter(review => !review.isPending);
      const originalAvg = originalReviews.length > 0
        ? originalReviews.reduce((sum: number, review: ExtendedReview) => sum + (review.rating || 0), 0) / originalReviews.length
        : 0;
      setAverageRating(originalAvg);
      
      setReviewSubmitError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setReviewSubmitLoading(false);
    }
  };

  // Extract sizes and colors from inventory
  const inventorySizes = Array.from(new Set(inventory.map(item => item.size).filter(Boolean)));
  const inventoryColors = getAvailableColorsForSize(inventory, selectedSize);

  // Quantity change handlers with validation
  const handleDecreaseQuantity = () => {
    if (!selectedSize || !selectedColor) {
      setQuantityWarning('Please select size and color first');
      return;
    }
    setQuantity((q) => {
      const newQ = Math.max(1, q - 1);
      if (quantityWarning) setQuantityWarning('');
      return newQ;
    });
  };
  const handleIncreaseQuantity = () => {
    if (!selectedSize || !selectedColor) {
      setQuantityWarning('Please select size and color first');
      return;
    }
    if (quantity >= maxQuantity) {
      setQuantityWarning('No more stock available for the selected variant');
      return;
    }
    setQuantity((q) => {
      const newQ = Math.min(maxQuantity, q + 1);
      if (quantityWarning) setQuantityWarning('');
      return newQ;
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-3 sm:py-4">
        <div className="container-responsive">
          <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700 truncate">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/shop" className="text-gray-500 hover:text-gray-700 truncate">Shop</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-responsive py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-3 sm:space-y-4">
            <motion.div
              className="relative aspect-square overflow-hidden rounded-xl sm:rounded-2xl bg-gray-100"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              {productImages.length > 0 ? (
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 sm:p-2 rounded-full shadow-lg transition-colors touch-target"
                  >
                    <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 sm:p-2 rounded-full shadow-lg transition-colors touch-target"
                  >
                    <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </>
              )}

              {/* Discount Badge */}
              {hasDiscount && (
                <div className="absolute top-2 left-2 z-10">
                  <span className="bg-accent-rose text-white px-2 py-1 text-sm font-semibold rounded">
                    -{discountPercentage}%
                  </span>
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={handleWishlistToggle}
                className="absolute top-2 right-2 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors"
              >
                {isWishlisted ? (
                  <HeartIconSolid className="w-5 h-5 text-accent-rose" />
                ) : (
                  <HeartIcon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </motion.div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-colors touch-target ${
                      selectedImage === index
                        ? 'border-accent-rose'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        i < averageRating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    ({reviews.length} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {formatCurrency(product.compareAtPrice || product.costPrice || 0)}
                </span>
                {hasDiscount && (
                  <span className="text-lg sm:text-xl text-gray-500 line-through">
                    {formatCurrency(product.costPrice || 0)}
                  </span>
                )}
              </div>

              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                {product.description || 'No description available.'}
              </p>
            </motion.div>

            {/* Size Selection */}
            {(inventorySizes.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">SIZE</h3>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="text-sm text-accent-rose hover:text-accent-rose/80 underline font-medium"
                  >
                    SIZE GUIDE
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {inventorySizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size!)}
                      className={`px-3 py-2 sm:px-4 sm:py-3 text-sm font-medium rounded-lg border transition-colors touch-target ${
                        selectedSize === size
                          ? 'bg-accent-rose text-white border-accent-rose'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-accent-medium'
                      }`}
                    >
                      {size!.toUpperCase()}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Color Selection */}
            {(inventoryColors.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">COLOR</h3>
                <div className="grid grid-cols-3 gap-2">
                  {inventoryColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-2 sm:px-4 sm:py-3 text-sm font-medium rounded-lg border transition-colors touch-target ${
                        selectedColor === color
                          ? 'bg-accent-rose text-white border-accent-rose'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-accent-medium'
                      }`}
                    >
                      {color.startsWith('#') ? (
                        <>
                          <span className="inline-block w-5 h-5 rounded-full border mr-2 align-middle" style={{ backgroundColor: color }}></span>
                          {hexToColorName(color).toUpperCase()}
                        </>
                      ) : (
                        color.toUpperCase()
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quantity */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDecreaseQuantity}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors touch-target"
                  disabled={quantity <= 1}
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 border border-gray-300 rounded-lg min-w-[60px] text-center font-medium">
                  {quantity}
                </span>
                <button
                  onClick={handleIncreaseQuantity}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors touch-target"
                  disabled={quantity >= maxQuantity}
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
              {quantityWarning && (
                <div className="text-xs text-red-600 mt-2">{quantityWarning}</div>
              )}
            </motion.div>

            {/* Add to Cart & Wishlist */}
            <motion.div
              className="flex gap-3 pt-2 sm:pt-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock || maxQuantity === 0}
                className="flex-1 btn-responsive"
                size="lg"
              >
                {product.inStock && maxQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <button
                onClick={handleWishlistToggle}
                className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors touch-target"
              >
                {isWishlisted ? (
                  <HeartIconSolid className="w-5 h-5 sm:w-6 sm:h-6 text-accent-rose" />
                ) : (
                  <HeartIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                )}
              </button>
            </motion.div>

            {/* Features */}
            <motion.div
              className="border-t pt-4 sm:pt-6 space-y-3 sm:space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="flex items-center gap-3">
                <TruckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-accent-rose flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-700">Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-accent-rose flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-700">30-day return policy</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-8 sm:mt-12 lg:mt-16">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
              {[
                { id: 'description', label: 'Description' },
                { id: 'materials', label: 'Materials & Care' },
                { id: 'reviews', label: 'Reviews' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap touch-target ${
                    activeTab === tab.id
                      ? 'border-accent-rose text-accent-rose'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-6 sm:py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {product.description || 'No description available.'}
                </p>
                {product.tags && product.tags.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {product.tags.map(tag => (
                      <li key={tag} className="flex items-center">
                        <span className="w-2 h-2 bg-accent-rose rounded-full mr-3"></span>
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-4">Materials</h3>
                <p className="text-gray-600 mb-6">{product.material || 'Material information not available.'}</p>
                
                <h3 className="text-lg font-semibold mb-4">Care Instructions</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Machine wash cold with like colors</li>
                  <li>• Do not bleach</li>
                  <li>• Tumble dry low</li>
                  <li>• Iron on low heat if needed</li>
                  <li>• Do not dry clean</li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-6 h-6 ${
                          i < averageRating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xl font-semibold">{averageRating.toFixed(1)}/5</span>
                  <span className="text-gray-600">({reviews.length} reviews)</span>
                </div>

                {reviewsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-rose mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading reviews...</p>
                  </div>
                ) : reviewsError ? (
                  <div className="text-center py-8">
                    <p className="text-red-600">{reviewsError}</p>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map(review => (
                      <div 
                        key={review.id} 
                        className={`border-b border-gray-200 pb-6 ${
                          review.isPending ? 'opacity-75 bg-blue-50 rounded-lg p-4' : ''
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-lg font-semibold text-gray-600">
                              {review.name ? review.name[0].toUpperCase() : '?'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <h4 className="font-semibold text-gray-900">{review.name || 'Anonymous'}</h4>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <StarIcon
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < (review.rating || 0)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              {review.isPending && (
                                <div className="flex items-center gap-2 ml-2">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                  <span className="text-sm text-blue-600 font-medium">Submitting...</span>
                                </div>
                              )}
                            </div>
                            <p className="text-gray-600">{review.comment}</p>
                            <p className="text-sm text-gray-500 mt-2">
                              {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                              {review.isPending && ' (Pending submission)'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Write a Review Form */}
          <div className="mt-12 bg-gray-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Write a Review</h3>
            
            {!isUserAuthenticated ? (
              <div className="text-center py-8">
                <div className="mb-4">
                  <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Login to Write a Review</h4>
                <p className="text-gray-600 mb-6">Please login to share your thoughts about this product.</p>
                <Link to="/login">
                  <Button className="bg-accent-rose hover:bg-accent-mauve">
                    Login to Review
                  </Button>
                </Link>
              </div>
            ) : hasUserReviewed ? (
              <div className="text-center py-8">
                <div className="mb-4">
                  <svg className="w-16 h-16 text-green-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Review Submitted</h4>
                <p className="text-gray-600">Thank you for your review! You have already reviewed this product.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-6">
                {/* Rating Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Rating *
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`focus:outline-none transition-colors ${
                          parseInt(reviewForm.rating) >= star
                            ? 'text-yellow-400'
                            : 'text-gray-300 hover:text-yellow-300'
                        }`}
                        onClick={() =>
                          setReviewForm((prev) => ({
                            ...prev,
                            rating: star.toString(),
                          }))
                        }
                        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                      >
                        <StarIcon className="w-8 h-8 fill-current" />
                      </button>
                    ))}
                  </div>
                  {!reviewForm.rating && (
                    <p className="text-red-500 text-sm mt-1">Please select a rating</p>
                  )}
                </div>

                {/* Comment */}
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review *
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    rows={4}
                    value={reviewForm.comment}
                    onChange={handleReviewFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-rose focus:border-accent-rose"
                    placeholder="Share your thoughts about this product..."
                    required
                  />
                </div>

                {/* Error Message */}
                {reviewSubmitError && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                    {reviewSubmitError}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={reviewSubmitLoading || !reviewForm.rating || !reviewForm.comment.trim()}
                  className="w-full sm:w-auto"
                >
                  {reviewSubmitLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Review'
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-12 sm:mt-16">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
              You might also like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Size Guide Modal */}
      <SizeGuide 
        isOpen={showSizeGuide} 
        onClose={() => setShowSizeGuide(false)} 
      />
    </div>
  );
};

export default ProductDetail;
