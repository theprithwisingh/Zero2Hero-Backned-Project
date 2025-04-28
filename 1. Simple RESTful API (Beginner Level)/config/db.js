import { connect } from 'mongoose';

 const connectDB = async () => {
  try {
    await connect('mongodb://localhost:27017/taskify');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database Connection Error:', error.message);
    process.exit(1); 
  }
};

export default connectDB;
