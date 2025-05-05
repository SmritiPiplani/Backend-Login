import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendOtpEmail } from '../middlewares/emailConfig.js';

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
    console.error('Register error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

// SEND OTP
export const sendOtp = async (req, res) => {
    try {
      const { email } = req.body;
  
      // 1. Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000);
  
<<<<<<< HEAD
      // 2. Set OTP expiration time to 2 minutes from now
      const otpExpiration = new Date(Date.now() + 2 * 60 * 1000); // 5 minutes
=======
      // 2. Set OTP expiration time 
      const otpExpiration = new Date(Date.now() + 2 * 60 * 1000); 
>>>>>>> 3fc82d0a93ab97e60458b9e87ed0ad78ccfc70a1
  
      // 3. Store OTP and expiration date
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
  
      //  Send OTP email
      await sendOtpEmail(email, otp);
  
     
      res.status(200).json({
        message: 'OTP sent successfully!',
        otpExpiration: otpExpiration.toLocaleString(),
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

    
    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();

    const token = jwt.sign({ email: user.email , role: user.role  }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

<<<<<<< HEAD
    res.cookie('token', token, { httpOnly: true ,secure:false });
=======
    res.cookie('token', token, { httpOnly: true });
>>>>>>> 3fc82d0a93ab97e60458b9e87ed0ad78ccfc70a1
    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Verify OTP error:', error);
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

<<<<<<< HEAD
    
=======
    res.cookie('token', token, { httpOnly: true });
>>>>>>> 3fc82d0a93ab97e60458b9e87ed0ad78ccfc70a1
    res.status(200).json({ message: 'Logged in successfully' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

export const logout = (req, res) => {
    try {
      // Clear the token cookie
<<<<<<< HEAD
      res.clearCookie('token', { httpOnly: true,secure: false}); 
=======
      res.clearCookie('token', { httpOnly: true }); 
>>>>>>> 3fc82d0a93ab97e60458b9e87ed0ad78ccfc70a1
      
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error logging out' });
    }
  };
<<<<<<< HEAD
export const protectedRoute = (req, res) => {
  res.status(200).json({ message: 'protected route', user: req.user });
  };
=======
  
>>>>>>> 3fc82d0a93ab97e60458b9e87ed0ad78ccfc70a1
