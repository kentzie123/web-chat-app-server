import express from 'express';
const router = express.Router();

// Controller
import { sendMessage } from '../controllers/messages.controller.js';

// Middleware
import { verifyToken } from '../middleware/verifyToken.js';

router.post('/:id', verifyToken, sendMessage);

export default router;