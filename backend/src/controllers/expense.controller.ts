import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Expense from '../models/Expense';

// Get all expenses for a user
export const getExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    
    // Get query parameters
    const { startDate, endDate, category } = req.query;
    
    // Build query
    const query: any = { userId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate as string);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate as string);
      }
    }
    
    if (category) {
      query.category = category;
    }

    const expenses = await Expense.find(query).sort({ date: -1 });
    
    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'An error occurred while fetching expenses' });
  }
};

// Get a single expense
export const getExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid expense ID' });
      return;
    }

    const expense = await Expense.findOne({
      _id: id,
      userId
    });

    if (!expense) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }

    res.status(200).json(expense);
  } catch (error) {
    console.error('Error fetching expense:', error);
    res.status(500).json({ message: 'An error occurred while fetching the expense' });
  }
};

// Create a new expense
export const createExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: 'Invalid expense data', errors: errors.array() });
      return;
    }

    const userId = req.user.id;
    const { amount, category, description, date } = req.body;

    const newExpense = await Expense.create({
      userId,
      amount,
      category,
      description,
      date: new Date(date),
      createdAt: new Date()
    });

    res.status(201).json({
      message: 'Expense added successfully',
      expense: newExpense
    });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ message: 'An error occurred while adding the expense' });
  }
};

// Update an existing expense
export const updateExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: 'Invalid expense data', errors: errors.array() });
      return;
    }

    const userId = req.user.id;
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid expense ID' });
      return;
    }

    const updateData = req.body;
    
    // Verify ownership
    const existingExpense = await Expense.findOne({
      _id: id,
      userId
    });

    if (!existingExpense) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }

    // Update the expense
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );

    res.status(200).json({
      message: 'Expense updated successfully',
      expense: updatedExpense
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ message: 'An error occurred while updating the expense' });
  }
};

// Delete an expense
export const deleteExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid expense ID' });
      return;
    }

    // Verify ownership
    const expense = await Expense.findOne({
      _id: id,
      userId
    });

    if (!expense) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }

    // Delete the expense
    await Expense.findByIdAndDelete(id);

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'An error occurred while deleting the expense' });
  }
};
