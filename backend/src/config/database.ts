import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

const connectDB = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully (SQLite)');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    console.warn('⚠️  Continuando sem banco de dados');
  }
};

export default connectDB;
