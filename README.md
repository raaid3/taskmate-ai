# AI Task Scheduling App

This is a full-stack web application designed as an intelligent to-do list and task manager. The core of this application is your own personal AI rescheduling agent, allowing you to manage your calendar and tasks using natural language. It is built using a modern, type-safe technology stack and is structured as a monorepo to manage the frontend and backend codebases efficiently.

The AI assistant is powered by the `o3-mini` LLM, hosted and accessed via the Azure OpenAI service.

## Key Features

- **AI Personal Rescheduling Agent:** The AI assistant acts as a personal calendar expert, utilizing a model hosted on Azure OpenAI. It can read, write, update, and delete events on your calendar based on natural language commands. This allows for seamless and intuitive calendar management.
- **Task Management:** Create, view, and manage to-do items with details like title, description, type, and scheduling information.
- **User Authentication:** Secure user sign-up and login via Auth0 to manage personal to-do lists.
- **Calendar View:** Utilizes FullCalendar to provide a visual interface for tasks and events.
- **End-to-End Type-Safety:** A tRPC API ensures type safety between the frontend and backend, improving developer experience and reducing runtime errors.

## Future Features

- **Calendar Integration:** Support for importing and syncing calendars from Google Calendar and Outlook Calendar is coming soon.

## Technology Stack

This project utilizes a range of modern technologies to deliver a robust and efficient application:

- **Core Technologies:** TypeScript, React, Node.js, Vite, Express, PostgreSQL, Prisma, tRPC, Auth0, Azure OpenAI
- **Architecture:** Monorepo managed with **pnpm workspaces** and **Turborepo**.
- **Backend:** Node.js, Express, TypeScript, tRPC, Prisma (ORM for PostgreSQL), Azure OpenAI.
- **Frontend:** React, TypeScript, Vite, TanStack React Query, Tailwind CSS, FullCalendar.
- **Authentication:** Auth0 for login and session management, with JWT validation on the backend.
- **Testing:** Vitest for unit and integration tests across the stack.
