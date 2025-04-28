import { useState } from 'react';
import { deleteAssignment } from '../services/api';
import './TableStyles.css';

function AssignmentTable({ assignments, onAssignmentDeleted }) {
  const [sortField, setSortField] = useState('start_date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  
  const sortedAssignments = [...assignments].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'employee_id' || sortField === 'project_code') {
      comparison = a[sortField].localeCompare(b[sortField]);
    } else if (sortField === 'employee_name' || sortField === 'project_name') {
      comparison = a[sortField].localeCompare(b[sortField]);
    } else if (sortField === 'start_date') {
      comparison = new Date(a[sortField]) - new Date(b[sortField]);
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  }).slice(0, 5); // ← limit to the top five
  
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const handleDelete = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      setIsDeleting(true);
      setError(null);
      
      try {
        await deleteAssignment(assignmentId);
        if (onAssignmentDeleted) {
          onAssignmentDeleted();
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete assignment, please try again.');
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
            <th onClick={() => handleSort('employee_name')}>
              Employee Name {sortField === 'employee_name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('project_code')}>
              Project Code {sortField === 'project_code' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('project_name')}>
              Project Name {sortField === 'project_name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('start_date')}>
              Start Date {sortField === 'start_date' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedAssignments.length === 0 ? (
            <tr>
              <td colSpan="6">No assignment data available</td>
            </tr>
          ) : (
            sortedAssignments.map((assignment) => (
              <tr key={assignment._id}>
                <td>{assignment.employee_id}</td>
                <td>{assignment.employee_name}</td>
                <td>{assignment.project_code}</td>
                <td>{assignment.project_name}</td>
                <td>{formatDate(assignment.start_date)}</td>
                <td>
                  <button 
                    className="delete-btn" 
                    onClick={() => handleDelete(assignment._id)}
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

export default AssignmentTable;