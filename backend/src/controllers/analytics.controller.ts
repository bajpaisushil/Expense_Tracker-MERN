import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Expense from '../models/Expense';

// Get analytics data
export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    
    // Get query parameters
    const { startDate: startDateParam, endDate: endDateParam } = req.query;
    
    // Default to last 30 days if not provided
    const startDate = startDateParam 
      ? new Date(startDateParam as string)
      : new Date(new Date().setDate(new Date().getDate() - 30));
    
    const endDate = endDateParam
      ? new Date(endDateParam as string)
      : new Date();

    // 1. Total expenses in the period
    const totalExpense = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // 2. Expenses by category
    const categoryExpenses = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      {
        $project: {
          category: '$_id',
          total: 1,
          _id: 0
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    // 3. Monthly expenses
    const monthlyExpenses = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          total: { $sum: '$amount' }
        }
      },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              {
                $cond: {
                  if: { $lt: ['$_id.month', 10] },
                  then: { $concat: ['0', { $toString: '$_id.month' }] },
                  else: { $toString: '$_id.month' }
                }
              }
            ]
          },
          total: 1
        }
      },
      {
        $sort: { month: 1 }
      }
    ]);

    // 4. Recent expenses (last 5)
    const recentExpenses = await Expense.find({ userId })
      .sort({ date: -1 })
      .limit(5);

    res.status(200).json({
      totalExpense: totalExpense.length > 0 ? totalExpense[0].total : 0,
      categoryExpenses,
      monthlyExpenses,
      recentExpenses
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'An error occurred while fetching analytics' });
  }
};
