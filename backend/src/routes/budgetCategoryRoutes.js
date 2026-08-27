const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const budgetCategoryController = require('../controllers/budgetCategoryController');

router.use(protect); // All routes require authentication

router.get('/', budgetCategoryController.getAllCategories);
router.get('/:id', budgetCategoryController.getCategoryById);
router.post('/', budgetCategoryController.createCategory);
router.put('/:id', budgetCategoryController.updateCategory);
router.delete('/:id', budgetCategoryController.deleteCategory);

module.exports = router;
