import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchAssignments = async () => {
  try {
    const response = await axios.get(`${API_URL}/project_assignments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching assignments:', error);
    throw error;
  }
};

export const createEmployee = async (employeeData) => {
  try {
    const response = await axios.post(`${API_URL}/employees/createEmployee`, employeeData);
    return response.data;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};

export const fetchEmployees = async () => {
  try {
    const response = await axios.get(`${API_URL}/employees`);
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

export const deleteEmployee = async (employeeId) => {
  try {
    const response = await axios.delete(`${API_URL}/employees/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
};

export const createProject = async (projectData) => {
  try {
    const response = await axios.post(`${API_URL}/projects/createProject`, projectData);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const fetchProjects = async () => {
  try {
    const response = await axios.get(`${API_URL}/projects`);
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const deleteProject = async (projectCode) => {
  try {
    const response = await axios.delete(`${API_URL}/projects/${projectCode}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

export const createAssignment = async (assignmentData) => {
  try {
    const response = await axios.post(`${API_URL}/project_assignments`, assignmentData);
    return response.data;
  } catch (error) {
    console.error('Error creating assignment:', error);
    throw error;
  }
};

export const deleteAssignment = async (assignmentId) => {
  try {
    const response = await axios.delete(`${API_URL}/project_assignments/${assignmentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting assignment:', error);
    throw error;
  }
};