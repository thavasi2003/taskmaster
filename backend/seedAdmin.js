import bcrypt from 'bcryptjs';
import db from './config/db.js';

const seed = async () => {
  const password = await bcrypt.hash('admin@123', 10);
  const employeePassword = await bcrypt.hash('123456', 10);

  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin','employee') NOT NULL,
        employee_code VARCHAR(50)
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_code VARCHAR(50) NOT NULL,
        employee_name VARCHAR(100),
        name VARCHAR(255),
        task_description TEXT,
        assigned_date DATETIME,
        key_tasks TEXT,
        dependency VARCHAR(255),
        estimated_effort_hours INT,
        status VARCHAR(50) DEFAULT 'Pending',
        start_date DATETIME,
        completion_date DATETIME,
        blockers TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      INSERT IGNORE INTO users (username, password, role) 
      VALUES ('admin', ?, 'admin')
    `, [password]);

    await db.query(`
      INSERT IGNORE INTO users (username, password, role, employee_code) 
      VALUES ('employee1', ?, 'employee', 'EMP001')
    `, [employeePassword]);

    console.log('Database seeded with new schema!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();