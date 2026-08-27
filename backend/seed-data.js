const { sequelize, User, BudgetCategory, ExpenseCategory, Expense } = require('./src/models');

const seedData = async () => {
  try {
    await sequelize.sync();

    // Get the admin user
    const adminUser = await User.findOne({ where: { username: 'admin' } });
    if (!adminUser) {
      console.error('Admin user not found, please run seed.js first');
      return;
    }

    // Check if data already exists
    const budgetCount = await BudgetCategory.count();
    if (budgetCount > 0) {
      console.log('Data already seeded!');
      return;
    }

    console.log('Seeding Budget Categories...');
    const budgets = await BudgetCategory.bulkCreate([
      { name: 'งบบริหารจัดการ (Admin)', description: 'ค่าใช้จ่ายทั่วไปในออฟฟิศ', amount_limit: 25000 },
      { name: 'งบพัฒนา (Development)', description: 'ค่าใช้จ่ายส่วนของระบบไอทีและอินเทอร์เน็ต', amount_limit: 15000 },
      { name: 'งบฉุกเฉิน (Emergency)', description: 'สำรองจ่ายกรณีฉุกเฉิน', amount_limit: 10000 }
    ]);

    console.log('Seeding Expense Categories...');
    const categories = await ExpenseCategory.bulkCreate([
      { name: 'ค่าไฟฟ้า (Electricity)', description: 'ค่าไฟฟ้ารายเดือน' },
      { name: 'ค่าน้ำประปา (Water)', description: 'ค่าน้ำประปารายเดือน' },
      { name: 'ค่าอินเทอร์เน็ต (Internet)', description: 'ค่าบริการอินเทอร์เน็ต' },
      { name: 'ค่าบำรุงรักษา (Maintenance)', description: 'ค่าซ่อมบำรุงต่างๆ' }
    ]);

    console.log('Seeding Mock Expenses...');
    const today = new Date();
    
    await Expense.bulkCreate([
      {
        category_id: categories[0].id, // ค่าไฟฟ้า
        budget_category_id: budgets[0].id, // งบบริหาร
        amount: 3500.50,
        expense_date: new Date(today.getFullYear(), today.getMonth(), 5),
        description: 'ค่าไฟฟ้ารอบเดือนล่าสุด',
        created_by: adminUser.id
      },
      {
        category_id: categories[1].id, // ค่าน้ำ
        budget_category_id: budgets[0].id, // งบบริหาร
        amount: 850.00,
        expense_date: new Date(today.getFullYear(), today.getMonth(), 10),
        description: 'ค่าน้ำประปาสำนักงาน',
        created_by: adminUser.id
      },
      {
        category_id: categories[2].id, // อินเทอร์เน็ต
        budget_category_id: budgets[1].id, // งบพัฒนา
        amount: 1500.00,
        expense_date: new Date(today.getFullYear(), today.getMonth(), 12),
        description: 'ค่าอินเทอร์เน็ต Fiber',
        created_by: adminUser.id
      },
      {
        category_id: categories[3].id, // บำรุงรักษา
        budget_category_id: budgets[2].id, // งบฉุกเฉิน
        amount: 4500.00,
        expense_date: new Date(today.getFullYear(), today.getMonth(), 15),
        description: 'ซ่อมแอร์ห้อง Server',
        created_by: adminUser.id
      }
    ]);

    console.log('Successfully seeded mock data!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    process.exit(0);
  }
};

seedData();
