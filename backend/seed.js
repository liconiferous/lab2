const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const Employee = require('./models/Employee');
const Project = require('./models/Project');
const ProjectAssignment = require('./models/ProjectAssignment');

// 连接到MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// 示例数据
const seedDatabase = async () => {
  try {
    // 清空现有数据
    await Employee.deleteMany({});
    await Project.deleteMany({});
    await ProjectAssignment.deleteMany({});
    
    console.log('Collections cleared');
    
    // 创建员工
    const employees = [
      { employee_id: 'E001', full_name: 'John Doe', email: 'john@example.com', hashed_password: await bcrypt.hash('password123', 10) },
      { employee_id: 'E002', full_name: 'Jane Smith', email: 'jane@example.com', hashed_password: await bcrypt.hash('password123', 10) },
      { employee_id: 'E003', full_name: 'Michael Johnson', email: 'michael@example.com', hashed_password: await bcrypt.hash('password123', 10) },
      { employee_id: 'E004', full_name: 'Emily Williams', email: 'emily@example.com', hashed_password: await bcrypt.hash('password123', 10) },
      { employee_id: 'E005', full_name: 'David Brown', email: 'david@example.com', hashed_password: await bcrypt.hash('password123', 10) }
    ];
    
    const createdEmployees = await Employee.insertMany(employees);
    console.log('Employees created');
    
    // 创建项目
    const projects = [
      { project_code: 'P001', project_name: 'Website Redesign', project_description: 'Redesign company website with modern UI/UX' },
      { project_code: 'P002', project_name: 'Mobile App Development', project_description: 'Create a new mobile app for customers' },
      { project_code: 'P003', project_name: 'Database Migration', project_description: 'Migrate legacy database to MongoDB' },
      { project_code: 'P004', project_name: 'API Integration', project_description: 'Integrate third-party APIs into our platform' },
      { project_code: 'P005', project_name: 'Security Audit', project_description: 'Perform a security audit of all systems' }
    ];
    
    const createdProjects = await Project.insertMany(projects);
    console.log('Projects created');
    
    // 创建项目分配
    const assignments = [
      { employee_id: 'E001', project_code: 'P001', start_date: new Date('2023-01-15') },
      { employee_id: 'E002', project_code: 'P001', start_date: new Date('2023-01-20') },
      { employee_id: 'E003', project_code: 'P002', start_date: new Date('2023-02-01') },
      { employee_id: 'E001', project_code: 'P003', start_date: new Date('2023-02-10') },
      { employee_id: 'E004', project_code: 'P004', start_date: new Date('2023-03-05') },
      { employee_id: 'E005', project_code: 'P005', start_date: new Date('2023-03-15') },
      { employee_id: 'E002', project_code: 'P002', start_date: new Date('2023-04-01') }
    ];
    
    await ProjectAssignment.insertMany(assignments);
    console.log('Project assignments created');
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();