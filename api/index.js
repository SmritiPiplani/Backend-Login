// api/index.js
import express from 'express';
import dotenv from 'dotenv';
import serverless from 'serverless-http';
import seedAdmin from './utils/seedAdmin.js';
import authRoutes from './routes/Auth.js';
import adminRoutes from './routes/admin.js';
import blogRoutes from './routes/BlogRoutes.js';
import connectToDatabase from './utils/db.js';

dotenv.config();

const app = express();
app.use(express.json());

let isSeeded = false;

app.use(async (req, res, next) => {
  try {
    await connectToDatabase(process.env.MONGODB_URI);

    if (!isSeeded) {
      await seedAdmin();
      isSeeded = true;
    }

    next();
  } catch (error) {
    console.error('❌ DB connection or seeding error:', error);
    res.status(500).send('Internal Server Error: DB failed');
  }
});


// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blogs', blogRoutes);

// ✅ Export for Vercel serverless functions
export default serverless(app);
