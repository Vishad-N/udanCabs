# AGENTS.md

# Udan Cabs – AI Development Guidelines

## Project Overview

Udan Cabs is a taxi booking platform operating exclusively within **Ujjain, Madhya Pradesh**.

The platform consists of three major applications:

* Customer Website
* Admin Dashboard
* NestJS Backend API

The project must be developed using a modular, scalable architecture that supports future expansion without requiring major refactoring.

---

# Primary Goal

Build a clean, production-ready application that prioritizes:

* Maintainability
* Scalability
* Performance
* Security
* Developer Experience

The project should never sacrifice architecture for short-term convenience.

---

# Technology Stack

## Frontend

* Next.js (Latest App Router)
* TypeScript
* Tailwind CSS
* Shadcn/UI
* TanStack Query
* React Hook Form
* Zod
* Axios

---

## Backend

* NestJS
* Prisma ORM
* PostgreSQL
* JWT Authentication
* Swagger

---

## File Storage

* Local storage during development
* Cloudinary or AWS S3 in production

---

## Third-Party Services

* Google Maps Platform
* WhatsApp Business Cloud API

---

# Architecture Rules

Always follow:

* Feature-based architecture
* Modular architecture
* Single Responsibility Principle
* SOLID principles
* DRY (Don't Repeat Yourself)
* KISS (Keep It Simple)
* Dependency Injection
* Strong typing

Avoid tightly coupled code.

Every feature should be isolated inside its own module.

---

# Folder Structure

Maintain the following structure unless there is a compelling architectural reason to change it.

```text
frontend/
    client/
    admin/

backend/
    prisma/
    src/
        common/
        config/
        modules/
```

Never place business logic outside feature modules.

---

# Backend Rules

Each feature module must contain:

```text
module/

controller

service

dto

entities (if required)

interfaces (if required)

constants (if required)
```

Business logic belongs inside services.

Controllers should remain thin.

Never place business logic inside controllers.

---

# Frontend Rules

Organize code by feature.

Avoid creating large pages.

Break UI into reusable components.

Always reuse existing components whenever possible instead of creating new ones.

Example

```text
components/

buttons/

cards/

forms/

tables/

dialogs/

navigation/
```

Pages should compose reusable components rather than contain large amounts of UI logic.

---

# API Standards

REST API conventions:

```
GET

POST

PATCH

DELETE
```

Version every endpoint.

Example

```
/api/v1/bookings
```

Always return consistent response structures.

Example

```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {}
}
```

Use appropriate HTTP status codes.

---

# Database Rules

Use Prisma migrations only.

Never modify production schema manually.

Relationships must use foreign keys.

Prefer enums over free-form strings for statuses.

Soft delete records whenever historical data is important.

---

# Authentication

Only Admin authentication is required initially.

Use:

* JWT Access Token
* Refresh Token

Passwords must always be hashed.

Never store plaintext passwords.

---

# Error Handling

Always throw typed exceptions.

Never expose internal server errors to users.

Create reusable exception filters.

Return meaningful validation messages.

---

# Validation

Every request must be validated.

Use:

* class-validator
* Zod where appropriate on the frontend

Never trust frontend validation alone.

---

# Environment Variables

Never hardcode:

* API Keys
* JWT Secrets
* Database URLs
* Google Maps Keys
* WhatsApp Tokens

Use `.env` files.

Provide an `.env.example`.

---

# Logging

Log:

* Server startup
* Critical errors
* Booking creation
* Driver assignment
* Authentication failures

Never log secrets.

---

# Documentation

Whenever a new module is added:

* Update README if setup changes.
* Update API documentation.
* Keep Swagger annotations current.

---

# UI Guidelines

The design should be:

* Modern
* Clean
* Minimal
* Mobile-first
* Responsive
* Accessible

Avoid unnecessary animations.

Prioritize usability.

---

# Coding Standards

Use:

* Meaningful variable names
* Descriptive function names
* Small reusable functions
* Consistent formatting

Avoid magic numbers.

Avoid deeply nested logic.

---

# Git Guidelines

Use meaningful commit messages.

Example:

```
feat: implement booking module

fix: correct pricing calculation

refactor: improve vehicle service

docs: update setup instructions
```

---

# Performance

Optimize:

* Database queries
* API responses
* Image loading
* Component rendering

Avoid unnecessary re-renders.

Lazy load large modules where appropriate.

---

# Security

Always validate input.

Sanitize uploaded files.

Use Helmet.

Enable CORS correctly.

Never trust client input.

Protect all admin routes.

---

# Current Project Scope

The system currently includes:

* Taxi Booking
* Driver Management
* Vehicle Management
* Dynamic Pricing
* Tour Packages
* Two Wheeler Rentals
* About Us
* Contact Information
* WhatsApp Notifications
* Google Maps Integration

Do not implement features outside the approved scope unless explicitly requested.

---

# Future Features

The architecture should be prepared for:

* Online Payments
* Driver Mobile App
* Live Driver Tracking
* Multi-city Support
* Corporate Accounts
* Coupons
* Push Notifications
* Customer Accounts
* Analytics Dashboard

These should **not** be implemented now but should not require architectural changes later.

---

# Development Workflow

For every new task:

1. Analyze the existing architecture.
2. Reuse existing components and services where possible.
3. Avoid duplicate implementations.
4. Keep modules independent.
5. Maintain backward compatibility.
6. Write clean, production-ready code.
7. Test before considering the task complete.

Never introduce breaking changes without necessity.

---

# Definition of Done

A task is considered complete only when:

* Code compiles successfully.
* Linting passes.
* No TypeScript errors exist.
* No unused code remains.
* API documentation is updated.
* Database migrations (if any) are created.
* The implementation follows this AGENTS.md guide.
* The feature integrates cleanly with the existing architecture.
