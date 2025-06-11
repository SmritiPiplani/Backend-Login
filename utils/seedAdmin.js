import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import logger from './logger.js';

const seedAdmin = async () => {
  const existingAdmin = await User.findOne({ email: 'smritipiplani16@gmail.com' });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin1234', 10);
    await User.create({
      email: 'smritipiplani16@gmail.com',
      password: hashedPassword,
      role: 'admin',
    });
    logger.log('Admin user seeded');
  } else {
    console.log('Admin already exists');
  }
};
export default seedAdmin;
