-- GovConnect Unified Supabase Schema
-- This file combines core table definitions with Supabase Auth integration and RLS policies.
-- ==========================================
-- 1. USERS TABLE (Linked to Supabase Auth)
-- ==========================================
CREATE TABLE IF NOT EXISTS public."Users" (
    "id" UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "phone" VARCHAR(255) NOT NULL,
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
    "complaintsCount" INTEGER DEFAULT 0,
    "resolvedComplaintsCount" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- ==========================================
-- 2. COMPLAINTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public."Complaints" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "complaintId" VARCHAR(255) UNIQUE NOT NULL,
    "userId" UUID REFERENCES public."Users"("id") ON DELETE
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
        "assignedTo" UUID REFERENCES public."Users"("id") ON DELETE
    SET NULL,
        "resolution" JSONB,
        "feedback" JSONB,
        "isAnonymous" BOOLEAN DEFAULT FALSE,
        "views" INTEGER DEFAULT 0,
        "statusUpdates" JSONB DEFAULT '[]',
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- ==========================================
-- 3. NOTIFICATIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public."Notifications" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES public."Users"("id") ON DELETE CASCADE,
    "complaintId" UUID REFERENCES public."Complaints"("id") ON DELETE CASCADE,
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
-- ==========================================
-- 4. MESSAGES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public."Messages" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "senderId" UUID NOT NULL REFERENCES public."Users"("id") ON DELETE CASCADE,
    "receiverId" UUID NOT NULL REFERENCES public."Users"("id") ON DELETE CASCADE,
    "complaintId" UUID REFERENCES public."Complaints"("id") ON DELETE
    SET NULL,
        "content" TEXT NOT NULL,
        "isRead" BOOLEAN DEFAULT FALSE,
        "readAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- ==========================================
-- 5. PERFORMANCE METRICS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public."PerformanceMetrics" (
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
-- ==========================================
-- 6. ROW LEVEL SECURITY (RLS) & POLICIES
-- ==========================================
-- Enable RLS on all tables
ALTER TABLE public."Users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Complaints" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Notifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."PerformanceMetrics" ENABLE ROW LEVEL SECURITY;
-- 👤 USERS POLICIES
DROP POLICY IF EXISTS "Users can read their own profile" ON public."Users";
DROP POLICY IF EXISTS "Users can update their own profile" ON public."Users";
DROP POLICY IF EXISTS "Anyone can read official users" ON public."Users";
CREATE POLICY "Users can read their own profile" ON public."Users" FOR
SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public."Users" FOR
UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Anyone can read official users" ON public."Users" FOR
SELECT TO authenticated USING (
        role = 'official'
        OR role = 'admin'
    );
-- 📋 COMPLAINTS POLICIES
DROP POLICY IF EXISTS "Citizens can view their own complaints" ON public."Complaints";
DROP POLICY IF EXISTS "Citizens can insert complaints" ON public."Complaints";
DROP POLICY IF EXISTS "Officials can view all complaints" ON public."Complaints";
CREATE POLICY "Citizens can view their own complaints" ON public."Complaints" FOR
SELECT TO authenticated USING (auth.uid() = "userId");
CREATE POLICY "Citizens can insert complaints" ON public."Complaints" FOR
INSERT TO authenticated WITH CHECK (auth.uid() = "userId");
CREATE POLICY "Officials can view all complaints" ON public."Complaints" FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM public."Users"
            WHERE id = auth.uid()
                AND (
                    role = 'official'
                    OR role = 'admin'
                )
        )
    );
-- ==========================================
-- 7. AUTOMATION (TRIGGERS & FUNCTIONS)
-- ==========================================
-- A. Auto-create User Profile on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$ BEGIN
INSERT INTO public."Users" (id, name, email, phone, location, role)
VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'name', 'User'),
        new.email,
        COALESCE(new.raw_user_meta_data->>'phone', ''),
        COALESCE(new.raw_user_meta_data->>'location', 'Kigali'),
        'citizen'
    );
RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- B. Auto-update updatedAt timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW."updatedAt" = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ language 'plpgsql';
-- Apply updatedAt trigger to all tables
DROP TRIGGER IF EXISTS update_users_modtime ON public."Users";
CREATE TRIGGER update_users_modtime BEFORE
UPDATE ON public."Users" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_complaints_modtime ON public."Complaints";
CREATE TRIGGER update_complaints_modtime BEFORE
UPDATE ON public."Complaints" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- ==========================================
-- 8. PERMISSIONS
-- ==========================================
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;