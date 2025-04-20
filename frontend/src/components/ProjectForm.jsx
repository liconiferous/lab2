import { useState } from 'react';
import { createProject } from '../services/api';
import './FormStyles.css';

function ProjectForm({ onProjectAdded }) {
  const [formData, setFormData] = useState({
    project_code: '',
    project_name: '',
    project_description: ''
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
      await createProject(formData);
      setSuccess(true);
      
      // 重置表单
      setFormData({
        project_code: '',
        project_name: '',
        project_description: ''
      });
      
      // 通知父组件重新加载数据
      if (onProjectAdded) {
        onProjectAdded();
      }
      
      // 3秒后隐藏成功消息
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || '添加项目失败，请重试。');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="form-container">
      {success && <div className="success-message">项目添加成功！</div>}
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="project_code">项目代码:</label>
          <input
            type="text"
            id="project_code"
            name="project_code"
            value={formData.project_code}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            placeholder="如：P001"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="project_name">项目名称:</label>
          <input
            type="text"
            id="project_name"
            name="project_name"
            value={formData.project_name}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="project_description">项目描述:</label>
          <textarea
            id="project_description"
            name="project_description"
            value={formData.project_description}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            rows="3"
          />
        </div>
        
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '添加中...' : '添加项目'}
        </button>
      </form>
    </div>
  );
}

export default ProjectForm; 