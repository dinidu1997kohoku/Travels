-- Create users table for admin/staff management
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy: only authenticated users can read users
CREATE POLICY "Users can read all users" ON users FOR SELECT USING (true);

-- Create policy: only authenticated users can insert users
CREATE POLICY "Users can insert users" ON users FOR INSERT WITH CHECK (true);

-- Create policy: only authenticated users can update users
CREATE POLICY "Users can update users" ON users FOR UPDATE USING (true);

-- Create policy: only authenticated users can delete users
CREATE POLICY "Users can delete users" ON users FOR DELETE USING (true);

-- Insert default admin user (password: serendib2026)
INSERT INTO users (name, email, password, role) VALUES ('Owner', 'admin@serendibtrails.com', 'serendib2026', 'admin');
