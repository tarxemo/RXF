import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'

import { Bar, Line, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js'
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { useToast } from '../components/ui/use-toast'
import { Select } from '../components/ui/select'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

export default function ReportsPage() {
  const { addToast } = useToast()
  const [timeRange, setTimeRange] = useState('month')
  const [farmId, setFarmId] = useState('')

  // Fetch data for reports
  const { data: profitabilityData, loading: profitabilityLoading } = useQuery(gql`
    query ProfitabilityReport($period: String, $farmId: ID) {
      profitabilityAnalysis(period: $period, farmId: $farmId) {
        period
        totalSales
        totalExpenses
        profit
      }
    }
  `, {
    variables: { period: timeRange, farmId: farmId || null },
    onError: (error) => {
      addToast({ title: 'Error loading profitability data', description: error.message, variant: 'destructive' })
    },
  })

  const { data: expenseData, loading: expenseLoading } = useQuery(gql`
    query ExpenseReport($period: String, $farmId: ID) {
      expenseBreakdown(period: $period, farmId: $farmId) {
        expenseType
        totalAmount
        percentage
      }
    }
  `, {
    variables: { period: timeRange, farmId: farmId || null },
    onError: (error) => {
      addToast({ title: 'Error loading expense data', description: error.message, variant: 'destructive' })
    },
  })

  const { data: productionData, loading: productionLoading } = useQuery(gql`
    query ProductionReport($period: String, $farmId: ID) {
      productionTrends(period: $period, farmId: $farmId) {
        period
        productName
        totalQuantity
      }
    }
  `, {
    variables: { period: timeRange, farmId: farmId || null },
    onError: (error) => {
      addToast({ title: 'Error loading production data', description: error.message, variant: 'destructive' })
    },
  })

  // Prepare chart data
  const profitabilityChartData = {
    labels: profitabilityData?.profitabilityAnalysis?.map((item: { period: any }) => item.period) || [],
    datasets: [
      {
        label: 'Sales',
        data: profitabilityData?.profitabilityAnalysis?.map((item: { totalSales: any }) => item.totalSales) || [],
        backgroundColor: '#4CAF50',
      },
      {
        label: 'Expenses',
        data: profitabilityData?.profitabilityAnalysis?.map((item: { totalExpenses: any }) => item.totalExpenses) || [],
        backgroundColor: '#F44336',
      },
      {
        label: 'Profit',
        data: profitabilityData?.profitabilityAnalysis?.map((item: { profit: any }) => item.profit) || [],
        backgroundColor: '#FF9800',
      },
    ],
  }

  const expenseChartData = {
    labels: expenseData?.expenseBreakdown?.map((item: { expenseType: string; percentage: number }) => {
      const type = [
        { value: 'FEED', label: 'Animal Feed' },
        { value: 'SEEDS', label: 'Seeds' },
        { value: 'FERTILIZER', label: 'Fertilizer' },
        { value: 'LABOR', label: 'Labor' },
        { value: 'VET', label: 'Veterinary' },
        { value: 'EQUIPMENT', label: 'Equipment' },
        { value: 'MAINTENANCE', label: 'Maintenance' },
        { value: 'OTHER', label: 'Other' },
      ].find(t => t.value === item.expenseType)?.label || item.expenseType
      return `${type} (${item.percentage.toFixed(1)}%)`
    }) || [],
    datasets: [
      {
        data: expenseData?.expenseBreakdown?.map((item: { totalAmount: any }) => item.totalAmount) || [],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#8AC24A',
          '#607D8B',
        ],
      },
    ],
  }

  const productionChartData = {
    labels: productionData?.productionTrends?.map((item: { period: any }) => item.period) || [],
    datasets: [
      {
        label: 'Production Quantity',
        data: productionData?.productionTrends?.map((item: { totalQuantity: any }) => item.totalQuantity) || [],
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        fill: true,
      },
    ],
  }

  // Fetch farms for filter
  const { data: farmsData } = useQuery(gql`
    query ListFarmsForReport {
      allFarms {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  `)

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Farm Reports</h1>
        <div className="flex space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
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
              <SelectItem value="">All Farms</SelectItem>
              {farmsData?.allFarms?.map(( farm: any ) => (
                <SelectItem key={farm.id} value={farm.id ?? ""}>{farm.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
                    title: {
                      display: true,
                      text: 'Sales, Expenses, and Profit Over Time',
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

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Production Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {productionLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400"></div>
              </div>
            ) : (
              <Line 
                data={productionChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Production Quantity Over Time',
                    },
                  },
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#4CAF50]">
              {profitabilityData?.profitabilityAnalysis?.reduce((sum: any, item: { totalSales: any }) => sum + item.totalSales, 0).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              }) || '$0'}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {timeRange === 'day' ? 'Today' : 
               timeRange === 'week' ? 'This Week' :
               timeRange === 'month' ? 'This Month' : 'This Year'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#F44336]">
              {profitabilityData?.profitabilityAnalysis?.reduce((sum: any, item: { totalExpenses: any }) => sum + item.totalExpenses, 0).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              }) || '$0'}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {timeRange === 'day' ? 'Today' : 
               timeRange === 'week' ? 'This Week' :
               timeRange === 'month' ? 'This Month' : 'This Year'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${
              profitabilityData?.profitabilityAnalysis?.reduce((sum: any, item: { profit: any }) => sum + item.profit, 0) >= 0 
                ? 'text-[#4CAF50]' 
                : 'text-[#F44336]'
            }`}>
              {profitabilityData?.profitabilityAnalysis?.reduce((sum: any, item: { profit: any }) => sum + item.profit, 0).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              }) || '$0'}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {timeRange === 'day' ? 'Today' : 
               timeRange === 'week' ? 'This Week' :
               timeRange === 'month' ? 'This Month' : 'This Year'}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}