const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const secret = process.env.JWT_SECRET || 'secret_key';

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token has expired. Please login again.' });
      }
      return res.status(403).json({ error: 'Invalid or corrupted token.' });
    }

    req.user = decoded;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (req.user && req.user.role && req.user.role.toLowerCase() === 'admin') {
    next();
  } else {
    return res.status(403).json({ error: 'Access denied. Admin rights required.' });
  }
}

module.exports = { authenticateToken, requireAdmin };