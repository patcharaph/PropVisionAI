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

-- Generation logs for analytics
CREATE TABLE IF NOT EXISTS generation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  room_size TEXT CHECK (room_size IN ('S', 'M', 'L')),
  room_type TEXT,
  duration_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  api_cost DECIMAL(10, 6) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  user_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User feedback table
CREATE TABLE IF NOT EXISTS user_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  generation_id UUID,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_quota_lookup ON user_quota(user_id, date);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_user ON generation_jobs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generation_logs_created ON generation_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generation_logs_success ON generation_logs(success, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_feedback_rating ON user_feedback(rating, created_at DESC);

-- Row Level Security (RLS) policies
ALTER TABLE user_quota ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- Service role can do everything
CREATE POLICY "Service role full access on user_quota" ON user_quota
  FOR ALL USING (true);

CREATE POLICY "Service role full access on generation_jobs" ON generation_jobs
  FOR ALL USING (true);

CREATE POLICY "Service role full access on generation_logs" ON generation_logs
  FOR ALL USING (true);

CREATE POLICY "Service role full access on analytics_events" ON analytics_events
  FOR ALL USING (true);

CREATE POLICY "Service role full access on user_feedback" ON user_feedback
  FOR ALL USING (true);
