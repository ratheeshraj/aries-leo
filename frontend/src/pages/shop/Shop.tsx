import React, { useState, useMemo, useCallback, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AdjustmentsHorizontalIcon, 
  XMarkIcon, 
  FunnelIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  SparklesIcon,
  FireIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { sortProducts, transformProducts, hexToColorName } from '../../utils/helpers';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import ProductCard from '../../components/product/ProductCard';
import Button from '../../components/ui/Button';
import { productAPI } from '../../utils/api';
import type { Product } from '../../types';

interface ShopFilters {
  category: string[];
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  inStock: boolean;
  rating: number;
  onSale: boolean;
  featured: boolean;
  newArrivals: boolean;
  material: string[];
  gender: string[];
}

const PRODUCTS_PER_PAGE = 12;

// Memoized FilterSection component
const FilterSection = memo<{ title: string; children: React.ReactNode; filterKey: string; isExpanded: boolean; onToggle: (key: string) => void }>(
  ({ title, children, filterKey, isExpanded, onToggle }) => {
    return (
      <div className="mb-6 border-b border-gray-200 pb-4 last:border-b-0">
        <button
          onClick={() => onToggle(filterKey)}
          className="flex items-center justify-between w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors group"
        >
          <label className="block text-sm font-semibold text-gray-900 group-hover:text-gray-700">{title}</label>
          {isExpanded ? (
            <ChevronUpIcon className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
          ) : (
            <ChevronDownIcon className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
          )}
        </button>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="mt-3"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

FilterSection.displayName = 'FilterSection';

const Shop: React.FC = () => {
  useScrollToTop();
  
  // Manual scroll to top function as fallback
  const scrollToTop = useCallback(() => {
    try {
      // Temporarily disable smooth scrolling
      const originalScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      
      // Multiple scroll methods
      window.scrollTo(0, 0);
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
      
      // Restore smooth scrolling
      setTimeout(() => {
        document.documentElement.style.scrollBehavior = originalScrollBehavior;
      }, 100);
    } catch (error) {
      console.warn('Manual scroll to top failed:', error);
    }
  }, []);
  
  // Additional scroll to top after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToTop();
    }, 200);
    
    return () => clearTimeout(timer);
  }, [scrollToTop]);
  
  const sortBy = 'name';
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(new Set(['category', 'price']));
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Array<{_id: string, name: string}>>([]);
  const [error, setError] = useState<string | null>(null);
  const [viewMode] = useState<'grid' | 'list'>('grid');
  
  const [filters, setFilters] = useState<ShopFilters>({
    category: [],
    priceRange: [199, 1700],
    sizes: [],
    colors: [],
    inStock: false,
    rating: 0,
    onSale: false,
    featured: false,
    newArrivals: false,
    material: [],
    gender: [],
  });

  // Use refs to track the latest state for API calls
  const filtersRef = useRef(filters);
  const searchQueryRef = useRef(searchQuery);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFetchingRef = useRef(false);
  const debouncedFetchProductsRef = useRef<(() => void) | null>(null);

  // Update refs when state changes
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    searchQueryRef.current = searchQuery;
  }, [searchQuery]);

  // Extract available options from products data
  const availableOptions = useMemo(() => {
    const sizes = new Set<string>();
    const colors = new Set<string>();
    const materials = new Set<string>();
    const genders = new Set<string>();

    products.forEach(product => {
      // Extract sizes and colors from inventory
      if (product.inventory) {
        product.inventory.forEach((inv: any) => {
          if (inv.size) sizes.add(inv.size);
          if (inv.color) {
            const colorName = hexToColorName(inv.color);
            colors.add(colorName);
          }
        });
      }

      // Extract other properties
      if (product.material) materials.add(product.material);
      if (product.gender) genders.add(product.gender);
    });

    return {
      sizes: Array.from(sizes).sort(),
      colors: Array.from(colors).sort(),
      materials: Array.from(materials).sort(),
      genders: Array.from(genders).sort(),
    };
  }, [products]);

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    if (isFetchingRef.current) return; // Prevent multiple simultaneous requests
    
    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      const currentFilters = filtersRef.current;
      const currentSearchQuery = searchQueryRef.current;
      
      const apiFilters = {
        category: currentFilters.category.length > 0 ? currentFilters.category : undefined,
        priceRange: currentFilters.priceRange,
        sizes: currentFilters.sizes.length > 0 ? currentFilters.sizes : undefined,
        colors: currentFilters.colors.length > 0 ? currentFilters.colors : undefined,
        inStock: currentFilters.inStock || undefined,
        rating: currentFilters.rating > 0 ? currentFilters.rating : undefined,
        onSale: currentFilters.onSale || undefined,
        featured: currentFilters.featured || undefined,
        newArrivals: currentFilters.newArrivals || undefined,
        search: currentSearchQuery || undefined,
        material: currentFilters.material.length > 0 ? currentFilters.material : undefined,
        gender: currentFilters.gender.length > 0 ? currentFilters.gender : undefined,
      };

      const response = await productAPI.getProducts(apiFilters);
      console.log('Fetched products:', response);

      if (response.discounts) {
        localStorage.setItem('discounts', JSON.stringify(response.discounts));
      }
      
      // Transform backend products to frontend format, including inventory data
      const transformedProducts = transformProducts(
        response.products || [], 
        response.inventories || []
      );
      setProducts(transformedProducts);
      
      // Set categories from response
      if (response.categories) {
        setCategories(response.categories);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      setProducts([]);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // Debounced fetch products
  const debouncedFetchProducts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      fetchProducts();
    }, 300); // Increased debounce time for better performance
  }, [fetchProducts]);

  // Update the ref with the latest debounced function
  useEffect(() => {
    debouncedFetchProductsRef.current = debouncedFetchProducts;
  }, [debouncedFetchProducts]);

  // Fetch products on component mount and when filters change
  useEffect(() => {
    if (debouncedFetchProductsRef.current) {
      debouncedFetchProductsRef.current();
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [filters, searchQuery]);

  // Enhanced filtering and sorting with loading simulation
  const filteredAndSortedProducts = useMemo(() => {
    let filteredProducts = products;

    // Apply search filter (additional client-side filtering)
    if (searchQuery) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }

    // Apply category filter
    if (filters.category.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        filters.category.some(cat => {
          // Convert both category values to strings for comparison
          const productCategory = String(product.category || '');
          const filterCategory = String(cat);
          return productCategory === filterCategory;
        })
      );
    }

    // Apply price range filter
    filteredProducts = filteredProducts.filter(product => {
      const price = product.compareAtPrice ? product.compareAtPrice : product.costPrice || 0;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Apply size filter
    if (filters.sizes.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        product.inventory && product.inventory.some((inv: any) => 
          inv.size && filters.sizes.includes(inv.size)
        )
      );
    }

    // Apply color filter
    if (filters.colors.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        product.inventory && product.inventory.some((inv: any) => {
          if (!inv.color) return false;
          const colorName = hexToColorName(inv.color);
          return filters.colors.includes(colorName);
        })
      );
    }

    // Apply material filter
    if (filters.material.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        filters.material.some(mat => product.material && product.material.toLowerCase().includes(mat.toLowerCase()))
      );
    }

    // Apply gender filter
    if (filters.gender.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        filters.gender.some(gender => product.gender && product.gender.toLowerCase() === gender.toLowerCase())
      );
    }

    

    // Apply in stock filter
    if (filters.inStock) {
      filteredProducts = filteredProducts.filter(product => 
        product.inventory && product.inventory.some((inv: any) => 
          inv.stockQuantity > 0 && inv.status === 'inStock'
        )
      );
    }

    // Apply rating filter
    if (filters.rating > 0) {
      filteredProducts = filteredProducts.filter(product => product.rating && product.rating >= filters.rating);
    }

    // Apply sale filter
    if (filters.onSale) {
      filteredProducts = filteredProducts.filter(product => 
        product.compareAtPrice && product.costPrice && product.compareAtPrice < product.costPrice
      );
    }

    // Apply featured filter
    if (filters.featured) {
      filteredProducts = filteredProducts.filter(product => product.isFeatured === true);
    }

    // Apply new arrivals filter
    if (filters.newArrivals) {
      filteredProducts = filteredProducts.filter(product => {
        const createdAt = new Date(product.createdAt);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return createdAt > thirtyDaysAgo;
      });
    }

    // Apply sorting
    return sortProducts(filteredProducts, sortBy);
  }, [products, searchQuery, filters, sortBy]);

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

  const handleFilterChange = useCallback((key: keyof ShopFilters, value: any) => {
    console.log('Filter change:', key, value);
    setFilters(prev => {
      // Only update if the value is actually different
      console.log(JSON.stringify(prev[key]), JSON.stringify(value));
      if (JSON.stringify(prev[key]) === JSON.stringify(value)) {
        return prev;
      }
      
      // Handle quick filters (featured, newArrivals, onSale) as radio buttons
      if (key === 'featured' && value === true) {
        return { ...prev, featured: true, newArrivals: false, onSale: false };
      } else if (key === 'newArrivals' && value === true) {
        return { ...prev, newArrivals: true, featured: false, onSale: false };
      } else if (key === 'onSale' && value === true) {
        return { ...prev, onSale: true, featured: false, newArrivals: false };
      } else if (key === 'featured' || key === 'newArrivals' || key === 'onSale') {
        // When setting any quick filter to false, don't affect others
        return { ...prev, [key]: value };
      }
      
      return { ...prev, [key]: value };
    });
  }, []);

  const handleSizeToggle = useCallback((size: string) => {
    setFilters(prev => {
      const newSizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      
      // Only update if the sizes array actually changed
      if (JSON.stringify(prev.sizes) === JSON.stringify(newSizes)) {
        return prev;
      }
      return { ...prev, sizes: newSizes };
    });
  }, []);

  const handleColorToggle = useCallback((color: string) => {
    setFilters(prev => {
      const newColors = prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color];
      
      // Only update if the colors array actually changed
      if (JSON.stringify(prev.colors) === JSON.stringify(newColors)) {
        return prev;
      }
      return { ...prev, colors: newColors };
    });
  }, []);

  const handleCategoryToggle = useCallback((categoryId: string) => {
    setFilters(prev => {
      const newCategories = prev.category.includes(categoryId)
        ? prev.category.filter(c => c !== categoryId)
        : [...prev.category, categoryId];
      
      // Only update if the category array actually changed
      if (JSON.stringify(prev.category) === JSON.stringify(newCategories)) {
        return prev;
      }
      return { ...prev, category: newCategories };
    });
  }, []);



  // const handleGenderToggle = useCallback((gender: string) => {
  //   setFilters(prev => {
  //     const newGenders = prev.gender.includes(gender)
  //       ? prev.gender.filter(g => g !== gender)
  //       : [...prev.gender, gender];
      
  //     // Only update if the gender array actually changed
  //     if (JSON.stringify(prev.gender) === JSON.stringify(newGenders)) {
  //       return prev;
  //     }
  //     return { ...prev, gender: newGenders };
  //   });
  // }, []);



  const handleMaterialToggle = useCallback((material: string) => {
    setFilters(prev => {
      const newMaterials = prev.material.includes(material)
        ? prev.material.filter(m => m !== material)
        : [...prev.material, material];
      
      // Only update if the material array actually changed
      if (JSON.stringify(prev.material) === JSON.stringify(newMaterials)) {
        return prev;
      }
      return { ...prev, material: newMaterials };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      category: [],
      priceRange: [199, 1700],
      sizes: [],
      colors: [],
      inStock: false,
      rating: 0,
      onSale: false,
      featured: false,
      newArrivals: false,
      material: [],
      gender: [],
    });
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  const toggleFilterExpansion = useCallback((filterName: string) => {
    setExpandedFilters(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(filterName)) {
        newExpanded.delete(filterName);
      } else {
        newExpanded.add(filterName);
      }
      return newExpanded;
    });
  }, []);

  const activeFiltersCount = useMemo(() => 
    (filters.category.length > 0 ? 1 : 0) +
    (filters.sizes.length > 0 ? 1 : 0) +
    (filters.colors.length > 0 ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0) +
    ((filters.onSale || filters.featured || filters.newArrivals) ? 1 : 0) +
    (filters.material.length > 0 ? 1 : 0) +
    (filters.gender.length > 0 ? 1 : 0), [filters]);

  // Memoize filter options to prevent unnecessary re-renders
  const memoizedFilterOptions = useMemo(() => ({
    categories,
    availableOptions,
    expandedFilters,
  }), [categories, availableOptions, expandedFilters]);

  // Memoize filter section content to prevent unnecessary re-renders
  const memoizedFilterContent = useMemo(() => ({
    categoryContent: (
      <div className="max-h-48 overflow-y-auto space-y-1 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors group">
          <input
            type="checkbox"
            checked={filters.category.length === 0}
            onChange={() => handleFilterChange('category', [])}
            className="rounded border-gray-300 text-accent-rose"
          />
          <span className="text-sm text-gray-700 group-hover:text-gray-900">All Categories</span>
        </label>
        {memoizedFilterOptions.categories.map(category => (
          <label key={category._id} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors group">
            <input
              type="checkbox"
              checked={filters.category.includes(category._id)}
              onChange={() => handleCategoryToggle(category._id)}
              className="rounded border-gray-300 text-accent-rose"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">{category.name}</span>
          </label>
        ))}
      </div>
    ),
  }), [filters, memoizedFilterOptions, handleFilterChange, handleCategoryToggle]);

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
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg sticky top-4 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FunnelIcon className="w-5 h-5 text-accent-rose" />
                  Filters
                </h3>
                <div className="flex items-center gap-2">
                  {activeFiltersCount > 0 && (
                    <span className="bg-accent-rose text-white text-xs px-2 py-1 rounded-full font-medium">
                      {activeFiltersCount}
                    </span>
                  )}
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
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

              {/* Quick Filters */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 group-hover:text-gray-700 mb-3">Quick Filters</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors group">
                    <input
                      type="radio"
                      name="quickFilter"
                      checked={filters.featured && !filters.newArrivals && !filters.onSale}
                      onChange={() => {
                        handleFilterChange('featured', true);
                        handleFilterChange('newArrivals', false);
                        handleFilterChange('onSale', false);
                      }}
                      className="text-accent-rose"
                    />
                    <SparklesIcon className="w-4 h-4 text-accent-rose" />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">Featured Products</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors group">
                    <input
                      type="radio"
                      name="quickFilter"
                      checked={filters.newArrivals && !filters.featured && !filters.onSale}
                      onChange={() => {
                        handleFilterChange('newArrivals', true);
                        handleFilterChange('featured', false);
                        handleFilterChange('onSale', false);
                      }}
                      className="text-accent-rose"
                    />
                    <FireIcon className="w-4 h-4 text-accent-rose" />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">New Arrivals</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors group">
                    <input
                      type="radio"
                      name="quickFilter"
                      checked={filters.onSale && !filters.featured && !filters.newArrivals}
                      onChange={() => {
                        handleFilterChange('onSale', true);
                        handleFilterChange('featured', false);
                        handleFilterChange('newArrivals', false);
                      }}
                      className="text-accent-rose"
                    />
                    <TagIcon className="w-4 h-4 text-accent-rose" />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">On Sale</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors group">
                    <input
                      type="radio"
                      name="quickFilter"
                      checked={!filters.featured && !filters.newArrivals && !filters.onSale}
                      onChange={() => {
                        handleFilterChange('featured', false);
                        handleFilterChange('newArrivals', false);
                        handleFilterChange('onSale', false);
                      }}
                      className="text-accent-rose"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">All Products</span>
                  </label>
                </div>
              </div>

              {/* Category Filter */}
              <FilterSection 
                title="Category" 
                filterKey="category" 
                isExpanded={memoizedFilterOptions.expandedFilters.has('category')} 
                onToggle={toggleFilterExpansion}
              >
                {memoizedFilterContent.categoryContent}
              </FilterSection>

              {/* Gender Filter */}
              {/* <FilterSection 
                title="Gender" 
                filterKey="gender" 
                isExpanded={memoizedFilterOptions.expandedFilters.has('gender')} 
                onToggle={toggleFilterExpansion}
              >
                <div className="max-h-48 overflow-y-auto space-y-1 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors group">
                    <input
                      type="checkbox"
                      checked={filters.gender.length === 0}
                      onChange={() => handleFilterChange('gender', [])}
                      className="rounded border-gray-300 text-accent-rose"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">All Genders</span>
                  </label>
                  {memoizedFilterOptions.availableOptions.genders.map(gender => (
                    <label key={gender} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors group">
                      <input
                        type="checkbox"
                        checked={filters.gender.includes(gender)}
                        onChange={() => handleGenderToggle(gender)}
                        className="rounded border-gray-300 text-accent-rose"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">{gender.charAt(0).toUpperCase() + gender.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </FilterSection> */}
              {/* Price Range */}
              <FilterSection 
                title={`Price: ₹${filters.priceRange[0]} - ₹${filters.priceRange[1]}`} filterKey="price" 
                isExpanded={memoizedFilterOptions.expandedFilters.has('price')} 
                onToggle={toggleFilterExpansion}
              >
                <div className="space-y-3">
                  <input
                    type="range"
                    min="199"
                    max="1700"
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [199, parseInt(e.target.value)])}
                    className="w-full accent-accent-rose"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>₹199</span>
                    <span>₹1700</span>
                  </div>
                </div>
              </FilterSection>

              {/* Rating Filter */}
              {/* <FilterSection 
                title="Minimum Rating" 
                filterKey="rating" 
                isExpanded={memoizedFilterOptions.expandedFilters.has('rating')} 
                onToggle={toggleFilterExpansion}
              >
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
              </FilterSection> */}

              {/* Material Filter */}
              <FilterSection 
                title="Material" 
                filterKey="material" 
                isExpanded={memoizedFilterOptions.expandedFilters.has('material')} 
                onToggle={toggleFilterExpansion}
              >
                <div className="max-h-48 overflow-y-auto space-y-1 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors group">
                    <input
                      type="checkbox"
                      checked={filters.material.length === 0}
                      onChange={() => handleFilterChange('material', [])}
                      className="rounded border-gray-300 text-accent-rose"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">All Materials</span>
                  </label>
                  {memoizedFilterOptions.availableOptions.materials.map(material => (
                    <label key={material} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors group">
                      <input
                        type="checkbox"
                        checked={filters.material.includes(material)}
                        onChange={() => handleMaterialToggle(material)}
                        className="rounded border-gray-300 text-accent-rose"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">{material}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Size Filter */}
              <FilterSection 
                title="Size" 
                filterKey="size" 
                isExpanded={memoizedFilterOptions.expandedFilters.has('size')} 
                onToggle={toggleFilterExpansion}
              >
                <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <div className="grid grid-cols-3 gap-2 pr-2">
                    {memoizedFilterOptions.availableOptions.sizes.map(size => (
                      <label key={size} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors group">
                        <input
                          type="checkbox"
                          checked={filters.sizes.includes(size)}
                          onChange={() => handleSizeToggle(size)}
                          className="rounded border-gray-300 text-accent-rose"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </FilterSection>

              {/* Color Filter */}
              <FilterSection 
                title="Color" 
                filterKey="color" 
                isExpanded={memoizedFilterOptions.expandedFilters.has('color')} 
                onToggle={toggleFilterExpansion}
              >
                <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <div className="grid grid-cols-2 gap-2 pr-2">
                    {memoizedFilterOptions.availableOptions.colors.map(color => (
                      <label key={color} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors group">
                        <input
                          type="checkbox"
                          checked={filters.colors.includes(color)}
                          onChange={() => handleColorToggle(color)}
                          className="rounded border-gray-300 text-accent-rose"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900">{color}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </FilterSection>

              {/* Additional Filters */}
              <FilterSection 
                title="Availability & Offers" 
                filterKey="extras" 
                isExpanded={memoizedFilterOptions.expandedFilters.has('extras')} 
                onToggle={toggleFilterExpansion}
              >
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

                {/* <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded transition-colors ${
                        viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded transition-colors ${
                        viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

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
                      <option value="featured">Featured</option>
                    </select>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Error State */}
            {error && (
              <motion.div
                className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center">
                  <div className="text-red-400 mr-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Error loading products</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                  <button
                    onClick={() => fetchProducts()}
                    className="ml-auto text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Try again
                  </button>
                </div>
              </motion.div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-rose"></div>
              </div>
            )}

            {/* Products Grid/List */}
            {!isLoading && !error && paginatedProducts.length > 0 ? (
              <motion.div
                className={viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
                }
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <AnimatePresence mode="wait">
                  {paginatedProducts.map((product, index) => (
                    <motion.div
                      key={`${product._id}-${currentPage}`}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className={viewMode === 'list' ? 'bg-white rounded-lg shadow-sm border border-gray-200' : ''}
                    >
                      <div className="relative group">
                        <ProductCard 
                          product={product}
                          className={viewMode === 'list' ? 'flex-row' : ''}
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : !isLoading && !error ? (
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
            {!isLoading && !error && totalPages > 1 && (
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

      {/* Scroll to Top Button */}
      <button
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="fixed bottom-6 right-6 bg-accent-rose text-white p-3 rounded-full shadow-lg hover:bg-accent-mauve transition-colors z-40"
        aria-label="Scroll to top"
      >
        <ChevronUpIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Shop;
