// 'use client';

// import { useState, useEffect } from 'react';
// import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { AnalyticsData } from '@/types';
// import { Skeleton } from '@/components/ui/skeleton';
// import { toast } from 'sonner';
// import { getCategoryLabel, formatCurrency, formatMonth } from '@/lib/utils';
// import axiosInstance from '@/lib/axios';

// const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

// export default function DashboardCharts() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

//   useEffect(() => {
//     const fetchAnalyticsData = async () => {
//       try {
//         setIsLoading(true);
//         const response = await axiosInstance.get('/analytics');
//         setAnalyticsData(response.data);
//       } catch (error) {
//         console.error('Error fetching analytics data:', error);
//         toast.error('Failed to load analytics data');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAnalyticsData();
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="space-y-6">
//         <Skeleton className="h-[400px] w-full rounded-lg" />
//       </div>
//     );
//   }

//   if (!analyticsData) {
//     return <div>No data available</div>;
//   }

//   // Format data for pie chart
//   const pieData = analyticsData.categoryExpenses.map((item) => ({
//     name: getCategoryLabel(item.category),
//     value: item.total,
//   }));

//   // Format data for bar chart
//   const barData = analyticsData.monthlyExpenses.map((item) => ({
//     name: formatMonth(item.month),
//     total: item.total,
//   }));

//   const CustomTooltip = ({ active, payload, label }: any) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-background p-3 border rounded-md shadow-md">
//           <p className="font-semibold">{`${label}`}</p>
//           <p>{`Amount: ${formatCurrency(payload[0].value)}`}</p>
//         </div>
//       );
//     }
//     return null;
//   };

//   const PieCustomTooltip = ({ active, payload }: any) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-background p-3 border rounded-md shadow-md">
//           <p className="font-semibold">{`${payload[0].name}`}</p>
//           <p>{`Amount: ${formatCurrency(payload[0].value)}`}</p>
//           <p>{`Percentage: ${((payload[0].value / analyticsData.totalExpense) * 100).toFixed(1)}%`}</p>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <Tabs defaultValue="category" className="space-y-4">
//       <TabsList>
//         <TabsTrigger value="category" className="transition-all duration-200">Category Breakdown</TabsTrigger>
//         <TabsTrigger value="monthly" className="transition-all duration-200">Monthly Expenses</TabsTrigger>
//       </TabsList>
      
//       <TabsContent value="category" className="space-y-4">
//         <Card className="shadow-md transition-all duration-300 hover:shadow-lg">
//           <CardHeader>
//             <CardTitle>Expenses by Category</CardTitle>
//             <CardDescription>
//               See how your spending is distributed across different categories
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="h-[400px] w-full">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={pieData}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     outerRadius={150}
//                     fill="#8884d8"
//                     dataKey="value"
//                     label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
//                     animationDuration={500}
//                     animationBegin={0}
//                     animationEasing="ease-out"
//                   >
//                     {pieData.map((entry, index) => (
//                       <Cell 
//                         key={`cell-${index}`} 
//                         fill={COLORS[index % COLORS.length]} 
//                         className="transition-all duration-200 hover:opacity-80"
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip content={<PieCustomTooltip />} />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>
//       </TabsContent>

//       <TabsContent value="monthly" className="space-y-4">
//         <Card className="shadow-md transition-all duration-300 hover:shadow-lg">
//           <CardHeader>
//             <CardTitle>Monthly Expenses</CardTitle>
//             <CardDescription>
//               Track your spending trends over time
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="h-[400px] w-full">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
//                   <XAxis 
//                     dataKey="name" 
//                     angle={-45} 
//                     textAnchor="end" 
//                     height={80} 
//                   />
//                   <YAxis tickFormatter={(value) => `₹${value}`} />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Bar 
//                     dataKey="total" 
//                     fill="hsl(var(--primary))" 
//                     className="transition-all duration-200 hover:opacity-80"
//                     radius={[4, 4, 0, 0]} 
//                     animationDuration={1000}
//                     animationBegin={0}
//                     animationEasing="ease-out"
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>
//       </TabsContent>
//     </Tabs>
//   );
// }



'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, Sector } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsData } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { getCategoryLabel, formatCurrency, formatMonth } from '@/lib/utils';
import axiosInstance from '@/lib/axios';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const renderActiveShape = (props: any) => {
  const {
    cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value,
  } = props;
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" className="fill-foreground font-semibold">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} className="fill-muted-foreground">
        {`Amount: ${formatCurrency(value)}`}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey + 20} textAnchor={textAnchor} className="fill-muted-foreground">
        {`(${(percent * 100).toFixed(1)}%)`}
      </text>
    </g>
  );
};

export default function DashboardCharts() {
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    );
  }

  if (!analyticsData) {
    return <div>No data available</div>;
  }

  const pieData = analyticsData.categoryExpenses.map((item) => ({
    name: getCategoryLabel(item.category),
    value: item.total,
  }));

  const barData = analyticsData.monthlyExpenses.map((item) => ({
    name: formatMonth(item.month),
    total: item.total,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-md shadow-md">
          <p className="font-semibold">{`${label}`}</p>
          <p>{`Amount: ${formatCurrency(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Tabs defaultValue="category" className="space-y-4">
      <TabsList>
        <TabsTrigger value="category" className="transition-all duration-200">Category Breakdown</TabsTrigger>
        <TabsTrigger value="monthly" className="transition-all duration-200">Monthly Expenses</TabsTrigger>
      </TabsList>

      <TabsContent value="category" className="space-y-4">
        <Card className="shadow-md transition-all duration-300 min-w-full w-[500px] hover:shadow-lg">
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription>
              See how your spending is distributed across different categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="monthly" className="space-y-4">
        <Card className="shadow-md transition-all w-full duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
            <CardDescription>
              Track your spending trends over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80} 
                  />
                  <YAxis tickFormatter={(value) => `₹${value}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="total" 
                    fill="hsl(var(--primary))" 
                    className="transition-all duration-200 hover:opacity-80"
                    radius={[4, 4, 0, 0]} 
                    animationDuration={1000}
                    animationBegin={0}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
