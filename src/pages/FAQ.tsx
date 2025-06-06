import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    category: 'Shipping & Delivery',
    question: 'How long does shipping take?',
    answer: 'We offer free standard shipping on orders over $100, which typically takes 5-7 business days. Express shipping (2-3 business days) and overnight shipping options are also available for an additional fee.'
  },
  {
    id: '2',
    category: 'Shipping & Delivery',
    question: 'Do you ship internationally?',
    answer: 'Yes! We ship to over 50 countries worldwide. International shipping times vary by location but typically take 7-14 business days. Customs duties and taxes may apply and are the responsibility of the customer.'
  },
  {
    id: '3',
    category: 'Shipping & Delivery',
    question: 'Can I track my order?',
    answer: 'Absolutely! Once your order ships, you\'ll receive a tracking number via email. You can also track your order status by logging into your account on our website.'
  },
  {
    id: '4',
    category: 'Returns & Exchanges',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy from the date of delivery. Items must be unworn, unwashed, and in original condition with tags attached. Return shipping is free for exchanges or store credit.'
  },
  {
    id: '5',
    category: 'Returns & Exchanges',
    question: 'How do I exchange an item?',
    answer: 'To exchange an item, simply log into your account, select the order, and choose "Exchange" for the item you want to swap. We\'ll send you a prepaid return label and ship your new item once we receive the original.'
  },
  {
    id: '6',
    category: 'Returns & Exchanges',
    question: 'Can I return sale items?',
    answer: 'Sale items can be returned for store credit only within 30 days of purchase. Final sale items (marked as such) cannot be returned or exchanged.'
  },
  {
    id: '7',
    category: 'Sizing & Fit',
    question: 'How do I find my size in women\'s bottoms?',
    answer: 'Check our detailed size guide on each product page, designed specifically for women\'s measurements. We recommend measuring your waist, hips, and inseam, then comparing to our size chart. If you\'re between sizes, consider your preferred fit - size up for comfort or down for a more fitted look.'
  },
  {
    id: '8',
    category: 'Sizing & Fit',
    question: 'What if my bottoms don\'t fit properly?',
    answer: 'No worries! We offer free exchanges for size swaps within 30 days. Simply request an exchange through your account, and we\'ll send you a prepaid return label. Our customer service team can also help you find the perfect fit.'
  },
  {
    id: '8a',
    category: 'Sizing & Fit',
    question: 'Do you offer petite and tall sizes?',
    answer: 'Yes! Many of our styles are available in petite (for women 5\'4" and under) and tall (for women 5\'9" and over) lengths. Check the size options on each product page for availability.'
  },
  {
    id: '9',
    category: 'Product Care',
    question: 'How should I care for my Aries Leo women\'s bottoms?',
    answer: 'For best results, machine wash cold with like colors, tumble dry low, and avoid bleach. For delicate fabrics like our leggings, consider air drying. Check the care label on each item for specific instructions to maintain quality and fit.'
  },
  {
    id: '10',
    category: 'Product Care',
    question: 'Are your bottoms pre-shrunk?',
    answer: 'Yes, all our cotton bottoms are pre-shrunk during manufacturing. However, we still recommend washing in cold water and following care instructions to maintain the perfect fit and prevent any additional shrinkage.'
  },
  {
    id: '11',
    category: 'Orders & Payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Klarna for buy-now-pay-later options.'
  },
  {
    id: '12',
    category: 'Orders & Payment',
    question: 'Can I modify or cancel my order?',
    answer: 'Orders can be modified or cancelled within 1 hour of placement. After that, orders enter our fulfillment process and cannot be changed. Contact customer service immediately if you need to make changes.'
  },
  {
    id: '13',
    category: 'Account & Membership',
    question: 'Do I need an account to place an order?',
    answer: 'While you can checkout as a guest, creating an account lets you track orders, save favorites, earn rewards points, and enjoy faster checkout for future purchases.'
  },
  {
    id: '14',
    category: 'Account & Membership',
    question: 'What are the benefits of your membership program?',
    answer: 'Members earn points on every purchase, get early access to sales, receive exclusive offers, and enjoy birthday discounts. Plus, free shipping on all orders regardless of amount!'
  },
  {
    id: '15',
    category: 'Women\'s Specific',
    question: 'Are your bottoms designed specifically for women?',
    answer: 'Absolutely! Every piece in our collection is designed specifically for women\'s bodies, taking into account different body types, proportions, and fit preferences to ensure a flattering and comfortable fit.'
  },
  {
    id: '16',
    category: 'Women\'s Specific',
    question: 'Do you offer maternity or post-pregnancy options?',
    answer: 'While we don\'t have a dedicated maternity line, many of our high-waisted and adjustable styles work beautifully during and after pregnancy. Our customer service team can recommend the best options for your needs.'
  },
  {
    id: '17',
    category: 'Women\'s Specific',
    question: 'What body types do your bottoms work best for?',
    answer: 'Our collection is designed to flatter all body types! We offer various cuts including high-waisted, mid-rise, wide-leg, straight-leg, and fitted styles to complement different preferences and body shapes.'
  }
];

const categories = Array.from(new Set(faqData.map(item => item.category)));

export const FAQ: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const filteredFAQs = faqData.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our products, shipping, returns, and more.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === 'All'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {filteredFAQs.map((item, index) => (
            <motion.div
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div>
                  <span className="text-sm text-primary-600 font-medium">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 mt-1">
                    {item.question}
                  </h3>
                </div>
                {openItems.has(item.id) ? (
                  <ChevronUpIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {openItems.has(item.id) && (
                <motion.div
                  className="px-6 pb-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-gray-700 leading-relaxed">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {filteredFAQs.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-500 text-lg">
              No FAQs found matching your search criteria.
            </p>
          </motion.div>
        )}

        {/* Contact Support */}
        <motion.div
          className="mt-16 bg-white rounded-lg shadow-sm p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our customer support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/contact'}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Contact Support
            </button>
            <button
              onClick={() => window.location.href = 'mailto:support@ariesleo.com'}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Email Us
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
