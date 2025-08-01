import express from 'express';
const router = express.Router();

// Controller
import { sendMessage, getMessages } from '../controllers/messages.controller.js';

// Middleware
import { verifyToken } from '../middleware/verifyToken.js';

router.post('/:id', verifyToken, sendMessage);
router.get('/get/:receiver_id', verifyToken, getMessages);

export default router;