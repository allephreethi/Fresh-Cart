// middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // decode token
    req.user = decoded; // attach user info (id, email, etc.)
    next();
  } catch (err) {
    console.error('❌ Auth error:', err);
    res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = { authenticate };
