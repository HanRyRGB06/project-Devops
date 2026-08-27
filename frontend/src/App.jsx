import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/register" element={<div>Register Page</div>} />
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
          <Route path="/categories" element={<div>Categories Page</div>} />
          <Route path="/expenses" element={<div>Expenses Page</div>} />
          <Route path="/reports" element={<div>Reports Page</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
