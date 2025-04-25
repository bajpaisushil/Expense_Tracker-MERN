export interface User {
    id: string;
    name: string;
    email: string;
  }
  
  export interface AuthUser {
    user: User;
    token: string;
  }
  
  export interface Expense {
    _id?: string;
    userId: string;
    amount: number;
    category: string;
    description: string;
    date: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  }
  
  export interface Category {
    name: string;
    value: string;
    color: string;
    icon?: string;
  }
  
  export interface MonthlyExpense {
    month: string;
    total: number;
  }
  
  export interface CategoryExpense {
    category: string;
    total: number;
  }
  
  export interface ExpenseFilters {
    startDate?: Date;
    endDate?: Date;
    category?: string;
    minAmount?: number;
    maxAmount?: number;
  }
  
  export interface AnalyticsData {
    totalExpense: number;
    categoryExpenses: CategoryExpense[];
    monthlyExpenses: MonthlyExpense[];
    recentExpenses: Expense[];
  }
  