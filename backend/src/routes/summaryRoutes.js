const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/summary', summaryController.getSummary);

module.exports = router;
