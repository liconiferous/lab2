# Lab2
## Project Introduction
This project is a full-stack web application that manages employee assignments to projects within an organization. It features a React client for data entry and display, an Express.js API server for business logic, and a MongoDB Atlas cloud database for persistent storage. This tutorial will guide you through understanding, installing, and using the system.

## System Architecture
This project uses the following technologies:

1. **Front-end:**
- React (created with Vite or Create React App)
- Axios for HTTP requests
- CSS modules or plain CSS for styling

2. **Back-end:**
- Node.js + Express.js (RESTful API server)
- concurrently & nodemon for development workflow

3. **Database:**
- MongoDB Atlas (using Mongoose ODM)

## Project Directory Structure
```
lab2/
├── frontend/                   # React front-end
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/
│   │   │   └── react.svg
│   │   ├── components/
│   │   │   ├── AssignmentForm.jsx
│   │   │   ├── AssignmentTable.jsx
│   │   │   ├── EmployeeForm.jsx
│   │   │   ├── EmployeeTable.jsx
│   │   │   ├── ProjectForm.jsx
│   │   │   └── ProjectTable.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── backend/                    # Express back-end
│   ├── models/
│   │   ├── Employee.js
│   │   ├── Project.js
│   │   └── ProjectAssignment.js
│   ├── routes/
│   │   ├── assignmentRoutes.js
│   │   ├── employeeRoutes.js
│   │   └── projectRoutes.js
│   ├── server/
│   │   └── index.js
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── seed.js
├── package.json
└── package-lock.json
```
## Functional Introduction
This system provides the following functions:

1. **View Project Assignments**
- Displays the latest 5 assignments in a dynamic table.

2. **Add New Employee**
- Submit employee_id, full_name, email, and password via a form.

3. **Add New Project**
- Submit project_code, project_name, and project_description.

4. **Assign Employee to Project**
- Select an existing employee and project, and pick a start date.

5. **Auto-Refresh & Sorting**
- Data refreshes every minute automatically.
- Click column headers to sort ascending/descending.

## Installation Steps
**Prerequisites**
- Node.js
- Git
- A MongoDB Atlas account with a cluster (no local MongoDB needed)

**Installation and Startup**
- Clone the project
```bash
git clone https://github.com/liconiferous/lab2.git
cd lab2
```

**Install dependencies**
```bash
cd backend && npm install
cd ../frontend && npm install
cd ..
```

**Configure environment variables**
Create a .env in the server/ directory with:
```bash
PORT=5000
MONGO_URI=<your MongoDB Atlas connection string>
```
**Start the application**

From the project root:
```bash
npm run dev
```
- This runs server (on port 5000) and client (on port 5137) concurrently.

**Access the application**

Open your browser at http://localhost:5137.

## System Instructions
1. **Add a New Employee**
   1. Fill in the Employee Form:
      - Employee ID (unique)
      - Full Name
      - Email
      - Password
   2. Click Add Employee.

2. **Add a New Project**
   1. **Fill in the Project Form:**
      - Project Code (unique)
      - Project Name
      - Project Description
    2. Click Add Project.

3. **Assign Employee to Project**
   1. In the Assignment Form:
      - Select an Employee from the dropdown.
      - Select a Project.
      - Pick a Start Date.
    2. Click Assign Employee.

4. **View and Interact with Assignments**
   1. The Assignments Table shows:
      - Employee ID
      - Employee Name
      - Project Name
      - Start Date
   2. Auto-Refresh: Updates automatically every minute.
   3. Sorting: Click on any column header to toggle sort order.

## FAQ
1. “Cannot connect to database”
   - Ensure your MONGO_URI in .env is correct and the Atlas cluster is running.

2. “Duplicate key error” when adding
   - employee_id and project_code must be unique; choose different values.

3. “Error fetching assignments” on UI
   - Confirm the server is running (npm run dev) and check browser console/network tab.
