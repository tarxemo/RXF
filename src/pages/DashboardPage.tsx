import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_FARM_SUMMARY } from '../api/queries';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, ComposedChart
} from 'recharts';
import Navigation from '../components/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const DashboardPage = () => {
  const [period, setPeriod] = useState('month');
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [endDate, setEndDate] = useState(new Date());
  
  const { loading, error, data } = useQuery(GET_FARM_SUMMARY, {
    variables: { 
      period,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }
  });

  if (loading) return (
    <div className="bg-gray-100 min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-700">Loading farm dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-gray-100 min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-8 text-center text-red-600">
        Error loading dashboard: {error.message}
      </div>
    </div>
  );

  // Prepare data for charts
  const revenueExpenseData = [
    { name: 'Revenue', value: data.profitLossStatement.totalRevenue },
    { name: 'Expenses', value: data.profitLossStatement.totalExpenses },
    { name: 'Net Profit', value: data.profitLossStatement.netProfit }
  ];

  const cropYieldData = data.cropYieldAnalysis.map(crop => ({
    name: crop.cropType.name,
    yield: crop.averageYield,
    cost: crop.costPerKg
  }));

  const livestockProductivityData = data.livestockProductivity.map(livestock => ({
    name: livestock.livestockType.name,
    products: livestock.totalProducts,
    cost: livestock.feedCostPerUnit,
    mortality: livestock.mortalityRate
  }));

  const revenueByCategory = Object.entries(data.profitLossStatement.revenueByCategory).map(([name, value]) => ({
    name,
    value
  }));

  const expenseByCategory = Object.entries(data.profitLossStatement.expenseByCategory).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navigation />
      
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-600 py-6 px-4 shadow-md">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">Farm Management Dashboard</h1>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center">
                <label className="mr-2 text-white font-medium">Period:</label>
                <select 
                  className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="year">Last Year</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              
              {period === 'custom' && (
                <div className="flex items-center gap-2">
                  <div>
                    <label className="block text-sm text-white">From:</label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      className="rounded-md border-gray-300 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white">To:</label>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      className="rounded-md border-gray-300 shadow-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
            <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
            <p className="text-3xl font-bold text-green-600">
              ${data.profitLossStatement.totalRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">Current period</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-red-500">
            <h3 className="text-lg font-semibold text-gray-700">Total Expenses</h3>
            <p className="text-3xl font-bold text-red-600">
              ${data.profitLossStatement.totalExpenses.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">Current period</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
            <h3 className="text-lg font-semibold text-gray-700">Net Profit</h3>
            <p className={`text-3xl font-bold ${
              data.profitLossStatement.netProfit >= 0 ? 'text-blue-600' : 'text-red-600'
            }`}>
              ${data.profitLossStatement.netProfit.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">Current period</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-yellow-500">
            <h3 className="text-lg font-semibold text-gray-700">Inventory Value</h3>
            <p className="text-3xl font-bold text-yellow-600">
              ${data.inventoryValuation.totalValue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">Current value</p>
          </div>
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue vs Expenses */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Revenue vs Expenses</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={revenueExpenseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value) => [`$${value.toLocaleString()}`, '']}
                  />
                  <Bar 
                    dataKey="value" 
                    name="Amount"
                    barSize={60}
                  >
                    <Cell fill="#10B981" />
                    <Cell fill="#EF4444" />
                    <Cell fill="#3B82F6" />
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue by Category */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Revenue by Category</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueByCategory}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {revenueByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value) => [`$${value.toLocaleString()}`, '']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Secondary Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Crop Yield Analysis */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Crop Yield Analysis</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cropYieldData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis yAxisId="left" orientation="left" stroke="#10B981" />
                  <YAxis yAxisId="right" orientation="right" stroke="#3B82F6" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value, name) => {
                      if (name === 'Yield') return [`${value} kg`, name];
                      if (name === 'Cost') return [`$${value}/kg`, name];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="yield" name="Yield (kg)" fill="#10B981" />
                  <Bar yAxisId="right" dataKey="cost" name="Cost ($/kg)" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Livestock Productivity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Livestock Productivity</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={livestockProductivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8B5CF6" />
                  <YAxis yAxisId="right" orientation="right" stroke="#EF4444" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value, name) => {
                      if (name === 'Products') return [`${value} units`, name];
                      if (name === 'Cost') return [`$${value}/unit`, name];
                      if (name === 'Mortality') return [`${value}%`, name];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="products" name="Products (units)" fill="#8B5CF6" />
                  <Bar yAxisId="right" dataKey="mortality" name="Mortality (%)" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expenses by Category */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Expenses by Category</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={expenseByCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value) => [`$${value.toLocaleString()}`, '']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    name="Expenses"
                    stroke="#EF4444" 
                    fill="#FECACA" 
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Section - Tasks and Inventory */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Tasks */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Pending Tasks</h2>
              <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                {data.pendingTasks.totalCount} total
              </span>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-red-600 mb-2">High Priority ({data.pendingTasks.highPriority.length})</h3>
                {data.pendingTasks.highPriority.length > 0 ? (
                  <ul className="space-y-2">
                    {data.pendingTasks.highPriority.map(task => (
                      <li key={task.id} className="bg-red-50 p-3 rounded-md border-l-4 border-red-500">
                        <div className="flex justify-between">
                          <span className="font-medium">{task.title}</span>
                          <span className="text-sm text-gray-600">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        {task.assignedTo && (
                          <p className="text-sm text-gray-600 mt-1">
                            Assigned to: {task.assignedTo.username}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No high priority tasks</p>
                )}
              </div>
              
              <div>
                <h3 className="font-medium text-yellow-600 mb-2">Overdue ({data.pendingTasks.overdueTasks.length})</h3>
                {data.pendingTasks.overdueTasks.length > 0 ? (
                  <ul className="space-y-2">
                    {data.pendingTasks.overdueTasks.map(task => (
                      <li key={task.id} className="bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-500">
                        <div className="flex justify-between">
                          <span className="font-medium">{task.title}</span>
                          <span className="text-sm text-gray-600">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No overdue tasks</p>
                )}
              </div>
            </div>
          </div>

          {/* Near Expiry Inventory */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Near Expiry Inventory</h2>
            
            {data.inventoryValuation.nearExpiryItems.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.inventoryValuation.nearExpiryItems.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.productType.name}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {item.productType.category}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          ${(item.quantity * item.unitPrice).toFixed(2)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {new Date(item.expiryDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 italic">No inventory items nearing expiry</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;