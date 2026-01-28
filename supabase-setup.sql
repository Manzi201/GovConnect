-- Supabase Setup Script for GovConnect
-- Run this in your Supabase SQL Editor: https://app.supabase.com/project/YOUR_PROJECT/sql
-- 1. Create Users table if it doesn't exist (matching your schema.sql)
CREATE TABLE IF NOT EXISTS public."Users" (
    "id" UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "phone" VARCHAR(255) NOT NULL,
    "role" VARCHAR(20) DEFAULT 'citizen',
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
-- 2. Enable Row Level Security
ALTER TABLE public."Users" ENABLE ROW LEVEL SECURITY;
-- 3. Create RLS Policies
-- Policy: Allow users to insert their own profile during registration
CREATE POLICY "Users can insert their own profile during registration" ON public."Users" FOR
INSERT TO authenticated WITH CHECK (auth.uid() = id);
-- Policy: Allow users to read their own profile
CREATE POLICY "Users can read their own profile" ON public."Users" FOR
SELECT TO authenticated USING (auth.uid() = id);
-- Policy: Allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON public."Users" FOR
UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
-- Policy: Allow anyone to read official users (for directory)
CREATE POLICY "Anyone can read official users" ON public."Users" FOR
SELECT TO authenticated USING (
        role = 'official'
        OR role = 'admin'
    );
-- 4. Create function to automatically update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW."updatedAt" = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ language 'plpgsql';
-- 5. Create trigger to auto-update updatedAt
DROP TRIGGER IF EXISTS update_users_updated_at ON public."Users";
CREATE TRIGGER update_users_updated_at BEFORE
UPDATE ON public."Users" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- 6. Grant permissions
GRANT ALL ON public."Users" TO authenticated;
GRANT ALL ON public."Users" TO service_role;
-- Verify the setup
SELECT 'Setup complete! Users table created with RLS policies.' as status;