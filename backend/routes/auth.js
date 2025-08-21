// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const { sql, config } = require('../config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const SALT_ROUNDS = 10;

// ===== SIGNUP =====
router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    const pool = await sql.connect(config);

    // Check if user exists
    const existingUser = await pool.request()
      .input('email', sql.VarChar(255), email)
      .query('SELECT * FROM Users WHERE email = @email');

    if (existingUser.recordset.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert user with isVerified = 1 for dev/testing
    const insertResult = await pool.request()
      .input('name', sql.VarChar(100), name)
      .input('email', sql.VarChar(255), email)
      .input('password', sql.VarChar(255), hashedPassword)
      .input('isVerified', sql.Bit, 1) // automatically verified
      .query(`
        INSERT INTO Users (name, email, password, isVerified)
        OUTPUT INSERTED.id
        VALUES (@name, @email, @password, @isVerified)
      `);

    const userId = insertResult.recordset[0].id;

    // Generate JWT token
    const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Signup successful',
      token,
      user: { id: userId, name, email, isVerified: true }
    });

  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== LOGIN =====
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const pool = await sql.connect(config);

    const userResult = await pool.request()
      .input('email', sql.VarChar(255), email)
      .query('SELECT * FROM Users WHERE email = @email');

    if (userResult.recordset.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = userResult.recordset[0];

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ error: 'Email not verified' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, isVerified: user.isVerified }
    });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
