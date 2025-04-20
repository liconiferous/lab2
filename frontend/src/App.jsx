import { useState, useEffect } from 'react';
import './App.css';
import { fetchAssignments, fetchEmployees, fetchProjects } from './services/api';
import AssignmentForm from './components/AssignmentForm';
import AssignmentTable from './components/AssignmentTable';
import EmployeeForm from './components/EmployeeForm';
import EmployeeTable from './components/EmployeeTable';
import ProjectForm from './components/ProjectForm';
import ProjectTable from './components/ProjectTable';

function App() {
  const [activeTab, setActiveTab] = useState('assignments');
  const [assignments, setAssignments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState({
    assignments: false,
    employees: false,
    projects: false
  });

  const loadAssignments = async () => {
    // if (dataLoaded.assignments && assignments.length > 0) return;
    
    try {
      setIsLoading(true);
      const data = await fetchAssignments();
      setAssignments(data);
      setDataLoaded(prev => ({ ...prev, assignments: true }));
      setError(null);
    } catch (err) {
      setError('加载项目分配失败，请稍后重试。');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEmployees = async () => {
    // if (dataLoaded.employees && employees.length > 0) return;
    
    try {
      setIsLoading(true);
      const data = await fetchEmployees();
      setEmployees(data);
      setDataLoaded(prev => ({ ...prev, employees: true }));
      setError(null);
    } catch (err) {
      setError('加载员工数据失败，请稍后重试。');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProjects = async () => {
    // if (dataLoaded.projects && projects.length > 0) return;
    
    try {
      setIsLoading(true);
      const data = await fetchProjects();
      setProjects(data);
      setDataLoaded(prev => ({ ...prev, projects: true }));
      setError(null);
    } catch (err) {
      setError('加载项目数据失败，请稍后重试。');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 根据当前激活的选项卡加载数据
    if (activeTab === 'assignments') {
      loadAssignments();
    } else if (activeTab === 'employees') {
      loadEmployees();
    } else if (activeTab === 'projects') {
      loadProjects();
    }
  }, [activeTab]);

  // 修改刷新函数以重置加载状态
  const refreshAssignments = () => {
    setDataLoaded(prev => ({ ...prev, assignments: false }));
    loadAssignments();
  };

  const refreshEmployees = () => {
    setDataLoaded(prev => ({ ...prev, employees: false }));
    loadEmployees();
  };

  const refreshProjects = () => {
    setDataLoaded(prev => ({ ...prev, projects: false }));
    loadProjects();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="loading">加载中...</div>;
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    switch (activeTab) {
      case 'assignments':
        return (
          <>
            <section className="form-section">
              <h2>创建新项目分配</h2>
              <AssignmentForm onAssignmentAdded={refreshAssignments} />
            </section>
            
            <section className="table-section">
              <h2>项目分配列表</h2>
              <AssignmentTable 
                assignments={assignments} 
                onAssignmentDeleted={refreshAssignments} 
              />
            </section>
          </>
        );
      case 'employees':
        return (
          <>
            <section className="form-section">
              <h2>添加新员工</h2>
              <EmployeeForm onEmployeeAdded={refreshEmployees} />
            </section>
            
            <section className="table-section">
              <h2>员工列表</h2>
              <EmployeeTable 
                employees={employees} 
                onEmployeeDeleted={refreshEmployees} 
              />
            </section>
          </>
        );
      case 'projects':
        return (
          <>
            <section className="form-section">
              <h2>添加新项目</h2>
              <ProjectForm onProjectAdded={refreshProjects} />
            </section>
            
            <section className="table-section">
              <h2>项目列表</h2>
              <ProjectTable 
                projects={projects} 
                onProjectDeleted={refreshProjects} 
              />
            </section>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <header>
        <h1>员工项目管理系统</h1>
        <nav className="main-nav">
          <ul>
            <li 
              className={activeTab === 'assignments' ? 'active' : ''}
              onClick={() => handleTabChange('assignments')}
            >
              项目分配
            </li>
            <li 
              className={activeTab === 'employees' ? 'active' : ''}
              onClick={() => handleTabChange('employees')}
            >
              员工管理
            </li>
            <li 
              className={activeTab === 'projects' ? 'active' : ''}
              onClick={() => handleTabChange('projects')}
            >
              项目管理
            </li>
          </ul>
        </nav>
      </header>
      
      <main>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;