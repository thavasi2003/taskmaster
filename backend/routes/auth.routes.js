import express from 'express';
import { login, register } from '../controllers/auth.controller.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', verifyAdmin, register);

export default router;