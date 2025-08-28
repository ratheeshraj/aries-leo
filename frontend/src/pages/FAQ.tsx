import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useScrollToTop } from '../hooks/useScrollToTop';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    category: 'Fabric & Care',
    question: 'Will it shrink?',
    answer: 'Not much. Since the fabric is already washed and ironed before stitching.'
  },
  {
    id: '2',
    category: 'Fabric & Care',
    question: 'Is all pant 100% pure cotton?',
    answer: 'Yes, all pants are 100% pure cotton.'
  },
  {
    id: '3',
    category: 'Design & Features',
    question: 'Do the pants have pockets?',
    answer: 'Of course — with 4-inch deep pockets on both sides.'
  },
  {
    id: '4',
    category: 'Design & Features',
    question: 'Pants have elastic ? Or an adjustable drawstring?',
    answer: 'Both: half elastic with half belt, adjustable drawstring in front.'
  },
  {
    id: '5',
    category: 'Washing Instructions',
    question: 'Are these pants machine washable?',
    answer: 'Except Kalamkari, all other pants can be washed in a machine.'
  },
  {
    id: '6',
    category: 'Washing Instructions',
    question: 'Kalamkari wash instructions:',
    answer: 'No machine wash. → Mild soap wash recommended. Drying: → Dry in shade.'
  },
  {
    id: '7',
    category: 'Fabric & Care',
    question: 'Will there be any colour bleeding?',
    answer: 'No, there will be no colour bleeding.'
  }
];

const categories = Array.from(new Set(faqData.map(item => item.category)));

export const FAQ: React.FC = () => {
  useScrollToTop();
  
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
            Find answers to common questions about our pants, fabric care, washing instructions, and more.
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-rose focus:border-accent-rose"
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
                  ? 'bg-accent-rose text-white'
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
                    ? 'bg-accent-rose text-white'
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
                  <span className="text-sm text-accent-rose font-medium">
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
              onClick={() => {
                const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
                const message = encodeURIComponent("Hi! I have a question about Aries Leo products. Can you help me?");
                const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${message}`;
                window.open(whatsappUrl, '_blank');
              }}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              WhatsApp Support
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
