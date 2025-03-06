# Moneturn

Moneturn is a book library application with a TypeScript backend (Fastify) and a TypeScript frontend. This README provides instructions for setting up and running the project.

## System Requirements

- Node.js (v18+)
- npm or pnpm (pnpm recommended)
- Docker and Docker Compose
- Git

## Project Structure

- `/backend` - Fastify API with TypeScript
- `/frontend` - TypeScript frontend application
- `/docker-compose.yml` - Docker Compose configuration for PostgreSQL

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd moneturn
```

### 2. Database Setup

The project uses PostgreSQL as its database, which is configured in the `docker-compose.yml` file. Start the database with:

```bash
docker-compose up -d
```

This will start a PostgreSQL instance with the following configuration:
- **Port**: 5432
- **Username**: postgres
- **Password**: postgres
- **Database**: moneturn

### 3. Backend Setup

```bash
cd backend
pnpm install  # or npm install

# Generate Prisma client and run migrations
pnpm migrate:dev
pnpm prisma generate

# Start the development server
pnpm dev
```

The backend will run on http://localhost:3000 by default.

### 4. Frontend Setup

```bash
cd frontend
pnpm install  # or npm install

# Start the development server
pnpm dev
```

The frontend will run on http://localhost:5173 by default.

## Development Workflow

### Backend Development

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build the backend
- `pnpm start` - Start the production server
- `pnpm test` - Run tests
- `pnpm migrate:dev` - Run Prisma migrations in development
- `pnpm migrate:deploy` - Deploy Prisma migrations in production

### Database Management

- View database with Prisma Studio: `cd backend && pnpm prisma studio`
- Reset database: `cd backend && pnpm prisma migrate reset`

### Stopping the Database

When you're done working with the project, you can stop the database container:

```bash
docker-compose down
```

Use `docker-compose down -v` if you want to remove the database volume as well.

## Technical Considerations

### How scalable is the backend?
The backend uses Fastify with a modular architecture for horizontal scaling and Prisma's connection pooling for efficient database management.

### How maintainable is the code?
Maintainability is achieved through TypeScript typing, separation of concerns, consistent naming conventions, and SOLID principles.

### Which library is used to interact with the database?
Prisma ORM is used for database interactions.

### How DRY is the code?
Code reusability is implemented through utility functions, shared validation schemas, and a plugin architecture that avoids duplication.

### How testable is the code?
The codebase is designed for testability with Jest, dependency injection, Fastify's injection API, and separation of business logic from framework code.
