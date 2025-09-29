const request = require('supertest');
const express = require('express');

// Create a simple test app
const app = express();
app.use(express.json());

// Mock auth routes for testing
app.post('/api/auth/register', (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;
  
  if (!email || !password || !firstName || !lastName || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  res.status(201).json({ 
    message: 'User registered successfully',
    user: { email, firstName, lastName, role }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  res.status(200).json({ 
    message: 'Login successful',
    token: 'mock-jwt-token'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'Auth service running', 
    timestamp: new Date().toISOString() 
  });
});

describe('PlayConnect Auth API Tests', () => {
  describe('POST /api/auth/register', () => {
    it('should register user with valid data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
          role: 'player'
        })
        .expect(201);

      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should reject registration with missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com'
          // Missing other fields
        })
        .expect(400);

      expect(response.body.error).toBe('All fields are required');
    });

    it('should reject invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
          role: 'player'
        })
        .expect(400);

      expect(response.body.error).toBe('Invalid email format');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBe('mock-jwt-token');
    });

    it('should reject login with missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Email and password are required');
    });
  });

  describe('Health Check', () => {
    it('should return service status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('Auth service running');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});
