import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import restaurantRoutes from './routes/restaurantRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import restaurantOwnerRoutes from './routes/restaurantOwnerRoutes.js';
import userRoutes from './routes/userRoutes.js';
dotenv.config();
const app = express();
// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
// Routes
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/restaurant-owners', restaurantOwnerRoutes);
app.use('/api/users', userRoutes);
// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_dining';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));
// Routes placeholder
app.get('/', (req, res) => {
    res.json({ message: 'Smart Dining API is running' });
});
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
