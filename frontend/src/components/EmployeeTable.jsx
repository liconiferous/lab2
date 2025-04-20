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
    if (window.confirm(`确定要删除员工 ${employeeId} 吗？`)) {
      setIsDeleting(true);
      setError(null);
      
      try {
        await deleteEmployee(employeeId);
        if (onEmployeeDeleted) {
          onEmployeeDeleted();
        }
      } catch (err) {
        setError(err.response?.data?.message || '删除员工失败，请重试。');
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
            <th onClick={() => handleSort('full_name')}>
              姓名 {sortField === 'full_name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('email')}>
              邮箱 {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {sortedEmployees.length === 0 ? (
            <tr>
              <td colSpan="4">暂无员工数据</td>
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

export default EmployeeTable; 