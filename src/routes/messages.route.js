import express from 'express';
const router = express.Router();

// Controller
import { sendMessage, getMessages, loadMoreMessages } from '../controllers/messages.controller.js';

// Middleware
import { verifyToken } from '../middleware/verifyToken.js';

router.post('/:id', verifyToken, sendMessage);
router.get('/get/:receiver_id', verifyToken, getMessages);
router.get('/loadMore', verifyToken, loadMoreMessages);

export default router;