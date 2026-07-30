import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const connStr = process.env.MONGODB_URI;
    if (!connStr) {
      console.warn('⚠️ MONGODB_URI not found in environment variables. Using fallback Atlas connection.');
    }
    const uri = connStr || 'mongodb+srv://vizdigitalofficial_db_user:VizDigital2026@cluster0.d9w8paw.mongodb.net/dmt_service_app?retryWrites=true&w=majority';

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host} / Database: ${conn.connection.name}`);
  } catch (error: any) {
    console.warn('⚠️ MongoDB Connection Note:', error.message || error);
    console.log('💡 Express REST API Server is running on Port 5000. Update MONGODB_URI in backend/.env with your valid Atlas password when ready.');
  }
};
