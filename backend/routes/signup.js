const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sql } = require('../config');

// ===== SIGNUP =====
router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await sql.connect();

    // Check if email exists
    const existingUser = await sql.query`SELECT * FROM Users WHERE Email = ${email}`;
    if (existingUser.recordset.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user with isVerified = 1
    const insertResult = await sql.query`
      INSERT INTO Users (Name, Email, Password, isVerified)
      VALUES (${name}, ${email}, ${hashedPassword}, 1);
      SELECT SCOPE_IDENTITY() AS userId;
    `;
    const newUserId = insertResult.recordset[0]?.userId;

    // Generate JWT token
    const token = jwt.sign({ id: newUserId, email }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1d' });

    res.json({
      message: 'Signup successful',
      user: { id: newUserId, name, email, isVerified: true },
      token
    });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
