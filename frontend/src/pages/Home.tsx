import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, StarIcon, TruckIcon, ShieldCheckIcon, HeartIcon } from '@heroicons/react/24/outline';
import { mockBlogPosts } from '../data/mockData';
import { reviewAPI, productAPI } from '../utils/api';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/ui/Button';
import { useScrollToTop } from '../hooks/useScrollToTop';
import type { Product } from '../types';
import logo from '../assets/aries-leo-logo.png'

const Home: React.FC = () => {
  useScrollToTop();

  const [bestReviews, setBestReviews] = React.useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = React.useState(false);
  const [reviewsError, setReviewsError] = React.useState<string | null>(null);
  
  const [featuredProducts, setFeaturedProducts] = React.useState<Product[]>([]);
  const [promotionsProducts, setPromotionsProducts] = React.useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = React.useState(false);
  const [productsError, setProductsError] = React.useState<string | null>(null);

  // Newsletter subscription state
  const [newsletterEmail, setNewsletterEmail] = React.useState('');
  const [newsletterStatus, setNewsletterStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = React.useState('');

  const latestBlogPosts = mockBlogPosts.slice(0, 3);

  // Newsletter subscription handler
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setNewsletterStatus('loading');
    try {
      await reviewAPI.subscribeNewsletter(newsletterEmail);
      setNewsletterStatus('success');
      setNewsletterMessage('Successfully subscribed!');
      setNewsletterEmail('');
    } catch (error) {
      setNewsletterStatus('error');
      setNewsletterMessage(error instanceof Error ? error.message : 'Failed to subscribe');
    }
  };

  React.useEffect(() => {
    const fetchBestReviews = async () => {
      setReviewsLoading(true);
      try {
        const response = await reviewAPI.getBestReviews();
        if (response.success && response.reviews) {
          setBestReviews(response.reviews);
        }
      } catch (err) {
        setReviewsError('Failed to fetch reviews.');
      } finally {
        setReviewsLoading(false);
      }
    };

    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        // Fetch all products
        const response = await productAPI.getProducts();
        if (response.products) {
          const allProducts = response.products;
          const inventories = response.inventories || [];
          const categories = response.categories || [];
          
          // Process products to include inventory data
          const processedProducts = allProducts.map((product: Product) => {
            // Find inventory items for this product
            const productInventories = inventories.filter((inv: any) => inv.product === product._id);
            
            // Extract unique sizes and colors from inventory
            const sizes = [...new Set(productInventories.map((inv: any) => inv.size).filter(Boolean))];
            const colors = [...new Set(productInventories.map((inv: any) => inv.color).filter(Boolean))];
            
            // Calculate stock status
            const totalStock = productInventories.reduce((sum: number, inv: any) => sum + (inv.stockQuantity || 0), 0);
            const inStock = totalStock > 0;
            
            return {
              ...product,
              id: product._id, // Ensure id is set for compatibility
              inventory: productInventories,
              sizes,
              colors,
              inStock,
              stockCount: totalStock
            };
          });
          
          // Filter featured products
          const featured = processedProducts.filter((product: Product) => product.isFeatured).slice(0, 4);
          setFeaturedProducts(featured);
          
          // Filter promotion products (products with compareAtPrice)
          const promotionProducts = processedProducts.filter((product: Product) => {
            return product.compareAtPrice && product.compareAtPrice > 0;
          });
          
          // If more than 4 products, randomly select 4, otherwise use all
          let selectedPromotions;
          if (promotionProducts.length > 4) {
            // Shuffle array and take first 4
            selectedPromotions = promotionProducts
              .sort(() => Math.random() - 0.5)
              .slice(0, 4);
          } else {
            selectedPromotions = promotionProducts;
          }
          
          setPromotionsProducts(selectedPromotions);
        }
      } catch (err) {
        setProductsError('Failed to fetch products.');
      } finally {
        setProductsLoading(false);
      }
    };

    fetchBestReviews();
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-accent-light to-secondary-50 overflow-hidden px-4 py-8 sm:py-16">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10"></div>
        
        <motion.div 
          className="relative z-10 text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo Section */}
          <div className="flex justify-center">
            <img src={logo} alt="Aries Leo Logo" className="h-32 w-auto sm:h-40 md:h-48 lg:h-56 xl:h-64" />
          </div>
{/* 
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Aries Leo
          </motion.h1> */}
          
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-700 mb-6 sm:mb-8 font-light px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Bottoms that empower every woman
          </motion.p>
          
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-12 px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Cotton • Comfort • Confidence
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link to="/shop" className="w-full sm:w-auto">
              <Button size="lg" className="group w-full sm:w-auto btn-responsive">
                Shop Collection
                <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/about" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto btn-responsive">
                Our Story
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container-responsive">
          <motion.div 
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Why Choose Aries Leo?</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Experience the perfect blend of comfort, style, and functionality in every pair
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <HeartIcon className="w-12 h-12" />,
                title: "Designed for Women",
                description: "Every piece is crafted specifically for women's bodies, ensuring the perfect fit and flattering silhouette"
              },
              {
                icon: <TruckIcon className="w-12 h-12" />,
                title: "Global Shipping",
                description: "Free worldwide shipping on orders over Rs.2000. Express delivery available to your doorstep"
              },
              {
                icon: <ShieldCheckIcon className="w-12 h-12" />,
                title: "Satisfaction Promise",
                description: "30-day return policy and lifetime repair service. Your confidence is our guarantee"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-accent-light transition-colors"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-accent-rose mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Collection</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular styles loved by customers worldwide
            </p>
          </motion.div>

          {productsLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-rose"></div>
              <p className="mt-2 text-gray-600">Loading featured products...</p>
            </div>
          ) : productsError ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Failed to load featured products. Please try again later.</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No featured products available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard 
                    product={product}
                    onView={() => {}}
                  />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link to="/shop">
              <Button size="lg" variant="outline">
                View All Products
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* New Arrivals or Promotions */}
      <section className="py-20 bg-accent-light">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Promotions</h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Don't miss out on our exclusive deals and latest arrivals!
            </p>
          </motion.div>

          {productsLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-rose"></div>
              <p className="mt-2 text-gray-600">Loading promotions...</p>
            </div>
          ) : productsError ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Failed to load promotions. Please try again later.</p>
            </div>
          ) : promotionsProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No promotions available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {promotionsProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard 
                    product={product}
                    onView={() => {}}
                  />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link to="/shop">
              <Button size="lg" variant="primary">
                Explore Promotions
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied customers who've found their perfect fit
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviewsLoading ? (
              <div className="text-center py-8 text-accent-500">Loading reviews...</div>
            ) : reviewsError ? (
              <div className="text-center py-8 text-text-secondary">No reviews found.</div>
            ) : bestReviews.length === 0 ? (
              <div className="text-center py-8 text-text-secondary">No reviews found.</div>
            ) : (
              bestReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  className="bg-gray-50 rounded-2xl p-8 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon 
                        key={i} 
                        className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{review.comment}"</p>
                  <div className="flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                      <span className="font-serif text-background-500 text-lg md:text-xl">
                        {review.name ? review.name[0].toUpperCase() : '?'}
                      </span>
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-base md:text-lg text-text-header leading-tight">
                        {review.name || 'Anonymous'}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : ''}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest from Our Blog</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Style tips, sustainability insights, and the latest fashion trends
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestBlogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>{post.tags[0]}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <Link
                    to={`/blog/${post.id}`}
                    className="text-accent-rose hover:text-accent-mauve font-medium inline-flex items-center"
                  >
                    Read More
                    <ArrowRightIcon className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link to="/blog">
              <Button size="lg" variant="outline">
                View All Posts
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-accent-rose">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Stay in the Loop
            </h2>
            <p className="text-xl text-accent-light mb-8 max-w-2xl mx-auto">
              Be the first to know about new collections, exclusive offers, and style inspiration
            </p>
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white focus:border-none focus:outline-none"
                disabled={newsletterStatus === 'loading'}
                required
              />
              <Button 
                variant="secondary" 
                size="lg" 
                type="submit"
                disabled={newsletterStatus === 'loading'}
              >
                {newsletterStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
            {newsletterMessage && (
              <p className={`mt-4 text-sm ${newsletterStatus === 'success' ? 'text-green-200' : 'text-red-200'}`}>
                {newsletterMessage}
              </p>
            )}
          </motion.div>
        </div>
      </section>
      
    </div>
  );
};

export default Home;