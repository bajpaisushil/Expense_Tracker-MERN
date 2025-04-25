'use client';

import { Expense } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate, getCategoryLabel } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface RecentExpensesProps {
  expenses: Expense[];
  isLoading: boolean;
}

export default function RecentExpenses({ expenses, isLoading }: RecentExpensesProps) {
  return (
    <Card className="shadow-md transition-all overflow-auto duration-300 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Expenses</CardTitle>
          <CardDescription>Your most recent transactions</CardDescription>
        </div>
        <Link href="/expenses">
          <Button variant="outline" size="sm" className="gap-1 transition-all duration-200 hover:gap-2">
            View All <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        ) : expenses.length > 0 ? (
          <div className="space-y-4">
            {expenses.map((expense) => (
              <div key={expense._id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="space-y-1">
                  <p className="font-medium">{expense.description}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="mr-2">{getCategoryLabel(expense.category)}</span>
                    <span>•</span>
                    <span className="ml-2">{formatDate(expense.date)}</span>
                  </div>
                </div>
                <div className="font-medium">{formatCurrency(expense.amount)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No recent expenses found
          </div>
        )}
      </CardContent>
    </Card>
  );
}