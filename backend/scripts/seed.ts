import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../src/models/User';
import { Wishlist } from '../src/models/Wishlist';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wishlist-app';
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Wishlist.deleteMany({});
    
    console.log('Cleared existing data');

    // Create demo users
    const hashedPassword = await bcrypt.hash('demo123', 10);
    
    const jayesh = await User.create({
      username: 'jayesh',
      email: 'jayesh@example.com',
      password: hashedPassword,
    });

    const johnUser = await User.create({
      username: 'john_doe',
      email: 'john@example.com',
      password: hashedPassword,
    });

    const janeUser = await User.create({
      username: 'jane_smith',
      email: 'jane@example.com',
      password: hashedPassword,
    });

    console.log('Created demo users');

    // Create demo wishlists
    const techWishlist = await Wishlist.create({
      title: 'Tech Gadgets 2025',
      description: 'Latest tech gadgets I want to buy this year',
      owner: jayesh._id,
      collaborators: [johnUser._id],
      isPublic: true,
      products: [
        {
          name: 'iPhone 16 Pro',
          description: 'Latest iPhone with amazing camera',
          price: 999.99,
          imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
          url: 'https://apple.com/iphone',
          category: 'Electronics',
          priority: 'high',
          addedBy: jayesh._id,
          addedAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'MacBook Air M3',
          description: 'Powerful laptop for development',
          price: 1299.99,
          imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
          url: 'https://apple.com/macbook-air',
          category: 'Computers',
          priority: 'medium',
          addedBy: johnUser._id,
          addedAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'AirPods Pro 2',
          description: 'Noise cancelling wireless earbuds',
          price: 249.99,
          imageUrl: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c5da6e?w=400',
          url: 'https://apple.com/airpods-pro',
          category: 'Audio',
          priority: 'low',
          addedBy: jayesh._id,
          addedAt: new Date(),
          updatedAt: new Date(),
        }
      ]
    });

    const booksWishlist = await Wishlist.create({
      title: 'Programming Books',
      description: 'Must-read books for software developers',
      owner: johnUser._id,
      collaborators: [jayesh._id, janeUser._id],
      isPublic: false,
      products: [
        {
          name: 'Clean Code',
          description: 'A Handbook of Agile Software Craftsmanship',
          price: 35.99,
          imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
          url: 'https://amazon.com/clean-code',
          category: 'Books',
          priority: 'high',
          addedBy: johnUser._id,
          addedAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'System Design Interview',
          description: 'An insider\'s guide to system design interviews',
          price: 29.99,
          imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
          url: 'https://amazon.com/system-design',
          category: 'Books',
          priority: 'medium',
          addedBy: janeUser._id,
          addedAt: new Date(),
          updatedAt: new Date(),
        }
      ]
    });

    const homeWishlist = await Wishlist.create({
      title: 'Home Improvement',
      description: 'Items for making our home better',
      owner: janeUser._id,
      collaborators: [],
      isPublic: true,
      products: [
        {
          name: 'Robot Vacuum',
          description: 'Smart vacuum cleaner with mapping',
          price: 399.99,
          imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
          category: 'Home',
          priority: 'medium',
          addedBy: janeUser._id,
          addedAt: new Date(),
          updatedAt: new Date(),
        }
      ]
    });

    console.log('Created demo wishlists');
    console.log('\nDemo data seeded successfully!');
    console.log('\nDemo accounts:');
    console.log('Email: jayesh@example.com, Password: demo123');
    console.log('Email: john@example.com, Password: demo123');
    console.log('Email: jane@example.com, Password: demo123');
    
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

const main = async () => {
  await connectDB();
  await seedData();
  await mongoose.disconnect();
  console.log('\nDatabase seeding completed');
  process.exit(0);
};

main();
