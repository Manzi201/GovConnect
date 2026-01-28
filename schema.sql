-- GovConnect PostgreSQL Database Schema
-- Users Table
CREATE TABLE IF NOT EXISTS "Users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "phone" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(20) DEFAULT 'citizen',
    -- 'citizen', 'official', 'admin'
    "department" VARCHAR(255),
    "institution" VARCHAR(255),
    "serviceArea" VARCHAR(255),
    "designation" VARCHAR(255),
    "location" VARCHAR(255) DEFAULT 'Kigali',
    "profilePhoto" VARCHAR(255),
    "isActive" BOOLEAN DEFAULT TRUE,
    "isVerified" BOOLEAN DEFAULT FALSE,
    "verificationToken" VARCHAR(255),
    "resetPasswordToken" VARCHAR(255),
    "resetPasswordExpire" TIMESTAMP,
    "lastLogin" TIMESTAMP,
    "complaintsCount" INTEGER DEFAULT 0,
    "resolvedComplaintsCount" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Complaints Table
CREATE TABLE IF NOT EXISTS "Complaints" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "complaintId" VARCHAR(255) UNIQUE NOT NULL,
    "userId" UUID REFERENCES "Users"("id") ON DELETE
    SET NULL,
        "category" VARCHAR(50) NOT NULL,
        "title" VARCHAR(255) NOT NULL,
        "description" TEXT NOT NULL,
        "location" JSONB DEFAULT '{}',
        "attachments" JSONB DEFAULT '[]',
        "status" VARCHAR(20) DEFAULT 'submitted',
        -- 'submitted', 'in-progress', 'resolved', 'closed', 'rejected'
        "priority" VARCHAR(20) DEFAULT 'medium',
        -- 'low', 'medium', 'high', 'urgent'
        "isUrgent" BOOLEAN DEFAULT FALSE,
        "assignedTo" UUID REFERENCES "Users"("id") ON DELETE
    SET NULL,
        "resolution" JSONB,
        "feedback" JSONB,
        "isAnonymous" BOOLEAN DEFAULT FALSE,
        "views" INTEGER DEFAULT 0,
        "statusUpdates" JSONB DEFAULT '[]',
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Notifications Table
CREATE TABLE IF NOT EXISTS "Notifications" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE,
    "complaintId" UUID REFERENCES "Complaints"("id") ON DELETE CASCADE,
    "type" VARCHAR(50) NOT NULL,
    -- 'status_change', 'assignment', 'resolution', 'feedback', 'general'
    "channel" VARCHAR(20) DEFAULT 'in-app',
    -- 'in-app', 'email', 'sms', 'push'
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN DEFAULT FALSE,
    "readAt" TIMESTAMP,
    "metadata" JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Messages Table
CREATE TABLE IF NOT EXISTS "Messages" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "senderId" UUID NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE,
    "receiverId" UUID NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE,
    "complaintId" UUID REFERENCES "Complaints"("id") ON DELETE
    SET NULL,
        "content" TEXT NOT NULL,
        "isRead" BOOLEAN DEFAULT FALSE,
        "readAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- PerformanceMetrics Table
CREATE TABLE IF NOT EXISTS "PerformanceMetrics" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "date" DATE DEFAULT CURRENT_DATE,
    "totalComplaints" INTEGER DEFAULT 0,
    "resolvedComplaints" INTEGER DEFAULT 0,
    "pendingComplaints" INTEGER DEFAULT 0,
    "rejectedComplaints" INTEGER DEFAULT 0,
    "averageResolutionTime" FLOAT DEFAULT 0,
    "resolutionRate" FLOAT DEFAULT 0,
    "categoryBreakdown" JSONB DEFAULT '{}',
    "priorityBreakdown" JSONB DEFAULT '{}',
    "departmentPerformance" JSONB DEFAULT '[]',
    "districtPerformance" JSONB DEFAULT '[]',
    "satisfactionScore" FLOAT DEFAULT 0,
    "urgentComplaintsHandled" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);