const express = require('express');
const router = express.Router();

const { 
    signUp,
    login,
    logout
} = require('../controllers/auth.controller');

router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;