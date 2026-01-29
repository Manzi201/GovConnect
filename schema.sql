-- GovConnect UNIFIED CLEAN Schema
-- This file combines all tables with a fresh-start logic (drops first) and robust Supabase integration.
-- WARNING: Running this script will DELETE all existing database data.
-- ==========================================
-- 1. CLEAN SLATE: Reset Everything
-- ==========================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.update_updated_at_column();
DROP TABLE IF EXISTS public."PerformanceMetrics" CASCADE;
DROP TABLE IF EXISTS public."Messages" CASCADE;
DROP TABLE IF EXISTS public."Notifications" CASCADE;
DROP TABLE IF EXISTS public."Complaints" CASCADE;
DROP TABLE IF EXISTS public."Users" CASCADE;
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- ==========================================
-- 2. TABLES DEFINITION
-- ==========================================
-- USERS TABLE (Linked to Supabase Auth)
CREATE TABLE public."Users" (
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
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- COMPLAINTS TABLE
CREATE TABLE public."Complaints" (
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
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- NOTIFICATIONS TABLE
CREATE TABLE public."Notifications" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES public."Users"("id") ON DELETE CASCADE,
    "complaintId" UUID REFERENCES public."Complaints"("id") ON DELETE CASCADE,
    "type" VARCHAR(50) NOT NULL,
    -- 'status_change', 'assignment', 'resolution', 'feedback', 'general'
    "channel" VARCHAR(20) DEFAULT 'in-app',
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN DEFAULT FALSE,
    "readAt" TIMESTAMP WITH TIME ZONE,
    "metadata" JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- MESSAGES TABLE
CREATE TABLE public."Messages" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "senderId" UUID NOT NULL REFERENCES public."Users"("id") ON DELETE CASCADE,
    "receiverId" UUID NOT NULL REFERENCES public."Users"("id") ON DELETE CASCADE,
    "complaintId" UUID REFERENCES public."Complaints"("id") ON DELETE
    SET NULL,
        "content" TEXT NOT NULL,
        "isRead" BOOLEAN DEFAULT FALSE,
        "readAt" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- PERFORMANCE METRICS TABLE
CREATE TABLE public."PerformanceMetrics" (
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
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- ==========================================
-- 3. SECURITY & POLICIES (RLS)
-- ==========================================
ALTER TABLE public."Users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Complaints" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Notifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Messages" ENABLE ROW LEVEL SECURITY;
-- USERS POLICIES
CREATE POLICY "Profiles are viewable by everyone" ON public."Users" FOR
SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public."Users" FOR
UPDATE USING (auth.uid() = id);
-- COMPLAINTS POLICIES
CREATE POLICY "Users can view relevant complaints" ON public."Complaints" FOR
SELECT USING (
        auth.uid() = "userId"
        OR EXISTS (
            SELECT 1
            FROM public."Users"
            WHERE id = auth.uid()
                AND (
                    role = 'official'
                    OR role = 'admin'
                )
        )
    );
CREATE POLICY "Users can create complaints" ON public."Complaints" FOR
INSERT WITH CHECK (auth.uid() = "userId");
-- MESSAGES POLICIES
CREATE POLICY "Users can view their own messages" ON public."Messages" FOR
SELECT USING (
        auth.uid() = "senderId"
        OR auth.uid() = "receiverId"
    );
CREATE POLICY "Users can send messages" ON public."Messages" FOR
INSERT WITH CHECK (auth.uid() = "senderId");
-- ==========================================
-- 4. AUTOMATION & TRIGGERS
-- ==========================================
-- Function: create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$ BEGIN
INSERT INTO public."Users" (id, name, email, phone, location, role)
VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'name', 'Citizen'),
        new.email,
        COALESCE(new.raw_user_meta_data->>'phone', 'N/A'),
        COALESCE(new.raw_user_meta_data->>'location', 'Kigali'),
        'citizen'
    ) ON CONFLICT (id) DO NOTHING;
RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- Function: auto-update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS trigger AS $$ BEGIN NEW."updatedAt" = timezone('utc'::text, now());
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER update_users_modtime BEFORE
UPDATE ON public."Users" FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_complaints_modtime BEFORE
UPDATE ON public."Complaints" FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
-- ==========================================
-- 5. PERMISSIONS
-- ==========================================
GRANT USAGE ON SCHEMA public TO anon,
    authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon,
    authenticated,
    service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon,
    authenticated,
    service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon,
    authenticated,
    service_role;