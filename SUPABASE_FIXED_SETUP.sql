-- 1. Create the Users table in public schema
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
-- 2. Enable RLS
ALTER TABLE public."Users" ENABLE ROW LEVEL SECURITY;
-- 3. DROP old policies if they exist (to avoid errors)
DROP POLICY IF EXISTS "Users can insert their own profile" ON public."Users";
DROP POLICY IF EXISTS "Users can read their own profile" ON public."Users";
DROP POLICY IF EXISTS "Users can update their own profile" ON public."Users";
DROP POLICY IF EXISTS "Anyone can read official users" ON public."Users";
-- 4. Create proper policies
-- Use 'public' or 'authenticated' based on whether you want to allow anonymous inserts
-- Since we are doing it from the frontend immediately after signup, it's best to allow 
-- authenticated users OR use the trigger method below.
CREATE POLICY "Allow authenticated users to read their own profile" ON public."Users" FOR
SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Allow authenticated users to update their own profile" ON public."Users" FOR
UPDATE TO authenticated USING (auth.uid() = id);
-- 5. THE ROBUST WAY: Use a trigger to auto-create the profile
-- This means the frontend DOES NO NEED to call .from('Users').insert()
-- The database does it automatically when auth.users is created.
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
-- Trigger the function every time a user is created in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- 6. Grant PERMISSIONS to the table for authenticated users
GRANT ALL ON public."Users" TO authenticated;
GRANT ALL ON public."Users" TO anon;
GRANT ALL ON public."Users" TO service_role;