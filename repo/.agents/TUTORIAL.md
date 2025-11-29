# Tutorial: Building a Todolist Application

This tutorial provides a step-by-step guide on how to use the agents in this directory to build a simple todolist application.

## 1. Setting up the Project

First, you will need to create a new Next.js application. You can do this by running the following command in your terminal:

```bash
npx create-next-app@latest my-todolist-app
```

Once the application is created, you will need to install the Supabase client library:

```bash
npm install @supabase/supabase-js
```

## 2. Designing the Database

Next, you will need to design the database for your todolist application. You can use the `backend-architect` agent to do this. You can give the agent the following prompt:

> Design a Supabase database schema for a simple todolist application. The application should have a `todos` table with the following columns:
>
> *   `id`: a unique identifier for each todo
> *   `user_id`: the ID of the user who created the todo
> *   `task`: the task to be done
> *   `is_completed`: a boolean indicating whether the task is completed
> *   `inserted_at`: a timestamp of when the todo was created

## 3. Building the Frontend

Once the database is designed, you can start building the frontend. You can use the `frontend-developer` agent to do this. You can give the agent the following prompt:

> Create a Next.js page that displays a list of todos. The page should have a form for adding new todos and a button for marking todos as completed. The page should use the Supabase client library to fetch the todos from the database.

## 4. Adding Authentication

Next, you will need to add authentication to your application. You can use the `supabase-pro` agent to do this. You can give the agent the following prompt:

> Add Supabase authentication to the todolist application. The application should have a login page and a signup page. Once a user is logged in, they should only be able to see their own todos.

## 5. Writing Tests

Once the application is built, you will need to write tests for it. You can use the `test-automator` agent to do this. You can give the agent the following prompt:

> Write unit tests for the todolist application. The tests should cover the following:
>
> *   Adding a new todo
> *   Marking a todo as completed
> *   Deleting a todo

## 6. Deploying the Application

Finally, you will need to deploy the application. You can use the `deployment-engineer` agent to do this. You can give the agent the following prompt:

> Deploy the todolist application to Vercel. The application should be connected to a Supabase project.
