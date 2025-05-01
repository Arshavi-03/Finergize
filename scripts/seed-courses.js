// scripts/seed-courses.js
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

// Define the CourseModule Schema
const CourseModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  videoId: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
});

// Define the Course Schema
const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  bgColor: {
    type: String,
    required: true,
  },
  modules: [CourseModuleSchema],
}, {
  timestamps: true,
});

// Create the model
const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

// Sample courses data
const coursesData = [
  {
    title: 'Stock Market Basics',
    description: 'Learn the fundamentals of how stock markets operate and the key concepts every investor should know',
    category: 'investing',
    icon: '📊',
    bgColor: 'from-blue-600 to-blue-900',
    modules: [
      {
        title: 'Introduction to Stocks',
        description: 'Understanding what stocks are and how the stock market works',
        videoId: 'p7HKvqRI_Bo',
        duration: '8:42'
      },
      {
        title: 'How to Read Stock Charts',
        description: 'Learning the essentials of understanding stock price charts and key indicators',
        videoId: 'cQiPUHgKBNg',
        duration: '12:15'
      },
      {
        title: 'Building Your First Portfolio',
        description: 'Strategies for creating a diversified starter portfolio',
        videoId: 'Kab5YNoqCZQ',
        duration: '10:37'
      }
    ]
  },
  {
    title: 'Technical Analysis',
    description: 'Master the art of analyzing stock price movements and patterns to predict future price movements',
    category: 'investing',
    icon: '📉',
    bgColor: 'from-purple-600 to-purple-900',
    modules: [
      {
        title: 'Support and Resistance Levels',
        description: 'Understanding key price levels that act as barriers to price movement',
        videoId: 'tkwUOCNmfxE',
        duration: '9:18'
      },
      {
        title: 'Trend Lines and Chart Patterns',
        description: 'Identifying and interpreting common chart formations',
        videoId: 'eynxyoKgpng',
        duration: '15:24'
      },
      {
        title: 'Moving Averages and Indicators',
        description: 'Using technical indicators to enhance your analysis',
        videoId: 'TL0sB-HGMWk',
        duration: '11:49'
      }
    ]
  },
  {
    title: 'Market Trends',
    description: 'Understand how market trends develop and how to position your investments accordingly',
    category: 'investing',
    icon: '📈',
    bgColor: 'from-green-600 to-green-900',
    modules: [
      {
        title: 'Bull vs Bear Markets',
        description: 'Understanding the characteristics of different market cycles',
        videoId: 'tKxgvY1z8eM',
        duration: '7:52'
      },
      {
        title: 'Sector Rotation',
        description: 'How different market sectors perform throughout economic cycles',
        videoId: 'fgI1DqUGFEM',
        duration: '10:05'
      }
    ]
  },
  {
    title: 'Stock Valuation',
    description: 'Learn various methods to determine whether a stock is overvalued or undervalued',
    category: 'investing',
    icon: '🔍',
    bgColor: 'from-yellow-600 to-yellow-900',
    modules: [
      {
        title: 'Price-to-Earnings Ratio',
        description: 'Understanding the most common valuation metric used by investors',
        videoId: 'cI8ZSf0nxFs',
        duration: '8:36'
      },
      {
        title: 'Discounted Cash Flow Analysis',
        description: 'Calculating the intrinsic value of a stock based on future cash flows',
        videoId: '8j9Sj8_SkPI',
        duration: '14:27'
      },
      {
        title: 'Comparative Valuation Methods',
        description: 'Using industry comparisons to evaluate stock prices',
        videoId: 'NQ2WrVua6mg',
        duration: '9:55'
      }
    ]
  },
  {
    title: 'Financial News Impact',
    description: 'Understand how news events affect financial markets and how to interpret market reactions',
    category: 'market-analysis',
    icon: '📰',
    bgColor: 'from-red-600 to-red-900',
    modules: [
      {
        title: 'Economic Indicators',
        description: 'Key economic reports and how they move markets',
        videoId: 'iKxFysXmCPo',
        duration: '11:03'
      },
      {
        title: 'Earnings Reports',
        description: 'How to read quarterly earnings reports and understand their impact',
        videoId: 'W-NbQJJgfSA',
        duration: '9:48'
      }
    ]
  },
  {
    title: 'Banking Services',
    description: 'Discover the range of banking products and services available and how to use them effectively',
    category: 'banking',
    icon: '🏦',
    bgColor: 'from-indigo-600 to-indigo-900',
    modules: [
      {
        title: 'Types of Bank Accounts',
        description: 'Understanding checking, savings, and other account types',
        videoId: 'YHYj87sr7Ws',
        duration: '7:16'
      },
      {
        title: 'Loans and Credit Products',
        description: 'Navigating the world of loans, credit cards, and lines of credit',
        videoId: 'S9pCGB7XD1U',
        duration: '12:30'
      },
      {
        title: 'Digital Banking Tools',
        description: 'Maximizing the benefits of online and mobile banking',
        videoId: 'v2jxhmXGX9Y',
        duration: '8:42'
      }
    ]
  },
  {
    title: 'Credit Risk',
    description: 'Learn how to analyze credit risk and understand factors that predict default probability',
    category: 'banking',
    icon: '⚠️',
    bgColor: 'from-orange-600 to-orange-900',
    modules: [
      {
        title: 'Credit Scores Explained',
        description: 'Understanding what goes into your credit score and how to improve it',
        videoId: 'Vn9ounAgG3w',
        duration: '10:14'
      },
      {
        title: 'Debt-to-Income Ratios',
        description: 'The key metrics lenders use to evaluate borrowers',
        videoId: 'k-VS_ZpH-Gg',
        duration: '7:55'
      }
    ]
  },
  {
    title: 'Index Analysis',
    description: 'Understanding market indices, their composition, and what they tell us about the market',
    category: 'market-analysis',
    icon: '📋',
    bgColor: 'from-teal-600 to-teal-900',
    modules: [
      {
        title: 'Major Market Indices',
        description: 'Understanding the S&P 500, Dow Jones, NASDAQ, and other key indices',
        videoId: 'vGZlwWrD-JI',
        duration: '9:37'
      },
      {
        title: 'Index Investing Strategies',
        description: 'How to build a portfolio based on index investing',
        videoId: 'Kic2X9glKX0',
        duration: '13:22'
      },
      {
        title: 'Index Weighting Methodologies',
        description: 'How different indices are calculated and what it means for investors',
        videoId: 'Y8hVrw1QGTk',
        duration: '8:50'
      }
    ]
  },
  {
    title: 'Sector Distribution',
    description: 'Learn about different industry sectors, their characteristics, and market representation',
    category: 'market-analysis',
    icon: '🏭',
    bgColor: 'from-pink-600 to-pink-900',
    modules: [
      {
        title: 'The 11 Market Sectors',
        description: 'An overview of the major market sectors and their key characteristics',
        videoId: 'tTMxO5jBqFk',
        duration: '11:28'
      },
      {
        title: 'Cyclical vs Defensive Sectors',
        description: 'Understanding how different sectors perform in various economic conditions',
        videoId: 'qHrQ5DP9W2c',
        duration: '9:42'
      }
    ]
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully to MongoDB');

    // Clear existing data
    console.log('Clearing existing courses...');
    await Course.deleteMany({});
    console.log('Existing courses cleared');

    // Insert new data
    console.log('Inserting new courses...');
    const result = await Course.insertMany(coursesData);
    console.log(`Successfully inserted ${result.length} courses`);

    // Log inserted courses
    console.log('\nInserted Courses:');
    result.forEach((course, index) => {
      console.log(`${index + 1}. ${course.title} (${course.category})`);
    });

    console.log('\nDatabase seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

// Run the seeding function
seedDatabase();