const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const expenseController = require('../controllers/expenseController');

router.use(protect); // All expense routes require authentication

router.get('/', expenseController.getAllExpenses);
router.get('/:id', expenseController.getExpenseById);
router.post('/', expenseController.createExpense);
router.put('/:id', expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;
