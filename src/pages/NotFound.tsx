import React from 'react';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon, HomeIcon } from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ExclamationTriangleIcon className="mx-auto h-24 w-24 text-accent-mauve mb-6" />
          <h1 className="text-9xl font-bold text-accent-rose mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. 
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </motion.div>
      </div>

      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => window.location.href = '/'}
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Go Home
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => window.location.href = '/shop'}
            >
              Continue Shopping
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Looking for something specific?
            </p>
            <div className="space-y-2">
              <a href="/shop" className="block text-accent-rose hover:text-accent-mauve text-sm">
                Shop All Products
              </a>
              <a href="/about" className="block text-accent-rose hover:text-accent-mauve text-sm">
                About Aries Leo
              </a>
              <a href="/contact" className="block text-accent-rose hover:text-accent-mauve text-sm">
                Contact Support
              </a>
              <a href="/faq" className="block text-accent-rose hover:text-accent-mauve text-sm">
                FAQ
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
