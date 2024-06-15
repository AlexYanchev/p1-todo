import mongoose from 'mongoose';

async function connectDB() {
  await mongoose.connect('mongodb://127.0.0.1:27017/1p-todo');
}

export default connectDB;