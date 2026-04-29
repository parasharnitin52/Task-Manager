# Team Task Manager

Full-stack project management app with React, Node, Express, and Postgres.

## Structure

- `backend` - Express REST API with clean layers: routes, controllers, services, repositories, Sequelize models, validators, middleware.
- `frontend` - React + Vite frontend with route guards and role-aware screens.


## DESCRIPTION:
A web app to manage projects, assign tasks, and track progress with role-based access (Admin & Member).

FEATURES:

Authentication (Signup/Login with JWT)
Project Management (Admin only)
Task Management (Create, assign, update status)
Dashboard (Admin: all tasks, Member: personal tasks)
Role-Based Access Control (RBAC)

## ROLES:

- `ADMIN` can create projects, manage project members, and create/update/delete tasks.
- `MEMBER` can view assigned/member projects and update task status for tasks assigned to them.

ADMIN:

Create/Edit/Delete Projects
Add/Remove Members
Assign Roles
Create/Assign/Delete Tasks
View all tasks and project progress

MEMBER:

View assigned projects
View & update own tasks
Mark tasks (To Do → In Progress → Done)
View personal dashboard

## TECH STACK:

Backend: Node.js, Express, Sequelize
Database: PostgreSQL / MongoDB
Auth: JWT, bcrypt
Frontend: React (optional)

DATABASE TABLES:

Users (id, name, email, password, role)
Projects (id, name, description, createdBy)
ProjectMembers (userId, projectId, role)
Tasks (title, description, status, deadline, assignedTo, projectId)
etc.

API (Sample):

POST /auth/signup
POST /auth/login
GET /projects
POST /tasks
PUT /tasks/

## SETUP:

Clone repo
Install dependencies (npm install)
Configure .env (DB + JWT)
Run migrations
Start server



AUTHOR:
Nitin Parashar
