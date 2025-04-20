const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// 启动服务器
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});