// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true, 
  },
  role: {
    type: String,
    enum: ['user', 'admin'], 
    default: 'user',
  },
  otp: {
    type: String,
    required: false,
  },
  otpExpiration: {
    type: Date,
    required: false,
  }
});

const User = mongoose.model('User', userSchema);
export default User;
