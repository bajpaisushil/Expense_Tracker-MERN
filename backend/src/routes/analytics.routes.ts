import express from 'express';
import { getAnalytics } from '../controllers/analytics.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Protect all routes
router.use(protect);

// Get analytics
router.get('/', getAnalytics);

export default router;
