import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import AuthRouter from './routes/Auth.js';
import { seedAdmin } from './seedAdmin.js';


dotenv.config();
const app = express();

// Middleware setup
app.use(express.json());  // For parsing JSON bodies
app.use(cookieParser());  // For parsing cookies

// Routes setup
app.use('/api/auth', AuthRouter);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));
    
await seedAdmin();
// Server Setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
