/*
  # Create initial schema for sales pipeline tracker

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `avatar_url` (text, optional)
      - `created_at` (timestamp)
    - `pipelines`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text, optional)
      - `stages` (jsonb array of stage objects)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamp)
    - `contacts`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, optional)
      - `phone` (text, optional)
      - `company` (text, optional)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamp)
    - `deals`
      - `id` (uuid, primary key)
      - `title` (text)
      - `value` (numeric)
      - `stage` (text)
      - `status` (text: open/won/lost)
      - `priority` (text: low/medium/high)
      - `pipeline_id` (uuid, references pipelines)
      - `contact_id` (uuid, references contacts, optional)
      - `created_by` (uuid, references profiles)
      - `stage_order` (integer for drag-and-drop ordering)
      - `notes` (text, optional)
      - `expected_close_date` (date, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create pipelines table
CREATE TABLE IF NOT EXISTS pipelines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  stages jsonb DEFAULT '[
    {"id": "prospecting", "name": "Prospecting", "color": "#3B82F6"},
    {"id": "qualification", "name": "Qualification", "color": "#8B5CF6"},
    {"id": "proposal", "name": "Proposal", "color": "#F59E0B"},
    {"id": "negotiation", "name": "Negotiation", "color": "#EF4444"},
    {"id": "closed", "name": "Closed", "color": "#10B981"}
  ]'::jsonb,
  created_by uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pipelines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own pipelines"
  ON pipelines
  FOR ALL
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  company text,
  created_by uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own contacts"
  ON contacts
  FOR ALL
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Create deals table
CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  value numeric DEFAULT 0,
  stage text NOT NULL DEFAULT 'prospecting',
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'won', 'lost')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  pipeline_id uuid REFERENCES pipelines(id) ON DELETE CASCADE NOT NULL,
  contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  created_by uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  stage_order integer DEFAULT 0,
  notes text DEFAULT '',
  expected_close_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own deals"
  ON deals
  FOR ALL
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deals_pipeline_stage ON deals(pipeline_id, stage);
CREATE INDEX IF NOT EXISTS idx_deals_created_by ON deals(created_by);
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_stage_order ON deals(stage, stage_order);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for deals updated_at
CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default pipeline for new users
CREATE OR REPLACE FUNCTION create_default_pipeline()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO pipelines (name, description, created_by)
  VALUES ('Default Pipeline', 'Your main sales pipeline', NEW.id);
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER create_default_pipeline_trigger
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_default_pipeline();