import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AdjustmentsHorizontalIcon, 
  XMarkIcon, 
  FunnelIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  StarIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { mockProducts, productCategories } from '../../data/mockData';
import { sortProducts } from '../../utils/helpers';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import ProductCard from '../../components/product/ProductCard';
import Button from '../../components/ui/Button';

interface ShopFilters {
  category: string;
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  inStock: boolean;
  rating: number;
  onSale: boolean;
}

type SortOption = 'name' | 'price_low_high' | 'price_high_low' | 'rating' | 'newest' | 'popularity';

const PRODUCTS_PER_PAGE = 12;

const Shop: React.FC = () => {
  useScrollToTop();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(new Set(['category', 'price']));
  
  const [filters, setFilters] = useState<ShopFilters>({
    category: '',
    priceRange: [0, 1000], // Increased from 500 to 1000 to show all products
    sizes: [],
    colors: [],
    inStock: false,
    rating: 0,
    onSale: false,
  });

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '24', '26', '28', '30', '32', '34'];
  const availableColors = [
    'Black', 'Navy', 'Gray', 'Charcoal', 'White', 'Cream', 
    'Dusty Rose', 'Blush', 'Sage Green', 'Terracotta', 
    'Denim Blue', 'Khaki', 'Beige', 'Burgundy', 'Olive'
  ];

  // Enhanced filtering and sorting with loading simulation
  const filteredAndSortedProducts = useMemo(() => {
    let products = mockProducts;

    // Apply search filter
    if (searchQuery) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply category filter
    if (filters.category) {
      products = products.filter(product => product.category === filters.category);
    }

    // Apply price range filter
    products = products.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Apply size filter
    if (filters.sizes.length > 0) {
      products = products.filter(product => 
        product.sizes && product.sizes.some(size => filters.sizes.includes(size))
      );
    }

    // Apply color filter
    if (filters.colors.length > 0) {
      products = products.filter(product => 
        product.colors && product.colors.some(color => filters.colors.includes(color))
      );
    }

    // Apply in stock filter only when explicitly checked
    if (filters.inStock) {
      products = products.filter(product => product.inStock === true);
    }

    // Apply rating filter
    if (filters.rating > 0) {
      products = products.filter(product => product.rating >= filters.rating);
    }

    // Apply sale filter
    if (filters.onSale) {
      products = products.filter(product => product.originalPrice && product.originalPrice > product.price);
    }

    // Apply sorting
    return sortProducts(products, sortBy);
  }, [searchQuery, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredAndSortedProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredAndSortedProducts, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters, sortBy]);

  // Simulate loading when changing filters or page
  const handleAsyncUpdate = useCallback((updateFn: () => void) => {
    setIsLoading(true);
    setTimeout(() => {
      updateFn();
      setIsLoading(false);
    }, 300);
  }, []);

  const handleFilterChange = (key: keyof ShopFilters, value: any) => {
    handleAsyncUpdate(() => {
      setFilters(prev => ({ ...prev, [key]: value }));
    });
  };

  const handleSizeToggle = (size: string) => {
    setFilters(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleColorToggle = (color: string) => {
    setFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: [0, 1000], // Updated from 500 to 1000
      sizes: [],
      colors: [],
      inStock: false,
      rating: 0,
      onSale: false,
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const toggleFilterExpansion = (filterName: string) => {
    setExpandedFilters(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(filterName)) {
        newExpanded.delete(filterName);
      } else {
        newExpanded.add(filterName);
      }
      return newExpanded;
    });
  };

  const activeFiltersCount = 
    (filters.category ? 1 : 0) +
    (filters.sizes.length > 0 ? 1 : 0) +
    (filters.colors.length > 0 ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0) +
    (filters.onSale ? 1 : 0);

  const FilterSection: React.FC<{ title: string; children: React.ReactNode; filterKey: string }> = ({ title, children, filterKey }) => {
    const isExpanded = expandedFilters.has(filterKey);
    
    return (
      <div className="mb-6 border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleFilterExpansion(filterKey)}
          className="flex items-center justify-between w-full text-left"
        >
          <label className="block text-sm font-medium text-gray-700">{title}</label>
          {isExpanded ? (
            <ChevronUpIcon className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
          )}
        </button>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-8 sm:py-12 lg:py-16">
        <div className="container-responsive">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Shop Collection
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Discover our full range of premium women's bottoms designed for comfort, style, and confidence
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-responsive py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Enhanced Filters Sidebar */}
          <aside className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg sticky top-4">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FunnelIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  Filters
                </h3>
                <div className="flex items-center gap-2">
                  {activeFiltersCount > 0 && (
                    <span className="bg-accent-light text-accent-mauve text-xs px-2 py-1 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    <ArrowPathIcon className="w-4 h-4" />
                    Clear all
                  </button>
                </div>
              </div>

              {/* Enhanced Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-rose focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <FilterSection title="Category" filterKey="category">
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-rose focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {productCategories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </FilterSection>

              {/* Price Range */}
              <FilterSection title={`Price: $${filters.priceRange[0]} - $${filters.priceRange[1]}`} filterKey="price">
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="1000" // Updated from 500 to 1000
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                    className="w-full accent-accent-rose"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>$0</span>
                    <span>$1000+</span> {/* Updated from $500+ to $1000+ */}
                  </div>
                </div>
              </FilterSection>

              {/* Rating Filter */}
              <FilterSection title="Minimum Rating" filterKey="rating">
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <button
                      key={rating}
                      onClick={() => handleFilterChange('rating', filters.rating === rating ? 0 : rating)}
                      className={`flex items-center gap-2 w-full p-2 rounded-lg transition-colors ${
                        filters.rating === rating
                          ? 'bg-accent-light text-accent-mauve'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${
                              i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm">& up</span>
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Size Filter */}
              <FilterSection title="Size" filterKey="size">
                <div className="grid grid-cols-3 gap-2">
                  {availableSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => handleSizeToggle(size)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                        filters.sizes.includes(size)
                          ? 'bg-accent-rose text-white border-accent-rose scale-105'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-accent-medium hover:scale-105'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Color Filter */}
              <FilterSection title="Color" filterKey="color">
                <div className="grid grid-cols-2 gap-2">
                  {availableColors.map(color => (
                    <button
                      key={color}
                      onClick={() => handleColorToggle(color)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                        filters.colors.includes(color)
                          ? 'bg-accent-rose text-white border-accent-rose scale-105'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-accent-medium hover:scale-105'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Additional Filters */}
              <FilterSection title="Availability & Offers" filterKey="extras">
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                      className="rounded border-gray-300 text-accent-rose focus:ring-accent-rose"
                    />
                    <span className="ml-2 text-sm text-gray-700">In stock only</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.onSale}
                      onChange={(e) => handleFilterChange('onSale', e.target.checked)}
                      className="rounded border-gray-300 text-accent-rose focus:ring-accent-rose"
                    />
                    <span className="ml-2 text-sm text-gray-700">On sale</span>
                  </label>
                </div>
              </FilterSection>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4">
            {/* Enhanced Toolbar */}
            <div className="bg-white rounded-2xl p-4 mb-6 shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <AdjustmentsHorizontalIcon className="w-5 h-5" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="bg-accent-rose text-white text-xs px-2 py-1 rounded-full">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                  <span className="text-gray-600">
                    {filteredAndSortedProducts.length} products found
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700">Sort by:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-rose focus:border-transparent"
                    >
                      <option value="name">Name</option>
                      <option value="price_low_high">Price: Low to High</option>
                      <option value="price_high_low">Price: High to Low</option>
                      <option value="rating">Rating</option>
                      <option value="newest">Newest</option>
                      <option value="popularity">Popularity</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-rose"></div>
              </div>
            )}

            {/* Products Grid */}
            {!isLoading && paginatedProducts.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <AnimatePresence mode="wait">
                  {paginatedProducts.map((product, index) => (
                    <motion.div
                      key={`${product.id}-${currentPage}`}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <div className="relative group">
                        <ProductCard 
                          product={product}
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : !isLoading ? (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear all filters
                </Button>
              </motion.div>
            ) : null}

            {/* Enhanced Pagination */}
            {!isLoading && totalPages > 1 && (
              <motion.div
                className="flex justify-center items-center mt-12 gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  const isCurrentPage = pageNumber === currentPage;
                  const showPage = pageNumber === 1 || 
                                   pageNumber === totalPages || 
                                   Math.abs(pageNumber - currentPage) <= 1;
                  
                  if (!showPage && pageNumber !== currentPage - 2 && pageNumber !== currentPage + 2) {
                    return null;
                  }
                  
                  if (!showPage) {
                    return (
                      <span key={pageNumber} className="px-2 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isCurrentPage
                          ? 'bg-accent-rose text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      {/* Enhanced Mobile Filters Overlay */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              className="fixed right-0 top-0 h-full w-80 bg-white overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
                {/* Mobile filter content would mirror the desktop filters */}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;
