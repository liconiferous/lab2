import { useState, useEffect } from 'react';
import { createAssignment, fetchEmployees, fetchProjects } from '../services/api';
import './FormStyles.css';

function AssignmentForm({ onAssignmentAdded }) {
  const [formData, setFormData] = useState({
    employee_id: '',
    project_code: '',
    start_date: new Date().toISOString().split('T')[0] // Default to today's date
  });
  
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Load employee and project data
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
        
        // If data exists, select the first one by default
        if (employeesData.length > 0) {
          setFormData(prev => ({ ...prev, employee_id: employeesData[0].employee_id }));
        }
        if (projectsData.length > 0) {
          setFormData(prev => ({ ...prev, project_code: projectsData[0].project_code }));
        }
      } catch (err) {
        setError('Failed to load data, please refresh and try again.');
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
      
      // Reset date but keep selected employee and project
      setFormData({
        ...formData,
        start_date: new Date().toISOString().split('T')[0]
      });
      
      // Notify parent component to reload data
      if (onAssignmentAdded) {
        onAssignmentAdded();
      }
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create assignment, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }
  
  return (
    <div className="form-container">
      {success && <div className="success-message">Assignment created successfully!</div>}
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="employee_id">Employee:</label>
          <select
            id="employee_id"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            required
            disabled={isSubmitting || employees.length === 0}
          >
            {employees.length === 0 ? (
              <option value="">No employee data available</option>
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
          <label htmlFor="project_code">Project:</label>
          <select
            id="project_code"
            name="project_code"
            value={formData.project_code}
            onChange={handleChange}
            required
            disabled={isSubmitting || projects.length === 0}
          >
            {projects.length === 0 ? (
              <option value="">No project data available</option>
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
          <label htmlFor="start_date">Start Date:</label>
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
          {isSubmitting ? 'Assigning...' : 'Assign to Project'}
        </button>
      </form>
    </div>
  );
}

export default AssignmentForm;