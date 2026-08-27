const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const summaryController = require('../controllers/summaryController');

router.use(protect); // Require authentication

router.get('/monthly', summaryController.getMonthlySummary);

module.exports = router;
