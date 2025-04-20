import { useState } from 'react';
import { deleteEmployee } from '../services/api';
import './TableStyles.css';

function EmployeeTable({ employees, onEmployeeDeleted }) {
  const [sortField, setSortField] = useState('employee_id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const sortedEmployees = [...employees].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'employee_id') {
      comparison = a[sortField].localeCompare(b[sortField]);
    } else if (sortField === 'full_name' || sortField === 'email') {
      comparison = a[sortField].localeCompare(b[sortField]);
    } else if (sortField === 'createdAt') {
      comparison = new Date(a[sortField]) - new Date(b[sortField]);
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const handleDelete = async (employeeId) => {
    if (window.confirm(`Are you sure you want to delete employee ${employeeId}?`)) {
      setIsDeleting(true);
      setError(null);
      
      try {
        await deleteEmployee(employeeId);
        if (onEmployeeDeleted) {
          onEmployeeDeleted();
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete employee, please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  return (
    <div className="table-container">
      {error && <div className="error-message">{error}</div>}
      
      <table className="data-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('employee_id')}>
              Employee ID {sortField === 'employee_id' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('full_name')}>
              Full Name {sortField === 'full_name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('email')}>
              Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedEmployees.length === 0 ? (
            <tr>
              <td colSpan="4">No employee data available</td>
            </tr>
          ) : (
            sortedEmployees.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.employee_id}</td>
                <td>{employee.full_name}</td>
                <td>{employee.email}</td>
                <td>
                  <button 
                    className="delete-btn" 
                    onClick={() => handleDelete(employee.employee_id)}
                    disabled={isDeleting}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeTable; 