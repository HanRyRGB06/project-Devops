const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const expenseCategoryRoutes = require('./routes/expenseCategoryRoutes');
const budgetCategoryRoutes = require('./routes/budgetCategoryRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/expense-categories', expenseCategoryRoutes);
app.use('/api/budget-categories', budgetCategoryRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to e-utilities-cost API' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
