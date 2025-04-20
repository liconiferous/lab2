const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const EmployeeSchema = new mongoose.Schema({
  employee_id: {
    type: String,
    required: true,
    unique: true
  },
  full_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  hashed_password: {
    type: String,
    required: true
  }
}, { timestamps: true });

// 保存前散列密码
EmployeeSchema.pre('save', async function(next) {
  if (!this.isModified('hashed_password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.hashed_password = await bcrypt.hash(this.hashed_password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Employee', EmployeeSchema);