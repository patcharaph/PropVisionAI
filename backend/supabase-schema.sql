-- PropVisionAI Supabase Schema

-- User quota tracking table
CREATE TABLE IF NOT EXISTS user_quota (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  generations_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Generation jobs tracking table
CREATE TABLE IF NOT EXISTS generation_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  room_size TEXT CHECK (room_size IN ('S', 'M', 'L')),
  room_type TEXT,
  original_image_url TEXT,
  generated_image_url TEXT,
  cost_estimate JSONB,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Index for faster quota lookups
CREATE INDEX IF NOT EXISTS idx_user_quota_lookup ON user_quota(user_id, date);

-- Index for job status queries
CREATE INDEX IF NOT EXISTS idx_generation_jobs_user ON generation_jobs(user_id, created_at DESC);

-- Row Level Security (RLS) policies
ALTER TABLE user_quota ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_jobs ENABLE ROW LEVEL SECURITY;

-- Service role can do everything
CREATE POLICY "Service role full access on user_quota" ON user_quota
  FOR ALL USING (true);

CREATE POLICY "Service role full access on generation_jobs" ON generation_jobs
  FOR ALL USING (true);
