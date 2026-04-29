# Team Task Manager

Full-stack project management app with React, Node, Express, and Postgres.

## Structure

- `backend` - Express REST API with clean layers: routes, controllers, services, repositories, Sequelize models, validators, middleware.
- `frontend` - React + Vite frontend with route guards and role-aware screens.

## Setup

1. Install dependencies:

   ```bash
   npm run install:all
   npm install
   ```

2. Create a local Postgres database.

3. Copy env files:

   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

4. Update `backend/.env` with your Postgres connection:

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=team_task_manager
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   DB_SYNC=true
   ```

5. Start both apps:

   ```bash
   npm run dev
   ```

With `DB_SYNC=true`, Sequelize will create or alter the local tables from the backend models when the API starts.

## Default Roles

- `ADMIN` can create projects, manage project members, and create/update/delete tasks.
- `MEMBER` can view assigned/member projects and update task status for tasks assigned to them.
