// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { sql, config } = require('./dbConfig'); // Your MSSQL config

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
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await sql.connect(config);

    // Check if email already exists
    const existingUser = await sql.query`
      SELECT * FROM Users WHERE Email = ${email}
    `;
    if (existingUser.recordset.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await sql.query`
      INSERT INTO Users (Name, Email, Password)
      VALUES (${name}, ${email}, ${hashedPassword})
    `;

    console.log(`✅ User ${email} registered`);
    res.json({ message: 'Signup successful' });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== LOGIN =====
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body; // plain text password from frontend
    console.log('🔑 Login request:', req.body);

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    await sql.connect(config);

    // Find user by email
    const userResult = await sql.query`
      SELECT * FROM Users WHERE Email = ${email}
    `;

    if (userResult.recordset.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = userResult.recordset[0];

    // Compare plain password with hashed password from DB
    const match = await bcrypt.compare(password, user.Password);
    if (!match) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    console.log(`✅ User ${email} logged in`);
    res.json({
      message: 'Login successful',
      user: { id: user.Id, name: user.Name, email: user.Email }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
