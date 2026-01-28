# GovConnect - Integrated Public Service Platform

A comprehensive digital platform for Rwanda's public service delivery, combining citizen complaint resolution with government analytics dashboards.

## 📋 Project Overview

GovConnect integrates two core functions:

1. **Citizen Complaint Resolution System (DCCRS)** - Enable citizens to submit, track, and provide feedback on complaints
2. **Public Service Performance Platform (PSPP)** - Provide authorities with dashboards and analytics for monitoring performance

## 🏗️ Project Structure

```text
GovConnect/
├── backend/           # Node.js + Express.js backend (SQL/Sequelize)
├── frontend/          # React.js frontend (MUI + Glassmorphism)
├── database/          # Database schemas & migrations
├── docs/             # Documentation
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js v16+
- PostgreSQL
- npm or yarn

### Setup

1. **Database Setup**:
   - Create a PostgreSQL database named `govconnect`.
   - Run the contents of `schema.sql` to initialize tables.

2. **Backend Setup**:
   - `cp .env.example .env` in the root (or backend folder if separated).
   - Update `.env` with your DB credentials and JWT secret.
   - `npm install`
   - `npm run dev`

3. **Frontend Setup**:
   - `cd frontend`
   - `npm install`
   - `npm start`

Access the application at `http://localhost:3000`

## 🔗 API Endpoints

### Authentication

- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PATCH /api/users/profile` - Update profile
- `GET /api/users/search-officials` - Search for government officials

### Complaints

- `POST /api/complaints` - Submit complaint
- `GET /api/complaints` - Get complaints (with filters)
- `GET /api/complaints/:id` - Get complaint details
- `PATCH /api/complaints/:id` - Update complaint status
- `POST /api/complaints/:id/feedback` - Submit feedback

### Analytics (Admin/Official only)

- `GET /api/analytics/dashboard` - Get dashboard metrics
- `GET /api/analytics/performance` - Get performance metrics

### Messages

- `GET /api/messages/:otherUserId` - Get message history
- `POST /api/messages` - Send a message

## 💾 Database Entities

- **Users** - Citizens, officials, admin users
- **Complaints** - Submitted complaints with status tracking
- **Notifications** - Real-time updates for users
- **Messages** - Direct communication between citizens and officials
- **PerformanceMetrics** - Analytics and KPIs

## 🛠️ Technology Stack

- **Frontend:** React.js, Material-UI, Recharts, Socket.io-client
- **Backend:** Node.js, Express.js, PostgreSQL, Sequelize, Socket.io
- **Authentication:** JWT
- **Design:** Glassmorphism, Premium Cultural Aesthetics

## 👥 User Roles

1. **Citizen** - Submit complaints, track status, chat with officials
2. **Official** - Manage complaints, update status, respond to citizens
3. **Admin** - System administration, reports, high-level analytics

---

**Version:** 1.0.0  
**Last Updated:** January 28, 2026
