const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const oracledb = require('oracledb');
const { executeQuery } = require('../config/db');

exports.register = async (req, res) => {
  const { username, email, password, package: pkg } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required.' });
  }

  try {
    const existing = await executeQuery(
      'SELECT ID FROM USERS WHERE LOWER(EMAIL) = LOWER(:EMAIL)',
      { EMAIL: email.trim() }
    );

    if (existing && existing.length > 0) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await executeQuery(
      `INSERT INTO USERS (USERNAME, EMAIL, PASSWORD_HASH, PACKAGE, ROLE) 
       VALUES (:USERNAME, :EMAIL, :PASSWORD_HASH, :PACKAGE, 'client')
       RETURNING ID INTO :OUT_ID`,
      {
        USERNAME: username.trim(),
        EMAIL: email.trim(),
        PASSWORD_HASH: passwordHash,
        PACKAGE: pkg || '—',
        OUT_ID: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      }
    );

    const userId = result.outBinds.OUT_ID[0];
    const token = jwt.sign(
      { id: userId, email: email.trim(), role: 'client' }, 
      process.env.JWT_SECRET || 'secret_key', 
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      token,
      user: { id: userId, username: username.trim(), email: email.trim(), package: pkg || '—', role: 'client' }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const rows = await executeQuery(
      'SELECT ID, USERNAME, EMAIL, PASSWORD_HASH, PACKAGE, ROLE FROM USERS WHERE LOWER(EMAIL) = LOWER(:EMAIL)',
      { EMAIL: email.trim() }
    );

    if (!rows || rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const user = rows[0];

    if (!user.PASSWORD_HASH) {
      return res.status(500).json({ error: 'Password hash missing from DB.' });
    }

    const isMatch = await bcrypt.compare(password, user.PASSWORD_HASH);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.ID, email: user.EMAIL, role: user.ROLE },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      user: {
        id: user.ID,
        username: user.USERNAME,
        email: user.EMAIL,
        package: user.PACKAGE,
        role: user.ROLE
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};