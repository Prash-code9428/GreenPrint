-- GreenPrint Supabase PostgreSQL Schema
-- Copy this script and paste it into the Supabase SQL Editor, then click "Run".

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  security_question TEXT NOT NULL,
  security_answer TEXT NOT NULL,
  carbon_saved NUMERIC DEFAULT 0,
  profile_details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Activities Table
CREATE TABLE IF NOT EXISTS activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'flight', 'vehicle', 'electricity', 'ac'
  details JSONB NOT NULL,
  co2_saved NUMERIC DEFAULT 0,
  co2_emitted NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) optional - for simple backend access we bypass RLS or write bypass policies.
-- Because our Node.js backend connects using secret service key or direct backend connections,
-- standard queries bypass RLS. For anon/public client side reads you can enable policies:
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
