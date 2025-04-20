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
      
      // Reset form
      setFormData({
        employee_id: '',
        full_name: '',
        email: '',
        hashed_password: ''
      });
      
      // Notify parent component to reload data
      if (onEmployeeAdded) {
        onEmployeeAdded();
      }
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add employee, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="form-container">
      {success && <div className="success-message">Employee added successfully!</div>}
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="employee_id">Employee ID:</label>
          <input
            type="text"
            id="employee_id"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            placeholder="e.g. E001"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="full_name">Full Name:</label>
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
          <label htmlFor="email">Email:</label>
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
          <label htmlFor="hashed_password">Password:</label>
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
          {isSubmitting ? 'Adding...' : 'Add Employee'}
        </button>
      </form>
    </div>
  );
}

export default EmployeeForm; 