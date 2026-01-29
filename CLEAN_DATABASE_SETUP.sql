-- GovConnect CLEAN SLATE Schema
-- WARNING: This will DELETE all existing data. Use this for a fresh, working installation.
-- 1. Drop EVERYTHING first to ensure no conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public."PerformanceMetrics" CASCADE;
DROP TABLE IF EXISTS public."Messages" CASCADE;
DROP TABLE IF EXISTS public."Notifications" CASCADE;
DROP TABLE IF EXISTS public."Complaints" CASCADE;
DROP TABLE IF EXISTS public."Users" CASCADE;
-- 2. Create the Users table (Properly linked to Auth)
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
-- 3. Complaints Table
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
        "priority" VARCHAR(20) DEFAULT 'medium',
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
-- 4. Set up Row Level Security (RLS)
ALTER TABLE public."Users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Complaints" ENABLE ROW LEVEL SECURITY;
-- 5. Policies for Users
CREATE POLICY "Public profiles are viewable by everyone" ON public."Users" FOR
SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public."Users" FOR
UPDATE USING (auth.uid() = id);
-- 6. Policies for Complaints
CREATE POLICY "Users can view their own complaints" ON public."Complaints" FOR
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
-- 7. THE TRIGGER: Auto-create profile on signup
-- This is what fixes the "Database error saving new user"
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
-- 8. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- 9. Grant permissions
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