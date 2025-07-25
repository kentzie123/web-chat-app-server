const pool = require('../lib/db');
const bcrypt = require('bcryptjs');
const {generateToken} = require('../lib/utils');

const signUp = async (req, res) => {
    const { email, fullname, password } = req.body;

    if(!email || !fullname || !password){
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    if(password.length < 6){
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    try{
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if(existingUser.rowCount > 0 ){
            return res.status(400).json({ error: 'Email already exist.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const result = await pool.query(
            `INSERT INTO users (email, full_name, password) 
            VALUES ($1, $2, $3) RETURNING *`,
            [email, fullname, hashedPassword]
        );

        const userId = result.rows[0].id

        generateToken(userId, res);

        res.status(201).json(result.rows[0]);
        
    } catch(err){
        console.log("Error in signup controller", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        return res.status(400).json({ error: 'Please fill in required fields.' })
    }

    try{
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if(!existingUser.rowCount === 0){
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.rows[0].password);
        if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid credentials" });
        }

        const userId = existingUser.rows[0].id;

        generateToken(userId, res);

        res.status(200).json({
            id: existingUser.rows[0].id,
            fullname: existingUser.rows[0].full_name,
            email: existingUser.rows[0].email,
            profilePic: existingUser.rows[0].profile_pic
        });

    }catch(err){
        console.log("Error in login controller", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
    signUp,
    login,
    logout
}