import express from 'express';
import { body } from 'express-validator';
import { 
  getExpenses, 
  getExpense, 
  createExpense, 
  updateExpense, 
  deleteExpense 
} from '../controllers/expense.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Protect all routes
router.use(protect);

// Get all expenses
router.get('/', getExpenses);

// Get single expense
router.get('/:id', getExpense);

// Create expense
router.post(
  '/',
  [
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('date').optional().isISO8601().toDate().withMessage('Invalid date format')
  ],
  createExpense
);

// Update expense
router.put(
  '/:id',
  [
    body('amount').optional().isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
    body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('date').optional().isISO8601().toDate().withMessage('Invalid date format')
  ],
  updateExpense
);

// Delete expense
router.delete('/:id', deleteExpense);

export default router;
