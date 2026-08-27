const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const expenseCategoryController = require('../controllers/expenseCategoryController');

router.use(protect); // All routes require authentication

router.get('/', expenseCategoryController.getAllCategories);
router.get('/:id', expenseCategoryController.getCategoryById);
router.post('/', expenseCategoryController.createCategory);
router.put('/:id', expenseCategoryController.updateCategory);
router.delete('/:id', expenseCategoryController.deleteCategory);

module.exports = router;
