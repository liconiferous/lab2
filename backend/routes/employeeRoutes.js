const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// 获取所有员工
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find().select('-hashed_password');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 添加新员工
router.post('/createEmployee', async (req, res) => {
  try {
    // 检查员工ID是否已存在
    const existingEmployee = await Employee.findOne({ employee_id: req.body.employee_id });
    if (existingEmployee) {
      return res.status(400).json({ message: "Employee ID already exists" });
    }
    
    // 检查邮箱是否已存在
    const emailExists = await Employee.findOne({ email: req.body.email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }
    
    const employee = new Employee(req.body);
    const savedEmployee = await employee.save();
    
    // 不返回密码
    const { hashed_password, ...employeeData } = savedEmployee.toObject();
    res.status(201).json(employeeData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 获取单个员工
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findOne({ employee_id: req.params.id }).select('-hashed_password');
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 删除员工
router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employee.findOneAndDelete({ employee_id: req.params.id });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;