import type { Product, BlogPost, Testimonial } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Freedom Flex Wide-Leg Pants',
    description: 'Ultra-comfortable wide-leg pants made from premium cotton blend. Perfect for work or weekend adventures. Features flattering fit and deep pockets.',
    price: 89.99,
    originalPrice: 119.99,
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&h=600&fit=crop'
    ],
    category: 'Wide-Leg',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy', 'Khaki', 'Black', 'Olive'],
    material: 'Premium Cotton Blend',
    inStock: true,
    stockCount: 50,
    rating: 4.8,
    reviewCount: 124,
    tags: ['bestseller', 'comfort', 'versatile'],
    featured: true
  },
  {
    id: '2',
    name: 'High-Waisted Cargo Pants',
    description: 'Trendy high-waisted cargo pants built for style and function. Multiple pockets for all your essentials. Cotton construction with modern fit.',
    price: 94.99,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=600&fit=crop'
    ],
    category: 'Cargo',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Forest Green', 'Desert Tan', 'Black'],
    material: 'Heavy-duty Cotton',
    inStock: true,
    stockCount: 35,
    rating: 4.6,
    reviewCount: 89,
    tags: ['trendy', 'utility', 'high-waisted'],
    featured: true
  },
  {
    id: '3',
    name: 'Classic Straight-Leg Jeans',
    description: 'Timeless straight-leg denim with a modern comfort twist. Soft cotton denim with just the right amount of stretch. Perfect fit for every body type.',
    price: 79.99,
    originalPrice: 99.99,
    images: [
      'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=600&fit=crop'
    ],
    category: 'Jeans',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Dark Wash', 'Light Wash', 'Black'],
    material: 'Cotton Denim with Stretch',
    inStock: true,
    stockCount: 75,
    rating: 4.7,
    reviewCount: 156,
    tags: ['classic', 'everyday', 'comfortable'],
    featured: false
  },
  {
    id: '4',
    name: 'High-Waisted Trousers',
    description: 'Professional high-waisted trousers that combine style and comfort. Tailored fit with premium materials. Perfect for the office or special occasions.',
    price: 109.99,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=600&fit=crop'
    ],
    category: 'Trousers',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Charcoal', 'Navy', 'Black'],
    material: 'Premium Wool Blend',
    inStock: true,
    stockCount: 25,
    rating: 4.9,
    reviewCount: 67,
    tags: ['professional', 'premium', 'tailored'],
    featured: true
  },
  {
    id: '5',
    name: 'Cozy Joggers',
    description: 'Ultra-soft joggers designed for maximum comfort. Perfect for lounging or light workouts. Flattering fit for every body type.',
    price: 59.99,
    images: [
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=600&fit=crop'
    ],
    category: 'Joggers',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Heather Gray', 'Navy', 'Black', 'Dusty Rose'],
    material: 'Soft Cotton Fleece',
    inStock: true,
    stockCount: 60,
    rating: 4.5,
    reviewCount: 203,
    tags: ['casual', 'comfort', 'relaxed'],
    featured: false
  },
  {
    id: '6',
    name: 'Performance Leggings',
    description: 'High-tech performance leggings with moisture-wicking properties and four-way stretch. Perfect for workouts or everyday comfort.',
    price: 79.99,
    images: [
      'https://images.unsplash.com/photo-1506629905607-d33c8b043b7e?w=500&h=600&fit=crop'
    ],
    category: 'Leggings',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Midnight Blue', 'Charcoal', 'Black'],
    material: 'Technical Fabric Blend',
    inStock: true,
    stockCount: 40,
    rating: 4.8,
    reviewCount: 145,
    tags: ['performance', 'activewear', 'stretch'],
    featured: true
  },
  {
    id: '7',
    name: 'Palazzo Wide-Leg Pants',
    description: 'Flowing palazzo pants with an ultra-wide leg design. Perfect for summer days or special occasions. Features drawstring waist for comfort.',
    price: 69.99,
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=600&fit=crop'
    ],
    category: 'Wide-Leg',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Terracotta', 'Sage Green', 'Cream', 'Navy'],
    material: 'Lightweight Cotton',
    inStock: true,
    stockCount: 30,
    rating: 4.6,
    reviewCount: 89,
    tags: ['flowy', 'summer', 'comfortable'],
    featured: false
  },
  {
    id: '8',
    name: 'High-Rise Skinny Jeans',
    description: 'Classic high-rise skinny jeans with superior stretch and recovery. Flattering fit that holds its shape all day long.',
    price: 84.99,
    images: [
      'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=500&h=600&fit=crop'
    ],
    category: 'Jeans',
    sizes: ['24', '26', '28', '30', '32', '34'],
    colors: ['Dark Indigo', 'Vintage Black', 'Medium Wash'],
    material: 'Stretch Denim',
    inStock: true,
    stockCount: 45,
    rating: 4.7,
    reviewCount: 156,
    tags: ['skinny', 'high-rise', 'stretch'],
    featured: true
  },
  {
    id: '9',
    name: 'Cropped Wide-Leg Pants',
    description: 'Modern cropped wide-leg pants perfect for showing off your favorite shoes. Professional yet comfortable for all-day wear.',
    price: 79.99,
    images: [
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&h=600&fit=crop'
    ],
    category: 'Wide-Leg',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Camel', 'Navy', 'White'],
    material: 'Cotton Twill',
    inStock: true,
    stockCount: 35,
    rating: 4.5,
    reviewCount: 78,
    tags: ['cropped', 'modern', 'versatile'],
    featured: false
  },
  {
    id: '10',
    name: 'Yoga Leggings',
    description: 'Ultra-soft yoga leggings with four-way stretch and moisture-wicking technology. Perfect for yoga, pilates, or everyday wear.',
    price: 65.99,
    images: [
      'https://images.unsplash.com/photo-1506629905607-d33c8b043b7e?w=500&h=600&fit=crop'
    ],
    category: 'Leggings',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Burgundy', 'Navy', 'Charcoal'],
    material: 'Performance Blend',
    inStock: true,
    stockCount: 55,
    rating: 4.8,
    reviewCount: 234,
    tags: ['yoga', 'activewear', 'moisture-wicking'],
    featured: true
  },
  {
    id: '11',
    name: 'Paperbag Waist Trousers',
    description: 'Trendy paperbag waist trousers with a relaxed fit and tie belt. Perfect for creating a chic, effortless look.',
    price: 89.99,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=600&fit=crop'
    ],
    category: 'Trousers',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Blush', 'Sage Green', 'Cream', 'Black'],
    material: 'Linen Blend',
    inStock: true,
    stockCount: 28,
    rating: 4.6,
    reviewCount: 92,
    tags: ['trendy', 'paperbag', 'relaxed'],
    featured: false
  },
  {
    id: '12',
    name: 'Bootcut Jeans',
    description: 'Classic bootcut jeans with a flattering fit through the hips and thighs. Slight flare at the bottom for a timeless silhouette.',
    price: 74.99,
    images: [
      'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=500&h=600&fit=crop'
    ],
    category: 'Jeans',
    sizes: ['24', '26', '28', '30', '32', '34'],
    colors: ['Medium Wash', 'Dark Wash', 'Light Wash'],
    material: 'Cotton Denim',
    inStock: true,
    stockCount: 40,
    rating: 4.4,
    reviewCount: 123,
    tags: ['bootcut', 'classic', 'flattering'],
    featured: false
  }
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Science of Comfort: Why Women\'s Bottoms Matter',
    excerpt: 'Discover how the right pair of bottoms can transform your daily comfort and confidence.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    author: 'Sarah Johnson',
    publishedAt: new Date('2024-12-15'),
    featuredImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
    tags: ['comfort', 'style', 'wellness'],
    readTime: 5
  },
  {
    id: '2',
    title: 'Cotton vs. Synthetic: The Ultimate Guide for Women\'s Bottoms',
    excerpt: 'Learn about different fabric choices and why cotton remains our material of choice for women\'s comfort.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    author: 'Lisa Chen',
    publishedAt: new Date('2024-12-10'),
    featuredImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=400&fit=crop',
    tags: ['materials', 'cotton', 'sustainability'],
    readTime: 7
  },
  {
    id: '3',
    title: 'Style Guide: Women\'s Bottoms for Every Occasion',
    excerpt: 'From casual weekends to important meetings, find the perfect bottoms for any situation.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    author: 'Emma Davis',
    publishedAt: new Date('2024-12-05'),
    featuredImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
    tags: ['style', 'fashion', 'versatility'],
    readTime: 6
  }
];

export const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Alexandra Thompson',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    comment: 'These bottoms truly feel like freedom! The comfort and quality are unmatched. I\'ve ordered three more pairs.',
    location: 'New York, USA'
  },
  {
    id: '2',
    name: 'Maria Rodriguez',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    comment: 'Finally found bottoms with real pockets! The fit and comfort combination is perfect for my lifestyle.',
    location: 'Barcelona, Spain'
  },
  {
    id: '3',
    name: 'Priya Patel',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    comment: 'The cotton quality is exceptional. These are the most comfortable bottoms I\'ve ever worn - perfect for my active lifestyle.',
    location: 'Mumbai, India'
  },
  {
    id: '4',
    name: 'Sophie Wilson',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    comment: 'Love the confidence these bottoms bring to my wardrobe. Comfort meets style perfectly - and the fit is amazing!',
    location: 'London, UK'
  }
];

export const categories = ['All', 'Wide-Leg', 'Jeans', 'Cargo', 'Trousers', 'Joggers', 'Leggings'];
export const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '24', '26', '28', '30', '32', '34'];
export const colors = ['Black', 'Navy', 'Khaki', 'Charcoal', 'Olive', 'Heather Gray', 'Desert Tan', 'Forest Green', 'Dusty Rose', 'Dark Wash', 'Light Wash', 'Midnight Blue'];
export const materials = ['Premium Cotton Blend', 'Heavy-duty Cotton', 'Cotton Denim with Stretch', 'Premium Wool Blend', 'Soft Cotton Fleece', 'Technical Fabric Blend'];

// Product categories for filtering
export const productCategories = [
  { value: '', label: 'All Categories' },
  { value: 'Wide-Leg', label: 'Wide-Leg Pants' },
  { value: 'Cargo', label: 'Cargo Pants' },
  { value: 'Jeans', label: 'Jeans' },
  { value: 'Trousers', label: 'Trousers' },
  { value: 'Joggers', label: 'Joggers' },
  { value: 'Leggings', label: 'Leggings' }
];

export const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'name', label: 'Name A-Z' }
];