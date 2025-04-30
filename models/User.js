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
    required: true, // Optional if you're supporting OTP-only login
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
