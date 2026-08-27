import React, { useState } from 'react';

const Reports = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]);

  const handleGenerateReport = (e) => {
    e.preventDefault();
    // In a real app, this would call /api/expenses?startDate=X&endDate=Y
    const mockReport = [
      { id: 1, title: 'Office Supplies', amount: 150, date: '2026-08-25' },
      { id: 2, title: 'Internet Bill', amount: 50, date: '2026-08-26' }
    ];
    setReportData(mockReport);
  };

  return (
    <div className="container">
      <h1>Expense Reports</h1>
      <form onSubmit={handleGenerateReport} className="report-form">
        <div className="form-group">
          <label>Start Date</label>
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            required
          />
        </div>
        <div className="form-group">
          <label>End Date</label>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            required
          />
        </div>
        <button type="submit" className="btn-primary">Generate Report</button>
      </form>

      {reportData.length > 0 && (
        <div className="table-responsive">
          <table className="report-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item) => (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td>{item.title}</td>
                  <td>${item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reports;
