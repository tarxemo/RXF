import { useQuery } from '@apollo/client'
import { useToast } from '../components/ui/use-toast'
import { DASHBOARD_STATS, FINANCIAL_OVERVIEW } from '../api/queries'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Calendar, PieChart, DollarSign, Users } from 'lucide-react'
import { formatDate, formatCurrency } from '../lib/utils'
import { Badge } from '../components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Pie, Cell, Tooltip } from 'recharts'
import type { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function DashboardPage() {
  const { addToast } = useToast()
  
  // Fetch dashboard stats
  const { data: statsData, loading: statsLoading, error: statsError } = useQuery(DASHBOARD_STATS)
  
  // Fetch financial overview (current month)
  const { data: financialData, loading: financialLoading, error: financialError } = useQuery(FINANCIAL_OVERVIEW)
  
  if (statsLoading || financialLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>
  if (statsError || financialError) {
    addToast({
      title: 'Error loading dashboard data',
      description: statsError?.message || financialError?.message,
      variant: 'destructive'
    })
    return <div>Error loading dashboard</div>
  }

  // Prepare data for charts
  const salesByCategoryData = financialData?.financialOverview?.salesByCategory?.map((item: { category: any; total: string }) => ({
    name: item.category,
    value: parseFloat(item.total)
  })) || []

  const monthlyTrendsData = financialData?.financialOverview?.monthlyTrends?.map((item: { month: string | number | Date; totalSales: string; totalExpenses: string }) => ({
    name: new Date(item.month).toLocaleString('default', { month: 'short' }),
    sales: parseFloat(item.totalSales),
    expenses: parseFloat(item.totalExpenses),
    profit: parseFloat(item.totalSales) - parseFloat(item.totalExpenses)
  })) || []

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Farm Management Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Farms</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData?.dashboardStats?.totalFarms}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData?.dashboardStats?.totalAssets}</div>
            <div className="flex space-x-2 text-sm text-muted-foreground mt-1">
              <span>{statsData?.dashboardStats?.totalLivestock} Livestock</span>
              <span>{statsData?.dashboardStats?.totalCrops} Crops</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData?.dashboardStats?.totalEmployees}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              financialData?.financialOverview?.netProfit >= 0 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {formatCurrency(financialData?.financialOverview?.netProfit)}
            </div>
            <div className="flex space-x-2 text-sm text-muted-foreground mt-1">
              <span>Sales: {formatCurrency(financialData?.financialOverview?.totalSales)}</span>
              <span>Expenses: {formatCurrency(financialData?.financialOverview?.totalExpenses)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Sales by Category Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Product Category</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {salesByCategoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesByCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {salesByCategoryData.map((_entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                  formatter={(value) => {
                    const numericValue = typeof value === 'number' ? value : Number(value)
                    return isNaN(numericValue) ? value : formatCurrency(numericValue)
                  }}
                  labelFormatter={(label) => `Month: ${label}`}
                />

                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No sales data available
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Monthly Trends Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Financial Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {monthlyTrendsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => {
                      const numericValue = typeof value === 'number' ? value : Number(value)
                      return isNaN(numericValue) ? value : formatCurrency(numericValue)
                    }}
                    labelFormatter={(label) => `Month: ${label}`}
                  />

                  <Legend />
                  <Bar dataKey="sales" name="Sales" fill="#0088FE" />
                  <Bar dataKey="expenses" name="Expenses" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No trend data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Sales</CardTitle>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statsData?.dashboardStats?.recentSales?.map((sale: { id: Key | null | undefined; saleDate: string; product: { name: any }; totalAmount: number }) => (
                  <TableRow key={sale.id}>
                    <TableCell>{formatDate(sale.saleDate)}</TableCell>
                    <TableCell>
                      {sale.product?.name || 'Asset Sale'}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(sale.totalAmount)}
                    </TableCell>
                  </TableRow>
                ))}
                {statsData?.dashboardStats?.recentSales?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                      No recent sales
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Upcoming Tasks</CardTitle>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statsData?.dashboardStats?.upcomingTasks?.map((task: { id: Key | null | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; dueDate: string; priority: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formatDate(task.dueDate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          task.priority === 'HIGH' ? 'destructive' : 
                          task.priority === 'MEDIUM' ? 'secondary' : 'outline'
                        }
                      >
                        {task.priority}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {statsData?.dashboardStats?.upcomingTasks?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                      No upcoming tasks
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}