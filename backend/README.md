# GovConnect Backend

Node.js + Express.js backend for the GovConnect integrated public service platform.

## Features

- User authentication & authorization
- Complaint submission and tracking
- Real-time notifications (SMS/Email)
- Analytics dashboard
- Real-time updates via WebSockets

## Prerequisites

- Node.js v16+
- MongoDB
- Twilio account
- Firebase account
- Cloudinary account

## Installation

```bash
npm install
```

## Configuration

1. Copy `.env.example` to `.env`
2. Update environment variables with your credentials

## Running

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

## API Endpoints

### Users

- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/:id` - Get user profile

### Complaints

- `POST /api/complaints` - Submit complaint
- `GET /api/complaints` - Get complaints
- `GET /api/complaints/:id` - Get complaint details
- `PATCH /api/complaints/:id` - Update complaint status
- `DELETE /api/complaints/:id` - Delete complaint

### Analytics

- `GET /api/analytics/dashboard` - Get analytics dashboard
- `GET /api/analytics/performance` - Get performance metrics

### Notifications

- `GET /api/notifications/:userId` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark as read

## Real-time Events

Socket.io events for real-time updates:

- `complaint-status-update` - Complaint status changed
- `new-complaint` - New complaint submitted
- `urgent-complaint` - Urgent complaint flagged
