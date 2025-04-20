const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// 获取所有项目
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 添加新项目
router.post('/createProject', async (req, res) => {
  try {
    // 检查项目代码是否已存在
    const existingProject = await Project.findOne({ project_code: req.body.project_code });
    if (existingProject) {
      return res.status(400).json({ message: "Project code already exists" });
    }
    
    const project = new Project(req.body);
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 获取单个项目
router.get('/:code', async (req, res) => {
  try {
    const project = await Project.findOne({ project_code: req.params.code });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 删除项目
router.delete('/:code', async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ project_code: req.params.code });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;