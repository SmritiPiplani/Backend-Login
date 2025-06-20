import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendOtpEmail } from '../middlewares/emailConfig.js';
import logger from '../utils/logger.js';

// REGISTER NEW USER
export const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'User already exists!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    logger.error('Register error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

// SEND OTP
export const sendOtp = async (req, res) => {
    try {
      const { email } = req.body;
  
      // 1. Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000);
  

// 2. Set OTP expiration time to 2 minutes from now
const otpExpiration = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
  
      // 3. Store OTP and expiration date in MongoDB
      let user = await User.findOne({ email });
      if (!user) {
        // Create a new user if it doesn't exist
        user = await User.create({ email, otp, otpExpiration });
      } else {
        // Update user with OTP and expiration date if they already exist
        user.otp = otp;
        user.otpExpiration = otpExpiration;
        await user.save();
      }
  
      // 4. Send OTP email
      await sendOtpEmail(email, otp);
  
      // 5. Send success response with OTP expiration in human-readable format
      res.status(200).json({
        message: 'OTP sent successfully!',
        otpExpiration: otpExpiration.toLocaleString(), // Display expiration in human-readable format
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to send OTP', error });
    }
  };
// VERIFY OTP
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpiration < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

  await User.updateOne(
    { email },
    { $unset: { otp: 1, otpExpiration: 1 } }
  );

    const token = jwt.sign({ email: user.email , role: user.role  }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

res.cookie('token', token, { httpOnly: true, secure: false });
    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    logger.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials!' });
    }

    const token = jwt.sign({ userId: user._id ,role: user.role}, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

res.cookie('token', token, { httpOnly: true, secure: false });
    res.status(200).json({ message: 'Logged in successfully' });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

export const logout = (req, res) => {
    try {
      // Clear the token cookie
res.clearCookie('token', { httpOnly: true, secure: false }); 
      
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error logging out' });
    }
  };

export const protectedRoute = (req, res) => {
  res.status(200).json({ message: 'protected route', user: req.user });
};



export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -otp -otpExpiration'); // hide sensitive data
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get users', error });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err });
  }
}; 

export const blockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: true },
      { new: true }
    );
    res.status(200).json({ message: 'User blocked', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to block user' });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: false },
      { new: true }
    );
    res.status(200).json({ message: 'User unblocked', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to unblock user' });
  }
};

