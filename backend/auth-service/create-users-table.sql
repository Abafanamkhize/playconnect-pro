-- Connect to PostgreSQL as postgres user first: sudo -u postgres psql -d playconnect

-- Create the users table manually
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('federation', 'scout', 'admin')),
    federationId UUID,
    isActive BOOLEAN DEFAULT true,
    lastLogin TIMESTAMP WITH TIME ZONE,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_federation ON users("federationId");
CREATE INDEX idx_users_active ON users("isActive");

-- Grant permissions to the application user
GRANT ALL PRIVILEGES ON TABLE users TO playconnect_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO playconnect_user;

-- Insert a test admin user (password: admin123)
INSERT INTO users (email, password, role) VALUES (
  'admin@playconnect.com',
  '$2b$12$LQv3c1yqBWVHrnW7V4JkE.F6g5UcR7Q8a9bZ1Yc3d2e4f5g6h7i8j9',  -- bcrypt hash of 'admin123'
  'admin'
) ON CONFLICT (email) DO NOTHING;
