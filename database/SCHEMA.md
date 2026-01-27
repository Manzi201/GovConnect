# GovConnect Database Schema

## Collections

### Users

Stores user information for citizens, officials, and administrators.

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  phone: String (required, Rwandan format),
  password: String (hashed),
  role: String (enum: 'citizen', 'official', 'admin'),
  department: String,
  location: String,
  profilePhoto: String,
  isActive: Boolean,
  isVerified: Boolean,
  lastLogin: Date,
  complaintsCount: Number,
  resolvedComplaintsCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Complaints

Stores all submitted complaints and their status.

```javascript
{
  _id: ObjectId,
  complaintId: String (unique, auto-generated),
  userId: ObjectId (ref: 'User'),
  category: String (enum: various categories),
  title: String,
  description: String,
  location: {
    district: String,
    sector: String,
    cell: String,
    coordinates: { latitude, longitude }
  },
  attachments: [{ url, type, uploadedAt }],
  status: String (enum: 'submitted', 'in-progress', 'resolved', 'closed', 'rejected'),
  priority: String (enum: 'low', 'medium', 'high', 'urgent'),
  isUrgent: Boolean,
  assignedTo: ObjectId (ref: 'User'),
  resolution: {
    description: String,
    resolvedAt: Date,
    resolvedBy: ObjectId (ref: 'User')
  },
  feedback: {
    rating: Number (1-5),
    comment: String,
    submittedAt: Date
  },
  isAnonymous: Boolean,
  views: Number,
  statusUpdates: [{ status, message, updatedAt, updatedBy }],
  submittedAt: Date,
  updatedAt: Date
}
```

### Notifications

Stores notification history for users.

```javascript
{
  _id: ObjectId,
  notificationId: String (unique),
  userId: ObjectId (ref: 'User'),
  complaintId: ObjectId (ref: 'Complaint'),
  type: String (enum: 'status-update', 'new-comment', 'feedback-request', 'escalation', 'system'),
  channel: String (enum: 'email', 'sms', 'in-app', 'push'),
  subject: String,
  message: String,
  isRead: Boolean,
  readAt: Date,
  actionUrl: String,
  sentAt: Date,
  deliveredAt: Date,
  failureReason: String,
  retryCount: Number,
  createdAt: Date
}
```

### PerformanceMetrics

Stores analytics and performance data.

```javascript
{
  _id: ObjectId,
  date: Date,
  totalComplaints: Number,
  resolvedComplaints: Number,
  pendingComplaints: Number,
  rejectedComplaints: Number,
  averageResolutionTime: Number,
  resolutionRate: Number,
  categoryBreakdown: Map,
  priorityBreakdown: Map,
  departmentPerformance: [{ department, totalHandled, resolved, averageTime }],
  districtPerformance: [{ district, totalComplaints, resolved, pendingResolution }],
  satisfactionScore: Number,
  urgentComplaintsHandled: Number,
  createdAt: Date
}
```

## Indexes

For better query performance:

```javascript
// Users
db.users.createIndex({ email: 1 });
db.users.createIndex({ phone: 1 });

// Complaints
db.complaints.createIndex({ userId: 1, submittedAt: -1 });
db.complaints.createIndex({ status: 1 });
db.complaints.createIndex({ priority: 1 });
db.complaints.createIndex({ category: 1 });
db.complaints.createIndex({ location.district: 1 });

// Notifications
db.notifications.createIndex({ userId: 1, isRead: 1 });
db.notifications.createIndex({ createdAt: -1 });

// Performance Metrics
db.performanceMetrics.createIndex({ date: -1 });
```

## Data Relationships

- **User → Complaints** (1:M) - One user can have many complaints
- **User → Notifications** (1:M) - One user can have many notifications
- **Complaint → Notifications** (1:M) - One complaint can generate many notifications
- **User → Assigned Complaints** (1:M) - Official can be assigned multiple complaints

## Sample Data

See `backend/utils/seed.js` for seeding sample data during development.

---

**Database:** MongoDB
**Driver:** Mongoose v7.0.0
