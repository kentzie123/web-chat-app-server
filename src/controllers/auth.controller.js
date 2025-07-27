import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../config/utils.js';

// Register new user
export const signUp = async (req, res) => {
  const { email, fullname, password } = req.body;

  if (!email || !fullname || !password) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (existingUser.rowCount > 0) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      `INSERT INTO users (email, full_name, password)
       VALUES ($1, $2, $3)
       RETURNING id, email, full_name, profile_pic`,
      [email, fullname, hashedPassword]
    );

    const user = result.rows[0];
    generateToken(user.id, res);

    res.status(201).json(user);

  } catch (err) {
    console.error("Error in signUp:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login user
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please fill in required fields.' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rowCount === 0) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const user = result.rows[0];
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    generateToken(user.id, res);

    res.status(200).json({
      id: user.id,
      fullname: user.full_name,
      email: user.email,
      profilePic: user.profile_pic
    });

  } catch (err) {
    console.error("Error in login:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Logout user
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { httpOnly: true, maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully." });
  } catch (err) {
    console.error("Error in logout:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
