import { useState, useEffect } from 'react';
import { createAssignment, fetchEmployees, fetchProjects } from '../services/api';
import './FormStyles.css';

function AssignmentForm({ onAssignmentAdded }) {
  const [formData, setFormData] = useState({
    employee_id: '',
    project_code: '',
    start_date: new Date().toISOString().split('T')[0] // 默认今天日期
  });
  
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // 加载员工和项目数据
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [employeesData, projectsData] = await Promise.all([
          fetchEmployees(),
          fetchProjects()
        ]);
        setEmployees(employeesData);
        setProjects(projectsData);
        
        // 如果有数据，默认选择第一个
        if (employeesData.length > 0) {
          setFormData(prev => ({ ...prev, employee_id: employeesData[0].employee_id }));
        }
        if (projectsData.length > 0) {
          setFormData(prev => ({ ...prev, project_code: projectsData[0].project_code }));
        }
      } catch (err) {
        setError('加载数据失败，请刷新页面重试。');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
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
      await createAssignment(formData);
      setSuccess(true);
      
      // 重置日期，但保留选择的员工和项目
      setFormData({
        ...formData,
        start_date: new Date().toISOString().split('T')[0]
      });
      
      // 通知父组件重新加载数据
      if (onAssignmentAdded) {
        onAssignmentAdded();
      }
      
      // 3秒后隐藏成功消息
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || '创建分配失败，请重试。');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <div className="loading">加载中...</div>;
  }
  
  return (
    <div className="form-container">
      {success && <div className="success-message">项目分配创建成功！</div>}
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="employee_id">员工:</label>
          <select
            id="employee_id"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            required
            disabled={isSubmitting || employees.length === 0}
          >
            {employees.length === 0 ? (
              <option value="">暂无员工数据</option>
            ) : (
              employees.map(employee => (
                <option key={employee._id} value={employee.employee_id}>
                  {employee.employee_id} - {employee.full_name}
                </option>
              ))
            )}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="project_code">项目:</label>
          <select
            id="project_code"
            name="project_code"
            value={formData.project_code}
            onChange={handleChange}
            required
            disabled={isSubmitting || projects.length === 0}
          >
            {projects.length === 0 ? (
              <option value="">暂无项目数据</option>
            ) : (
              projects.map(project => (
                <option key={project._id} value={project.project_code}>
                  {project.project_code} - {project.project_name}
                </option>
              ))
            )}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="start_date">开始日期:</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting || employees.length === 0 || projects.length === 0}
        >
          {isSubmitting ? '分配中...' : '分配到项目'}
        </button>
      </form>
    </div>
  );
}

export default AssignmentForm;