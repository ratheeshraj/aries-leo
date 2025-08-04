const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');
const User = require('./models/userModel');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/authentic-weavers';
console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample products data
const products = [
  {
    name: 'Royal Blue Kanjivaram Silk Saree',
    price: 18999,
    description: 'This exquisite Royal Blue Kanjivaram silk saree features intricate gold zari work with traditional temple border and peacock motifs. Handcrafted by master weavers from Tamil Nadu, this saree represents the pinnacle of South Indian weaving tradition.',
    images: ['/images/saree1.jpg', '/images/saree1-2.jpg', '/images/saree1-3.jpg'],
    category: 'Kanjivaram',
    countInStock: 5,
    material: 'Pure Silk',
    colors: ['Royal Blue', 'Gold'],
    dimensions: '5.5 meters x 1.2 meters',
    featured: true,
    isNew: false,
    discountPercentage: 10,
  },
  {
    name: 'Emerald Green Banarasi Silk Saree',
    price: 22999,
    description: 'This stunning Emerald Green Banarasi silk saree features intricate gold and silver zari work with traditional floral motifs. Handcrafted by master weavers from Varanasi, this saree represents centuries of North Indian weaving heritage.',
    images: ['/images/saree2.jpg', '/images/saree2-2.jpg', '/images/saree2-3.jpg'],
    category: 'Banarasi',
    countInStock: 3,
    material: 'Pure Silk',
    colors: ['Emerald Green', 'Gold'],
    dimensions: '5.5 meters x 1.2 meters',
    featured: true,
    isNew: false,
    discountPercentage: 0,
  },
  {
    name: 'Crimson Red Wedding Silk Saree',
    price: 26999,
    description: 'This magnificent Crimson Red Wedding silk saree features elaborate gold zari work with traditional bridal motifs and border. Handcrafted for special occasions, this saree is adorned with intricate temple designs and auspicious symbols.',
    images: ['/images/saree3.jpg', '/images/saree3-2.jpg', '/images/saree3-3.jpg'],
    category: 'Bridal',
    countInStock: 2,
    material: 'Pure Mulberry Silk',
    colors: ['Crimson Red', 'Gold'],
    dimensions: '6 meters x 1.2 meters',
    featured: true,
    isNew: false,
    discountPercentage: 5,
  },
  {
    name: 'Pastel Pink Chanderi Silk Saree',
    price: 15999,
    description: 'This elegant Pastel Pink Chanderi silk saree features delicate silver zari work with contemporary floral patterns. Lightweight and perfect for summer occasions, this saree combines traditional craftsmanship with modern aesthetics.',
    images: ['/images/saree4.jpg', '/images/saree4-2.jpg'],
    category: 'Chanderi',
    countInStock: 8,
    material: 'Chanderi Silk Cotton',
    colors: ['Pastel Pink', 'Silver'],
    dimensions: '5.5 meters x 1.2 meters',
    featured: true,
    isNew: true,
    discountPercentage: 0,
  },
  {
    name: 'Mustard Yellow Pochampally Ikat Silk Saree',
    price: 17999,
    description: 'This vibrant Mustard Yellow Pochampally Ikat silk saree features geometric patterns created using the traditional ikat dyeing technique. Handcrafted by artisans from Telangana, this saree showcases the distinctive double ikat weaving style.',
    images: ['/images/saree5.jpg', '/images/saree5-2.jpg'],
    category: 'Pochampally',
    countInStock: 4,
    material: 'Pure Silk',
    colors: ['Mustard Yellow', 'Black', 'Red'],
    dimensions: '5.5 meters x 1.2 meters',
    featured: false,
    isNew: true,
    discountPercentage: 0,
  },
  {
    name: 'Purple Paithani Silk Saree',
    price: 24999,
    description: 'This luxurious Purple Paithani silk saree features intricate peacock and lotus motifs woven with pure gold zari. Handcrafted by master weavers from Maharashtra, this saree represents the royal heritage of Paithan weaving tradition.',
    images: ['/images/saree6.jpg', '/images/saree6-2.jpg'],
    category: 'Paithani',
    countInStock: 3,
    material: 'Pure Silk',
    colors: ['Purple', 'Gold'],
    dimensions: '5.5 meters x 1.2 meters',
    featured: false,
    isNew: true,
    discountPercentage: 0,
  },
  {
    name: 'Teal Blue Tussar Silk Saree',
    price: 13999,
    description: 'This elegant Teal Blue Tussar silk saree features hand-painted Madhubani art depicting traditional folk scenes. Created by artisans from Bihar, this saree combines the natural texture of tussar silk with vibrant cultural artistry.',
    images: ['/images/saree7.jpg', '/images/saree7-2.jpg'],
    category: 'Tussar',
    countInStock: 6,
    material: 'Tussar Silk',
    colors: ['Teal Blue', 'Multicolor'],
    dimensions: '5.5 meters x 1.2 meters',
    featured: false,
    isNew: true,
    discountPercentage: 15,
  },
  {
    name: 'Maroon Bomkai Silk Saree',
    price: 19999,
    description: 'This traditional Maroon Bomkai silk saree features distinctive tribal-inspired geometric patterns and motifs. Handcrafted by weavers from Odisha, this saree represents the cultural heritage of Eastern India with its unique weaving technique.',
    images: ['/images/saree8.jpg', '/images/saree8-2.jpg'],
    category: 'Bomkai',
    countInStock: 4,
    material: 'Pure Silk',
    colors: ['Maroon', 'Gold'],
    dimensions: '5.5 meters x 1.2 meters',
    featured: false,
    isNew: true,
    discountPercentage: 0,
  }
];

// Import data function
const importData = async () => {
  try {
    // Find admin user for product ownership
    const adminUser = await User.findOne({ isAdmin: true });
    
    if (!adminUser) {
      console.log('No admin user found. Please create an admin user first.');
      process.exit(1);
    }
    
    // Add admin user id to all products
    const sampleProducts = products.map(product => {
      return { ...product, user: adminUser._id };
    });
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Insert new products
    await Product.insertMany(sampleProducts);
    
    console.log('Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Delete data function
const destroyData = async () => {
  try {
    await Product.deleteMany({});
    
    console.log('Data destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Determine which function to run based on command line argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
