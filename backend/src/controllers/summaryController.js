const db = require('../config/db');

exports.getMonthlySummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { year, month } = req.query; // Optional filters

    let query = `
      SELECT 
        ec.name AS category_name, 
        SUM(e.amount) AS total_amount
      FROM expenses e
      JOIN expense_categories ec ON e.expense_category_id = ec.id
      WHERE e.user_id = ?
    `;
    const queryParams = [userId];

    if (year && month) {
      query += ` AND YEAR(e.expense_date) = ? AND MONTH(e.expense_date) = ?`;
      queryParams.push(year, month);
    }

    query += ` GROUP BY ec.id`;

    const [summary] = await db.query(query, queryParams);
    res.json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error generating summary' });
  }
};
