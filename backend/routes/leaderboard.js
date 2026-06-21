import express from 'express';
import { getSupabase } from '../config/supabase.js';

const router = express.Router();

// Get Rankings
router.get('/', async (req, res) => {
  const supabase = getSupabase();
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('name, carbon_saved, profile_details')
      .order('carbon_saved', { ascending: false })
      .limit(50);

    if (error) throw error;

    res.json(users || []);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ message: 'Server error retrieving leaderboard rankings' });
  }
});

export default router;
