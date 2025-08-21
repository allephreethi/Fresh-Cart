const express = require('express');
const router = express.Router();
const { sql, config } = require('../config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Make sure JWT_SECRET is in .env

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  let pool;
  try {
    pool = await sql.connect(config);
  } catch (dbErr) {
    console.error('DB connection failed:', dbErr.message);
    return res.status(500).json({ error: 'Database connection failed' });
  }

  let user;
  try {
    const result = await pool.request()
      .input('email', sql.NVarChar(255), email.trim())
      .query('SELECT id, name, email, password, isVerified FROM Users WHERE email=@email');

    user = result.recordset[0];
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
  } catch (queryErr) {
    console.error('SQL query failed:', queryErr.message);
    return res.status(500).json({ error: 'Database query failed' });
  }

  // Safety check: ensure password exists before bcrypt
  if (!user.password || typeof user.password !== 'string' || user.password.length < 20) {
    console.error('Invalid password hash in DB for user:', email);
    return res.status(500).json({ error: 'User password invalid. Please reset password.' });
  }

  let isPasswordValid;
  try {
    isPasswordValid = await bcrypt.compare(password, user.password);
  } catch (bcryptErr) {
    console.error('bcrypt.compare failed:', bcryptErr.message);
    return res.status(500).json({ error: 'Password comparison failed' });
  }

  if (!isPasswordValid) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  if (!user.isVerified) {
    return res.status(403).json({ error: 'Email not verified' });
  }

  let token;
  try {
    token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  } catch (jwtErr) {
    console.error('JWT generation failed:', jwtErr.message);
    return res.status(500).json({ error: 'Failed to generate token' });
  }

  res.json({
    message: 'Login successful',
    user: { id: user.id, name: user.name, email: user.email },
    token
  });
});

module.exports = router;
