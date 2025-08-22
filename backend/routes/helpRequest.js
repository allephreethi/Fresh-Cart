// routes/helpRequest.js
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { config } = require('../config'); // SQL Server config
const { authenticate } = require('../middleware/auth'); // JWT auth middleware

// ========================
// GET all help requests of the logged-in user
// ========================
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const pool = await sql.connect(config);

    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT * FROM help_requests WHERE user_id = @userId ORDER BY created_at DESC');

    res.json(result.recordset);
  } catch (err) {
    console.error('GET /api/help-request error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ========================
// POST create a new help request linked to the logged-in user
// ========================
router.post('/', authenticate, async (req, res) => {
  const { name, email, message } = req.body;
  if (!message || !name || !email) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  try {
    const userId = req.user.id;
    const pool = await sql.connect(config);

    await pool.request()
      .input('userId', sql.Int, userId)
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('message', sql.NVarChar, message)
      .query('INSERT INTO help_requests (user_id, name, email, message) VALUES (@userId, @name, @email, @message)');

    res.status(201).json({ message: 'Request submitted successfully' });
  } catch (err) {
    console.error('POST /api/help-request error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ========================
// DELETE a help request (only own request)
// ========================
router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const pool = await sql.connect(config);

    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('userId', sql.Int, userId)
      .query('DELETE FROM help_requests WHERE id = @id AND user_id = @userId');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Request not found or not authorized' });
    }

    res.json({ message: 'Request deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/help-request/:id error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
