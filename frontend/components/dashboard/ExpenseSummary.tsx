'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, getCategoryLabel, formatDate } from '@/lib/utils';
import { AnalyticsData, Expense } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import axiosInstance from '@/lib/axios';
import { TrendingUp, TrendingDown, DollarSign, IndianRupeeIcon } from 'lucide-react';

interface ExpenseSummaryProps {
  analyticsData: AnalyticsData | null;
  isLoading: boolean;
}

export default function ExpenseSummary({ analyticsData, isLoading }: ExpenseSummaryProps) {
  // Get top category
  const topCategory = analyticsData?.categoryExpenses[0]?.category || 'N/A';
  
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <Card className="shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Expenses
          </CardTitle>
          <IndianRupeeIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-7 w-36" />
          ) : (
            <div className="text-2xl font-bold">
              {formatCurrency(analyticsData?.totalExpense || 0)}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Last 30 days
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Top Spending Category
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-7 w-36" />
          ) : (
            <div className="text-2xl font-bold">
              {getCategoryLabel(topCategory)}
            </div>
          )}
          <div className="text-xs text-muted-foreground">
            {isLoading ? (
              <Skeleton className="h-4 w-24 mt-1" />
            ) : (
              `${formatCurrency(analyticsData?.categoryExpenses[0]?.total || 0)} spent`
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Recent Activity
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-7 w-36" />
          ) : (
            <div className="text-2xl font-bold">
              {analyticsData?.recentExpenses.length || 0} Entries
            </div>
          )}
          <div className="text-xs text-muted-foreground">
            {isLoading ? (
              <Skeleton className="h-4 w-24 mt-1" />
            ) : analyticsData?.recentExpenses[0] ? (
              `Last entry: ${formatDate(analyticsData.recentExpenses[0].date)}`
            ) : (
              'No recent expenses'
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}