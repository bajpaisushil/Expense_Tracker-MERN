'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import RecentExpenses from '@/components/dashboard/RecentExpenses';
import ExpenseSummary from '@/components/dashboard/ExpenseSummary';
import { AnalyticsData } from '@/types';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axios';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/analytics');
        setAnalyticsData(response.data);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        toast.error('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  return (
    <div className="flex flex-col justify-center space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your spending habits and financial trends
        </p>
      </div>

      <ExpenseSummary analyticsData={analyticsData} isLoading={isLoading} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4 shadow-md overflow-auto transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Expense Analytics</CardTitle>
            <CardDescription>
              Visualize your spending patterns over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardCharts />
          </CardContent>
        </Card>
        
        <div className="lg:col-span-3">
          <RecentExpenses
            expenses={analyticsData?.recentExpenses || []}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
