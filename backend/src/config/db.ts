import mongoose from 'mongoose';

export const isDbConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

export const connectDB = async (): Promise<void> => {
  try {
    mongoose.set('bufferCommands', false);
    const connStr = process.env.MONGODB_URI;
    const uri = connStr || 'mongodb+srv://vizdigitalofficial_db_user:VizDigital2026@cluster0.d9w8paw.mongodb.net/dmt_service_app?retryWrites=true&w=majority';

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host} / Database: ${conn.connection.name}`);
  } catch (error: any) {
    console.warn('⚠️ MongoDB Connection Note:', error.message || error);
    console.log('💡 Express REST API Server running in In-Memory High-Speed Mode (Fallback Store Active).');
  }
};
