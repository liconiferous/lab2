const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// 导入路由
const employeeRoutes = require('../routes/employeeRoutes');
const projectRoutes = require('../routes/projectRoutes');
const assignmentRoutes = require('../routes/assignmentRoutes');

const app = express();
const port = process.env.PORT || 5000;

// 中间件
app.use(cors());
app.use(express.json());

// 连接MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// API路由
app.use('/api/employees', employeeRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/project_assignments', assignmentRoutes);

// 提供前端静态文件（生产环境）
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist', 'index.html'));
  });
}

// 启动服务器
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});