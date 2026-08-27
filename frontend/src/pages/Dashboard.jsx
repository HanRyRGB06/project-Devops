import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // In a real app, this would be an API call fetching from /api/summary/monthly
    const mockData = [
      { category_name: 'Food', total_amount: 400 },
      { category_name: 'Rent', total_amount: 1500 },
      { category_name: 'Utilities', total_amount: 200 },
      { category_name: 'Entertainment', total_amount: 300 }
    ];
    setData(mockData);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Monthly Summary Dashboard</h1>
      
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={150}
              fill="#8884d8"
              dataKey="total_amount"
              nameKey="category_name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
