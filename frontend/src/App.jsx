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
      setError('Failed to load assignments, please try again later.');
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
      setError('Failed to load employee data, please try again later.');
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
      setError('Failed to load project data, please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load data based on the currently active tab
    if (activeTab === 'assignments') {
      loadAssignments();
    } else if (activeTab === 'employees') {
      loadEmployees();
    } else if (activeTab === 'projects') {
      loadProjects();
    }
  }, [activeTab]);
  
	// Auto update every 60s
    useEffect(() => {
    let intervalId;
    if (activeTab === 'assignments') {
      intervalId = setInterval(() => {
        refreshAssignments();
      }, 60000);
    }
    return () => clearInterval(intervalId);
  }, [activeTab]);

  // Functions to refresh data
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
      return <div className="loading">Loading...</div>;
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    switch (activeTab) {
      case 'assignments':
        return (
          <>
            <section className="form-section">
              <h2>Create New Assignment</h2>
              <AssignmentForm onAssignmentAdded={refreshAssignments} />
            </section>
            
            <section className="table-section">
              <h2>Assignment List</h2>
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
              <h2>Add New Employee</h2>
              <EmployeeForm onEmployeeAdded={refreshEmployees} />
            </section>
            
            <section className="table-section">
              <h2>Employee List</h2>
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
              <h2>Add New Project</h2>
              <ProjectForm onProjectAdded={refreshProjects} />
            </section>
            
            <section className="table-section">
              <h2>Project List</h2>
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
        <h1>Employee Project Management System</h1>
        <nav className="main-nav">
          <ul>
            <li 
              className={activeTab === 'assignments' ? 'active' : ''}
              onClick={() => handleTabChange('assignments')}
            >
              Assignments
            </li>
            <li 
              className={activeTab === 'employees' ? 'active' : ''}
              onClick={() => handleTabChange('employees')}
            >
              Employees
            </li>
            <li 
              className={activeTab === 'projects' ? 'active' : ''}
              onClick={() => handleTabChange('projects')}
            >
              Projects
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