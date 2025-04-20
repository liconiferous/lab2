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
  });
  
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
    if (window.confirm('确定要删除此项目分配吗？')) {
      setIsDeleting(true);
      setError(null);
      
      try {
        await deleteAssignment(assignmentId);
        if (onAssignmentDeleted) {
          onAssignmentDeleted();
        }
      } catch (err) {
        setError(err.response?.data?.message || '删除分配失败，请重试。');
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
              员工编号 {sortField === 'employee_id' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('employee_name')}>
              员工姓名 {sortField === 'employee_name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('project_code')}>
              项目代码 {sortField === 'project_code' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('project_name')}>
              项目名称 {sortField === 'project_name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('start_date')}>
              开始日期 {sortField === 'start_date' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {sortedAssignments.length === 0 ? (
            <tr>
              <td colSpan="6">暂无项目分配数据</td>
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
                    删除
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