const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { username, email, phone, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO users (username, email, phone, password) VALUES (?, ?, ?, ?)';
  db.query(query, [username, email, phone, hashedPassword], (err) => {
    if (err) return res.status(500).json({ message: err });
    res.status(200).json({ message: 'User registered successfully!' });
  });
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ?';

  db.query(query, [username], async (err, results) => {
    if (err) return res.status(500).json({ message: err });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, results[0].password);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: results[0].id }, 'secret', { expiresIn: '1h' });
    res.status(200).json({ token });
  });
});

module.exports = router;
