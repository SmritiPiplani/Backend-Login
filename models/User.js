// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  otp: String,
  otpExpiration: Date
});

const User = mongoose.model('User', userSchema);
export default User;
