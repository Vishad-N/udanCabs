# Local Development Guide

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL running locally

## Database Setup

1. Ensure PostgreSQL is running.
2. The default connection string used in development is `postgresql://postgres:postgres@localhost:5432/udan_cabs?schema=public`. If your local setup differs, please update the `.env` file in the `backend` folder once created.

## Running the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env` and adjust variables if needed.
4. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run start:dev
   ```
   The backend API will be running on `http://localhost:3000`. Swagger documentation is available at `http://localhost:3000/api/docs`.

## Running the Client Frontend

1. Navigate to the client directory:
   ```bash
   cd frontend/client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables by copying `.env.example` to `.env.local`.
4. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be running on `http://localhost:3001` (or whichever port Next.js assigns).

## Running the Admin Frontend

1. Navigate to the admin directory:
   ```bash
   cd frontend/admin
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables by copying `.env.example` to `.env.local`.
4. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be running on `http://localhost:3002` (or whichever port Next.js assigns).
