import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

// Load environment variables from .env
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env');
  process.exit(1);
}

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected to MongoDB.');

    // Seed Admin User
    console.log('Seeding admin user...');
    const adminPasswordPlain = '2KKc65sUh6xW34a9';
const adminPasswordHashed = await bcrypt.hash(adminPasswordPlain, 10);    
    await User.findOneAndUpdate(
      { email: 'admin@example.com' },
      {
        name: 'admin',
        email: 'admin@example.com',
        password: adminPasswordHashed
      },
      { upsert: true }
    );
    console.log('Admin user seeded successfully.');

    console.log('Seeding complete.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
