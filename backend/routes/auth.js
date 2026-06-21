import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getSupabase } from '../config/supabase.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'greenprint_jwt_secret_token_123';

// Middleware to verify JWT token
export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, securityQuestion, securityAnswer, profileDetails } = req.body;

  if (!name || !email || !password || !securityQuestion || !securityAnswer) {
    return res.status(400).json({ message: 'All registration fields are required' });
  }

  const supabase = getSupabase();

  try {
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password and security answer
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const hashedAnswer = await bcrypt.hash(securityAnswer.toLowerCase().trim(), salt);

    // Insert user
    const insertPayload = {
      name,
      email,
      password: hashedPassword,
      security_question: securityQuestion,
      security_answer: hashedAnswer,
      carbon_saved: 0,
      profile_details: profileDetails || {}
    };

    const { data: newUser, error } = await supabase
      .from('users')
      .insert([insertPayload]);

    if (error) throw error;

    // Fetch the created user to get the auto-generated id
    const { data: createdUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    const token = jwt.sign({ id: createdUser.id, email: createdUser.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        carbon_saved: createdUser.carbon_saved,
        profile_details: createdUser.profile_details
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  const supabase = getSupabase();

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Supabase query error during login:', error);
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        carbon_saved: parseFloat(user.carbon_saved || 0),
        profile_details: user.profile_details || {}
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get Profile
router.get('/profile', authenticateToken, async (req, res) => {
  const supabase = getSupabase();
  try {
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      carbon_saved: parseFloat(user.carbon_saved || 0),
      profile_details: user.profile_details || {},
      securityQuestion: user.security_question
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error retrieving profile' });
  }
});

// Update Profile details
router.put('/profile', authenticateToken, async (req, res) => {
  const { name, profileDetails, securityQuestion, securityAnswer } = req.body;
  const supabase = getSupabase();

  try {
    const updateData = {};
    if (name) updateData.name = name;
    if (profileDetails) updateData.profile_details = profileDetails;
    if (securityQuestion) updateData.security_question = securityQuestion;
    if (securityAnswer) {
      const salt = await bcrypt.genSalt(10);
      updateData.security_answer = await bcrypt.hash(securityAnswer.toLowerCase().trim(), salt);
    }

    await supabase
      .from('users')
      .update(updateData)
      .eq('id', req.user.id);

    const { data: updatedUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        carbon_saved: parseFloat(updatedUser.carbon_saved || 0),
        profile_details: updatedUser.profile_details || {},
        securityQuestion: updatedUser.security_question
      }
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// Forgot Password - Step 1: Get Security Question
router.post('/forgot-password/question', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const supabase = getSupabase();
  try {
    const { data: user } = await supabase
      .from('users')
      .select('security_question')
      .eq('email', email)
      .single();

    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    res.json({ securityQuestion: user.security_question });
  } catch (err) {
    res.status(500).json({ message: 'Server error retrieving security question' });
  }
});

// Forgot Password - Step 2: Verify Answer and Reset Password
router.post('/forgot-password/reset', async (req, res) => {
  const { email, securityAnswer, newPassword } = req.body;

  if (!email || !securityAnswer || !newPassword) {
    return res.status(400).json({ message: 'Email, answer, and new password are required' });
  }

  const supabase = getSupabase();
  try {
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (!user) {
      return res.status(404).json({ message: 'No account found' });
    }

    // Compare answer
    const isAnswerCorrect = await bcrypt.compare(
      securityAnswer.toLowerCase().trim(),
      user.security_answer
    );

    if (!isAnswerCorrect) {
      return res.status(400).json({ message: 'Incorrect answer to security question' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('email', email);

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ message: 'Server error resetting password' });
  }
});

export default router;
