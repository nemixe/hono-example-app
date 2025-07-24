# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a RESTful API for **CV. Amanah Elektronik**, an electronics rental company. Built with Hono.js and Bun runtime, it provides JWT-authenticated endpoints for managing electronic equipment inventory with full CRUD operations.

## Development Commands

- **Install dependencies**: `bun install`
- **Generate database migrations**: `bun run db:generate` 
- **Run database migrations**: `bun run migrate.ts`
- **Start development server**: `bun run dev` (runs with hot reload on port 8000)
- **Test API endpoints**: `bun run test-api.ts`
- **Access application**: http://localhost:8000

## Architecture

- **Runtime**: Bun with TypeScript support
- **Framework**: Hono.js - lightweight web framework
- **Database**: SQLite with Drizzle ORM (bun:sqlite driver)
- **Authentication**: JWT tokens with bcrypt password hashing
- **Validation**: Zod schema validation with structured error responses
- **Port**: 8000 (as specified in requirements)

## API Endpoints

### Authentication (Public)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Equipment Management
- `GET /api/alat` - List all equipment (public)
- `GET /api/alat/{id}` - Get equipment by ID (public)  
- `POST /api/alat` - Create equipment (requires auth)
- `PATCH /api/alat/{id}` - Update equipment (requires auth)
- `DELETE /api/alat/{id}` - Delete equipment (requires auth)

## Project Structure

```
src/
├── index.ts              # Main app with middleware and routing
├── middleware/           # Auth, validation, error handling
├── routes/              # API route handlers (alat, auth)
├── models/              # Database schema and connection
├── utils/               # Response helpers, JWT utilities
└── types/               # TypeScript interfaces
```

## Database Schema

- `alat_kategori` - Equipment categories (Smartphone, Laptop, Camera)
- `alat` - Equipment items with category foreign key
- `users` - User accounts for authentication

## Response Format

All endpoints return standardized JSON responses:
```json
{
  "success": boolean,
  "message": string,
  "data": object|array|null,
  "errors": object|string|null
}
```

## Development Notes

- Uses Drizzle ORM with bun:sqlite driver for better Bun compatibility
- JWT authentication required for POST/PATCH/DELETE operations
- Validation errors return 422 status with detailed field errors
- Server-side validation mandatory for all user inputs
- CORS and logging middleware enabled for development