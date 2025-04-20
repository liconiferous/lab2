import { useState } from 'react';
import { createEmployee } from '../services/api';
import './FormStyles.css';

function EmployeeForm({ onEmployeeAdded }) {
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    hashed_password: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      await createEmployee(formData);
      setSuccess(true);
      
      // 重置表单
      setFormData({
        employee_id: '',
        full_name: '',
        email: '',
        hashed_password: ''
      });
      
      // 通知父组件重新加载数据
      if (onEmployeeAdded) {
        onEmployeeAdded();
      }
      
      // 3秒后隐藏成功消息
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || '添加员工失败，请重试。');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="form-container">
      {success && <div className="success-message">员工添加成功！</div>}
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="employee_id">员工编号:</label>
          <input
            type="text"
            id="employee_id"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            placeholder="如：E001"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="full_name">姓名:</label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">邮箱:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="hashed_password">密码:</label>
          <input
            type="password"
            id="hashed_password"
            name="hashed_password"
            value={formData.hashed_password}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>
        
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '添加中...' : '添加员工'}
        </button>
      </form>
    </div>
  );
}

export default EmployeeForm; 