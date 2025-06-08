import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, StarIcon, TruckIcon, ShieldCheckIcon, HeartIcon } from '@heroicons/react/24/outline';
import { mockProducts, mockTestimonials, mockBlogPosts } from '../data/mockData';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/ui/Button';

const Home: React.FC = () => {
  const featuredProducts = mockProducts.slice(0, 4);
  const latestBlogPosts = mockBlogPosts.slice(0, 3);

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
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Aries Leo
          </motion.h1>
          
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
                description: "Free worldwide shipping on orders over $100. Express delivery available to your doorstep"
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
                  viewMode="grid"
                  onView={() => {}}
                />
              </motion.div>
            ))}
          </div>

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
            {mockTestimonials.slice(0, 3).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="bg-gray-50 rounded-2xl p-8 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.comment}"</p>
                <div className="flex items-center justify-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
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
            <div className="max-w-md mx-auto flex gap-4">            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-accent-rose"
            />
              <Button variant="secondary" size="lg">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;