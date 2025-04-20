const express = require('express');
const router = express.Router();
const ProjectAssignment = require('../models/ProjectAssignment');
const Employee = require('../models/Employee');
const Project = require('../models/Project');

// 获取所有项目分配（带完整信息）
router.get('/', async (req, res) => {
  try {
    // 直接获取分配数据并添加关联数据
    const assignments = await ProjectAssignment.find().sort({ start_date: -1 });
    
    // 获取详细信息
    const detailedAssignments = await Promise.all(assignments.map(async (assignment) => {
      const employee = await Employee.findOne({ employee_id: assignment.employee_id }).select('-hashed_password');
      const project = await Project.findOne({ project_code: assignment.project_code });
      
      return {
        _id: assignment._id,
        employee_id: assignment.employee_id,
        employee_name: employee ? employee.full_name : 'Unknown',
        project_code: assignment.project_code,
        project_name: project ? project.project_name : 'Unknown',
        start_date: assignment.start_date
      };
    }));
    
    res.json(detailedAssignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 添加新项目分配
router.post('/', async (req, res) => {
  try {
    // 验证员工存在
    const employeeExists = await Employee.findOne({ employee_id: req.body.employee_id });
    if (!employeeExists) {
      return res.status(400).json({ message: "Employee does not exist" });
    }
    
    // 验证项目存在
    const projectExists = await Project.findOne({ project_code: req.body.project_code });
    if (!projectExists) {
      return res.status(400).json({ message: "Project does not exist" });
    }
    
    const assignment = new ProjectAssignment(req.body);
    const savedAssignment = await assignment.save();
    
    // 返回带详细信息的分配
    const detailedAssignment = {
      ...savedAssignment.toObject(),
      employee_name: employeeExists.full_name,
      project_name: projectExists.project_name
    };
    
    res.status(201).json(detailedAssignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 删除项目分配
router.delete('/:id', async (req, res) => {
  try {
    const assignment = await ProjectAssignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;