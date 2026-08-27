const express = require('express');
const router = express.Router();
const budgetCategoryController = require('../controllers/budgetCategoryController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', budgetCategoryController.getAll);
router.post('/', budgetCategoryController.create);
router.put('/:id', budgetCategoryController.update);
router.delete('/:id', budgetCategoryController.delete);

module.exports = router;
