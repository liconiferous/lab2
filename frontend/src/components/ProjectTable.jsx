import { useState } from 'react';
import { deleteProject } from '../services/api';
import './TableStyles.css';

function ProjectTable({ projects, onProjectDeleted }) {
  const [sortField, setSortField] = useState('project_code');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const sortedProjects = [...projects].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'project_code') {
      comparison = a[sortField].localeCompare(b[sortField]);
    } else if (sortField === 'project_name' || sortField === 'project_description') {
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
  
  const handleDelete = async (projectCode) => {
    if (window.confirm(`Are you sure you want to delete project ${projectCode}?`)) {
      setIsDeleting(true);
      setError(null);
      
      try {
        await deleteProject(projectCode);
        if (onProjectDeleted) {
          onProjectDeleted();
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete project, please try again.');
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
            <th onClick={() => handleSort('project_code')}>
              Project Code {sortField === 'project_code' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('project_name')}>
              Project Name {sortField === 'project_name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('project_description')}>
              Project Description
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedProjects.length === 0 ? (
            <tr>
              <td colSpan="4">No project data available</td>
            </tr>
          ) : (
            sortedProjects.map((project) => (
              <tr key={project._id}>
                <td>{project.project_code}</td>
                <td>{project.project_name}</td>
                <td className="description-cell">{project.project_description}</td>
                <td>
                  <button 
                    className="delete-btn" 
                    onClick={() => handleDelete(project.project_code)}
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

export default ProjectTable; 