// routes/helpRequest.js
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { config } = require('../config'); // your SQL Server config

// GET all help requests
router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM help_requests ORDER BY created_at DESC');
    res.json(result.recordset);
  } catch (err) {
    console.error('GET /api/help-request error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create a new request
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'All fields are required' });

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('message', sql.NVarChar, message)
      .query('INSERT INTO help_requests (name, email, message) VALUES (@name, @email, @message)');

    res.status(201).json({ message: 'Request submitted successfully' });
  } catch (err) {
    console.error('POST /api/help-request error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE a request by id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM help_requests WHERE id = @id');
    res.json({ message: 'Request deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/help-request/:id error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
