-- Create waitlist_users table
CREATE TABLE waitlist_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source TEXT DEFAULT 'landing_page'
);

-- Create index on email for faster lookups
CREATE INDEX idx_waitlist_users_email ON waitlist_users(email);

-- Create index on created_at for analytics
CREATE INDEX idx_waitlist_users_created_at ON waitlist_users(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE waitlist_users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anonymous users
CREATE POLICY "Allow anonymous inserts" ON waitlist_users
    FOR INSERT WITH CHECK (true);

-- Create policy to allow reads for counting (optional, for public count display)
CREATE POLICY "Allow public count" ON waitlist_users
    FOR SELECT USING (true);