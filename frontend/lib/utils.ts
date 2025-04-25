import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-');
  return `${new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'short' })} ${year}`;
}

export function getCategoryLabel(value: string): string {
  const categories: Record<string, string> = {
    'food': 'Food & Dining',
    'transportation': 'Transportation',
    'entertainment': 'Entertainment',
    'utilities': 'Utilities',
    'shopping': 'Shopping',
    'health': 'Health & Medical',
    'travel': 'Travel',
    'education': 'Education',
    'housing': 'Housing',
    'other': 'Other',
  };
  
  return categories[value] || value;
}
