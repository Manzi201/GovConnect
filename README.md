# GovConnect - Integrated Public Service Platform

A comprehensive digital platform for Rwanda's public service delivery, combining citizen complaint resolution with government analytics dashboards.

## 📋 Project Overview

GovConnect integrates two core functions:

1. **Citizen Complaint Resolution System (DCCRS)** - Enable citizens to submit, track, and provide feedback on complaints
2. **Public Service Performance Platform (PSPP)** - Provide authorities with dashboards and analytics for monitoring performance

## 🏗️ Project Structure

```
GovConnect/
├── backend/           # Node.js + Express.js backend
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API endpoints
│   ├── controllers/   # Business logic
│   ├── middleware/    # Auth & validation
│   ├── utils/         # Helper functions
│   └── server.js      # Entry point
│
├── frontend/          # React.js frontend
│   ├── src/
│   │   ├── pages/     # Page components
│   │   ├── components/# Reusable components
│   │   ├── services/  # API services
│   │   ├── stores/    # State management
│   │   └── App.js     # Main app component
│   └── public/        # Static files
│
├── database/          # Database schemas & migrations
├── docs/             # Documentation
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js v16+
- MongoDB
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your configuration
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Access the application at `http://localhost:3000`

## 🔗 API Endpoints

### Authentication

- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PATCH /api/users/profile` - Update profile

### Complaints

- `POST /api/complaints` - Submit complaint
- `GET /api/complaints` - Get all complaints
- `GET /api/complaints/:id` - Get complaint details
- `PATCH /api/complaints/:id` - Update complaint status
- `POST /api/complaints/:id/feedback` - Submit feedback

### Analytics (Admin/Official only)

- `GET /api/analytics/dashboard` - Get dashboard metrics
- `GET /api/analytics/performance` - Get performance metrics
- `GET /api/analytics/district-performance` - District-wise analysis

### Notifications

- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark as read

## 💾 Database Collections

- **Users** - Citizens, officials, admin users
- **Complaints** - Submitted complaints with status tracking
- **Notifications** - Real-time updates for users
- **PerformanceMetrics** - Analytics and KPIs

## 🔐 Features

✅ User authentication (JWT)
✅ Complaint submission & tracking
✅ Real-time status updates (WebSockets)
✅ Notifications (SMS/Email)
✅ Analytics dashboards
✅ Priority escalation
✅ Citizen feedback & ratings
✅ Anonymous submissions
✅ District/sector performance monitoring

## 👥 User Roles

1. **Citizen** - Submit complaints, track status, provide feedback
2. **Official** - Manage complaints, update status, view analytics
3. **Admin** - System administration, user management, reports

## 🛠️ Technology Stack

- **Frontend:** React.js, Material-UI, Recharts, Socket.io-client
- **Backend:** Node.js, Express.js, MongoDB, Socket.io
- **Authentication:** JWT (jwt-simple)
- **Notifications:** Twilio (SMS), Firebase (Email/Push)
- **Hosting:** AWS/Heroku/DigitalOcean

## 📞 Support

For issues or questions, contact: support@govconnect.rw

## 📄 License

MIT License - See LICENSE file for details

## 🌍 Contributing

Contributions are welcome! Please follow our coding standards and submit pull requests to the development branch.

---

**Version:** 1.0.0  
**Last Updated:** January 27, 2024
