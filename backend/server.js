// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { sql, config } = require('./config'); // <-- adjust path if needed

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(bodyParser.json());

// ===== SIGNUP =====
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('📩 Signup data:', req.body);

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    await sql.connect(config);

    // Check if email exists
    let request = new sql.Request();
    const existingUser = await request
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM Users WHERE Email = @email');

    if (existingUser.recordset.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    request = new sql.Request();
    await request
      .input('name', sql.VarChar, name)
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, hashedPassword)
      .query(
        'INSERT INTO Users (Name, Email, Password) VALUES (@name, @email, @password)'
      );

    console.log(`✅ User ${email} registered successfully`);
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== LOGIN =====
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔑 Login request:', req.body);

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    await sql.connect(config);

    let request = new sql.Request();
    const userResult = await request
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM Users WHERE Email = @email');

    if (userResult.recordset.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = userResult.recordset[0];
    const hashedPassword = user.Password || user.password; // handle case sensitivity

    if (!hashedPassword) {
      console.error('❌ No password found in DB for this user');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    console.log(`✅ User ${email} logged in successfully`);
    res.json({
      message: 'Login successful',
      user: { id: user.Id, name: user.Name, email: user.Email }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
