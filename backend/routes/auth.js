const express = require('express');
const router = express.Router();
const { sql, config } = require('../config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const JWT_SECRET = 'your_jwt_secret'; // put this in env variables in prod
const SALT_ROUNDS = 10;

// Nodemailer transporter (using Gmail SMTP for example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com',
    pass: 'your_email_app_password', // Use app password or OAuth2
  },
});

// Signup
router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name)
    return res.status(400).json({ error: 'Name, email, and password are required' });

  try {
    const pool = await sql.connect(config);

    // Check if user exists
    const existingUser = await pool.request()
      .input('email', sql.VarChar(255), email)
      .query('SELECT * FROM Users WHERE email = @email');

    if (existingUser.recordset.length > 0)
      return res.status(400).json({ error: 'Email already registered' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert user with unverified email
    await pool.request()
      .input('name', sql.VarChar(100), name)
      .input('email', sql.VarChar(255), email)
      .input('password', sql.VarChar(255), hashedPassword)
      .input('isVerified', sql.Bit, 0)
      .query(`
        INSERT INTO Users (name, email, password, isVerified)
        VALUES (@name, @email, @password, @isVerified)
      `);

    // TODO: Send verification email here (optional)

    res.json({ message: 'Signup successful. Please verify your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  try {
    const pool = await sql.connect(config);

    const userResult = await pool.request()
      .input('email', sql.VarChar(255), email)
      .query('SELECT * FROM Users WHERE email = @email');

    if (userResult.recordset.length === 0)
      return res.status(400).json({ error: 'Invalid email or password' });

    const user = userResult.recordset[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword)
      return res.status(400).json({ error: 'Invalid email or password' });

    if (!user.isVerified)
      return res.status(403).json({ error: 'Email not verified' });

    // Create JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ message: 'Login successful', token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
