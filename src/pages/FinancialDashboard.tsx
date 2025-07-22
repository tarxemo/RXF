import { useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  PROFITABILITY_ANALYSIS,
  EXPENSE_BREAKDOWN,
  SALES_ANALYSIS
} from '../api/queries';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { useToast } from '../components/ui/use-toast';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function FinancialDashboard() {
  const { addToast } = useToast();
  const [period, setPeriod] = useState('month');
  const [farmId, setFarmId] = useState('');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  // Fetch data
  const { data: profitabilityData, loading: profitabilityLoading } = useQuery(PROFITABILITY_ANALYSIS, {
    variables: { period, farmId },
    onError: (error) => {
      addToast({ title: 'Error loading profitability data', description: error.message, variant: 'destructive' });
    },
  });

  const { data: expenseData, loading: expenseLoading } = useQuery(EXPENSE_BREAKDOWN, {
    variables: { period, farmId },
    onError: (error) => {
      addToast({ title: 'Error loading expense data', description: error.message, variant: 'destructive' });
    },
  });

  const { data: salesData, loading: salesLoading } = useQuery(SALES_ANALYSIS, {
    variables: { 
      startDate: dateRange.start,
      endDate: dateRange.end,
      farmId 
    },
    onError: (error) => {
      addToast({ title: 'Error loading sales data', description: error.message, variant: 'destructive' });
    },
  });

  // Prepare chart data
  const profitabilityChartData = {
    labels: profitabilityData?.profitabilityAnalysis?.map((item: { period: any; }) => item.period) || [],
    datasets: [
      {
        label: 'Sales',
        data: profitabilityData?.profitabilityAnalysis?.map((item: { totalSales: any; }) => item.totalSales) || [],
        backgroundColor: '#4CAF50',
      },
      {
        label: 'Expenses',
        data: profitabilityData?.profitabilityAnalysis?.map((item: { totalExpenses: any; }) => item.totalExpenses) || [],
        backgroundColor: '#F44336',
      },
      {
        label: 'Profit',
        data: profitabilityData?.profitabilityAnalysis?.map((item: { profit: any; }) => item.profit) || [],
        backgroundColor: '#FF9800',
      },
    ],
  };

  const expenseChartData = {
    labels: expenseData?.expenseBreakdown?.map((item: { expenseType: any; }) => item.expenseType) || [],
    datasets: [
      {
        data: expenseData?.expenseBreakdown?.map((item: { totalAmount: any; }) => item.totalAmount) || [],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  const salesChartData = {
    labels: salesData?.salesAnalysis?.salesByProduct?.map((item: { productName: any; }) => item.productName) || [],
    datasets: [
      {
        label: 'Sales by Product',
        data: salesData?.salesAnalysis?.salesByProduct?.map((item: { totalAmount: any; }) => item.totalAmount) || [],
        backgroundColor: '#4CAF50',
      },
    ],
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Financial Dashboard</h1>
        <div className="flex space-x-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Daily</SelectItem>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
            </SelectContent>
          </Select>

          <Select value={farmId} onValueChange={setFarmId}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Farms" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="all">All Farms</SelectItem>
              {/* You would map through farms here if you had them */}
              <SelectItem value="farm1">Farm 1</SelectItem>
              <SelectItem value="farm2">Farm 2</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex space-x-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="border rounded-md px-3 py-2"
            />
            <span>to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="border rounded-md px-3 py-2"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${salesData?.salesAnalysis?.totalSales?.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {salesData?.salesAnalysis?.totalTransactions || '0'} transactions
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              ${profitabilityData?.profitabilityAnalysis?.reduce((sum: any, item: { totalExpenses: any; }) => sum + item.totalExpenses, 0)?.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Last {period}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${
              profitabilityData?.profitabilityAnalysis?.reduce((sum: any, item: { profit: any; }) => sum + item.profit, 0) >= 0 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              ${profitabilityData?.profitabilityAnalysis?.reduce((sum: any, item: { profit: any; }) => sum + item.profit, 0)?.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Last {period}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profitability Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            {profitabilityLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400"></div>
              </div>
            ) : (
              <Bar 
                data={profitabilityChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                }}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {expenseLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400"></div>
              </div>
            ) : (
              <Pie 
                data={expenseChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                  },
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales by Product</CardTitle>
        </CardHeader>
        <CardContent>
          {salesLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400"></div>
            </div>
          ) : (
            <Bar 
              data={salesChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}