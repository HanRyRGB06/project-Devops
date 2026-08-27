const bcrypt = require('bcryptjs');
const { sequelize, User } = require('./src/models');

const seedAdmin = async () => {
  try {
    // 1. เชื่อมต่อฐานข้อมูลและสร้างตาราง (ถ้ายังไม่มี)
    await sequelize.sync({ force: false });
    
    const adminUsername = 'admin';
    const adminPassword = 'password123';
    
    // 2. ตรวจสอบว่ามี user นี้หรือยัง
    const existingUser = await User.findOne({ where: { username: adminUsername } });
    
    if (existingUser) {
      console.log('Admin user already exists!');
    } else {
      // 3. สร้าง User ใหม่
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(adminPassword, salt);
      
      await User.create({
        username: adminUsername,
        password_hash: password_hash,
        name: 'System Admin',
        role: 'admin'
      });
      console.log(`Successfully created default user!`);
      console.log(`Username: ${adminUsername}`);
      console.log(`Password: ${adminPassword}`);
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit(0);
  }
};

seedAdmin();
