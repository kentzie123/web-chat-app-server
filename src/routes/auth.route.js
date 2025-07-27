import express from 'express';
const router = express.Router();

// Controllers
import { getAllUsers, signUp, login, logout } from '../controllers/auth.controller.js';

// Middleware
import { verifyToken } from '../middleware/verifyToken.js';


router.get('/getUsers', verifyToken, getAllUsers);
router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', logout);

export default router;
