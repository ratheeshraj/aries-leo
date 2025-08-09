import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, CalendarIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import { mockBlogPosts } from '../../data/mockData';
import { reviewAPI } from '../../utils/api';
import Button from '../../components/ui/Button';
import { useScrollToTop } from '../../hooks/useScrollToTop';

const Blog: React.FC = () => {
  useScrollToTop();

  // Newsletter subscription state
  const [newsletterEmail, setNewsletterEmail] = React.useState('');
  const [newsletterStatus, setNewsletterStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = React.useState('');

  const featuredPost = mockBlogPosts[0];
  const regularPosts = mockBlogPosts.slice(1);

  const categories = ['All', 'Style Tips', 'Sustainability', 'Fashion Trends', 'Care Guide'];

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Style Stories
            </h1>
            <p className="text-xl text-gray-600">
              Discover the latest in fashion, sustainability, and style inspiration from the Aries Leo team
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Post */}
        {featuredPost && (
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="aspect-video lg:aspect-auto overflow-hidden">
                  <img
                    src={featuredPost.featuredImage}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="text-accent-rose font-medium text-sm mb-2">
                    Featured Post
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-1">
                      <UserIcon className="w-4 h-4" />
                      {featuredPost.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      {new Date(featuredPost.publishedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-4 h-4" />
                      {featuredPost.readTime} min read
                    </div>
                  </div>
                  <Link to={`/blog/${featuredPost.id}`}>
                    <Button className="group">
                      Read Full Article
                      <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Categories */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category, index) => (
              <button
                key={category}
                className={`px-6 py-3 rounded-full font-medium transition-colors ${
                  index === 0
                    ? 'bg-accent-rose text-white'
                    : 'bg-white text-gray-700 hover:bg-accent-light hover:text-accent-mauve'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.section>

        {/* Blog Posts Grid */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post, index) => (
              <motion.article
                key={post.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {post.tags.slice(0, 2).map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-accent-light text-accent-mauve text-xs font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{post.author}</span>
                      <span>{post.readTime} min</span>
                    </div>
                    <Link
                      to={`/blog/${post.id}`}
                      className="text-accent-rose hover:text-accent-mauve font-medium"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        {/* Load More */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Button variant="outline" size="lg">
            Load More Articles
          </Button>
        </motion.div>

        {/* Newsletter CTA */}
        <motion.section
          className="mt-16 bg-accent-rose rounded-2xl p-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Never Miss a Story
          </h2>
          <p className="text-accent-light mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to read our latest articles about style, sustainability, and fashion trends.
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
        </motion.section>
      </div>
    </div>
  );
};

export default Blog;
