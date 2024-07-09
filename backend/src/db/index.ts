import mongoose from 'mongoose';

async function connectDB() {
  await mongoose.connect(String(process.env.DB_CONNECT));
}

export default connectDB;
