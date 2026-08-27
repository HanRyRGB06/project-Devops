import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import api from '../services/api';
import { DollarSign, TrendingUp, Tags } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get('/summary/monthly');
        
        if (response.data.success) {
          // Process data for charts
          const summaryData = response.data.data;
          
          // Map to format Recharts expects (using expense_category or category_name)
          const processedData = summaryData.map(item => ({
            name: item.expense_category || 'Uncategorized',
            value: parseFloat(item.total_amount) || 0
          }));
          
          setData(processedData);
        } else {
          setError('Failed to fetch summary data');
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Error fetching data from server');
        
        // Fallback to mock data for demonstration if API fails
        setData([
          { name: 'Water', value: 150 },
          { name: 'Electricity', value: 800 },
          { name: 'Internet', value: 500 },
          { name: 'Phone', value: 300 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const totalExpense = data.reduce((sum, item) => sum + item.value, 0);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500">Your monthly expenses overview</p>
        </div>
      </div>

      {error && (
        <div className="bg-amber-50 text-amber-600 p-4 rounded-lg border border-amber-200">
          <p><strong>Note:</strong> {error}. Showing mock data instead.</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center space-x-4 transition-transform hover:-translate-y-1 duration-300">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Expenses</p>
            <h3 className="text-2xl font-bold text-slate-800">฿{totalExpense.toLocaleString()}</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center space-x-4 transition-transform hover:-translate-y-1 duration-300">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Highest Category</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {data.length > 0 ? [...data].sort((a,b) => b.value - a.value)[0].name : 'N/A'}
            </h3>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center space-x-4 transition-transform hover:-translate-y-1 duration-300">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <Tags size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Categories</p>
            <h3 className="text-2xl font-bold text-slate-800">{data.length}</h3>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Expenses by Category</h3>
          {data.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `฿${value}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-slate-400">
              No data available for this month
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Expense Distribution</h3>
          {data.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `฿${value}`} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}} 
                    formatter={(value) => [`฿${value}`, 'Amount']} 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-slate-400">
              No data available for this month
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
