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
      
      // Reset form
      setFormData({
        project_code: '',
        project_name: '',
        project_description: ''
      });
      
      // Notify parent component to reload data
      if (onProjectAdded) {
        onProjectAdded();
      }
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add project, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="form-container">
      {success && <div className="success-message">Project added successfully!</div>}
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="project_code">Project Code:</label>
          <input
            type="text"
            id="project_code"
            name="project_code"
            value={formData.project_code}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            placeholder="e.g. P001"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="project_name">Project Name:</label>
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
          <label htmlFor="project_description">Project Description:</label>
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
          {isSubmitting ? 'Adding...' : 'Add Project'}
        </button>
      </form>
    </div>
  );
}

export default ProjectForm; 