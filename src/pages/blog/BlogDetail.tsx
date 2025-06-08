import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, CalendarIcon, ClockIcon, TagIcon, UserIcon } from '@heroicons/react/24/outline';
import { mockBlogPosts } from '../../data/mockData';
import { formatDate } from '../../utils/helpers';
import Button from '../../components/ui/Button';
import { useScrollToTop } from '../../hooks/useScrollToTop';

export const BlogDetail: React.FC = () => {
  useScrollToTop();
  
  const { id } = useParams<{ id: string }>();
  const post = mockBlogPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <Link to="/blog">
            <Button variant="primary">Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedPosts = mockBlogPosts.filter(p => 
    p.id !== post.id && 
    p.tags.some(tag => post.tags.includes(tag))
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.div
        className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
          <div className="container-responsive">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                to="/blog"
                className="inline-flex items-center text-white/80 hover:text-white mb-3 sm:mb-4 transition-colors text-sm sm:text-base"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-6 text-white/80">
                <div className="flex items-center text-sm sm:text-base">
                  <UserIcon className="w-4 h-4 mr-2" />
                  {post.author}
                </div>
                <div className="flex items-center text-sm sm:text-base">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {formatDate(post.publishedAt)}
                </div>
                <div className="flex items-center text-sm sm:text-base">
                  <ClockIcon className="w-4 h-4 mr-2" />
                  {post.readTime}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="container-responsive py-8 sm:py-12">
        <motion.article
          className="prose prose-sm sm:prose-base lg:prose-lg max-w-none"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-accent-light text-accent-mauve"
                >
                  <TagIcon className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Mock content - In a real app, this would come from the CMS */}
            <div className="space-y-6 text-gray-700">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Understanding the Process</h2>
              
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>

              <blockquote className="border-l-4 border-accent-rose pl-6 italic text-lg text-gray-600 my-8">
                "Pants that feel like freedom – Cotton | Pockets | Personality. This isn't just our tagline; it's our promise to every customer who chooses Aries Leo."
              </blockquote>

              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Key Features</h3>
              
              <ul className="list-disc list-inside space-y-2">
                <li>Premium cotton fabric for ultimate comfort</li>
                <li>Functional pockets designed for everyday use</li>
                <li>Unique designs that express your personality</li>
                <li>Sustainable manufacturing practices</li>
              </ul>

              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Future of Fashion</h2>
              
              <p>
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
              </p>
            </div>
          </div>
        </motion.article>

        {/* Share Section */}
        <motion.div
          className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
            Share this article
          </h3>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none btn-responsive"
              onClick={() => {
                const url = window.location.href;
                const text = `Check out this article: ${post.title}`;
                if (navigator.share) {
                  navigator.share({ title: post.title, text, url });
                } else {
                  navigator.clipboard.writeText(url);
                }
              }}
            >
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none btn-responsive"
              onClick={() => {
                const text = `Check out this article: ${post.title} ${window.location.href}`;
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
              }}
            >
              Twitter
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none btn-responsive"
              onClick={() => {
                const url = window.location.href;
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
              }}
            >
              Facebook
            </Button>
          </div>
        </motion.div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.div
            className="mt-12 sm:mt-16"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
              Related Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <img
                      src={relatedPost.featuredImage}
                      alt={relatedPost.title}
                      className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-4 sm:p-6">
                      <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-accent-rose transition-colors text-sm sm:text-base line-clamp-2">
                        {relatedPost.title}
                      </h4>
                      <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">
                        {relatedPost.excerpt.length > 100 
                          ? `${relatedPost.excerpt.substring(0, 100)}...`
                          : relatedPost.excerpt
                        }
                      </p>
                      <div className="flex items-center text-xs sm:text-sm text-gray-500">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {formatDate(relatedPost.publishedAt)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
