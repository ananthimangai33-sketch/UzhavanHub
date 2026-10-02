/*
# UzhavanHub - Smart Farmer Market & Price Discovery Platform

## Overview
Creates the complete database schema for UzhavanHub, a platform connecting farmers with markets and buyers.
Supports three user roles: farmer, buyer, admin.

## New Tables
1. `profiles` - Extends auth.users with role (farmer/buyer/admin), name, phone, location, district, state
2. `farmers` - Farmer-specific data (main_crop, farm_location)
3. `buyers` - Buyer-specific data (business_name, verification_status, required_crops)
4. `crops` - Catalog of crops with categories
5. `crop_listings` - Farmers listing their crops for sale
6. `buyer_requests` - Buyers requesting specific crops
7. `messages` - Chat messages between farmers and buyers
8. `notifications` - User notifications
9. `market_prices` - Market price data per crop per market per day
10. `weather_alerts` - Weather alerts per location
11. `price_predictions` - Price prediction data per crop

## Security
- RLS enabled on all tables
- Owner-scoped policies for user data (profiles, farmers, buyers, crop_listings, messages, notifications)
- Authenticated users can read public data (crops, market_prices, buyer_requests, weather_alerts, price_predictions)
- All owner columns default to auth.uid()
*/ 

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  role text NOT NULL DEFAULT 'farmer' CHECK (role IN ('farmer', 'buyer', 'admin')),
  location text,
  district text,
  state text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- All authenticated users can read profiles (to see buyer/farmer info)
DROP POLICY IF EXISTS "read_all_profiles" ON profiles;
CREATE POLICY "read_all_profiles" ON profiles FOR SELECT
  TO authenticated USING (true);

-- Farmers table
CREATE TABLE IF NOT EXISTS farmers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  main_crop text,
  farm_location text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_all_farmers" ON farmers;
CREATE POLICY "select_all_farmers" ON farmers FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_farmer" ON farmers;
CREATE POLICY "insert_own_farmer" ON farmers FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_farmer" ON farmers;
CREATE POLICY "update_own_farmer" ON farmers FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_farmer" ON farmers;
CREATE POLICY "delete_own_farmer" ON farmers FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Buyers table
CREATE TABLE IF NOT EXISTS buyers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  verification_status text NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  required_crops text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_all_buyers" ON buyers;
CREATE POLICY "select_all_buyers" ON buyers FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_buyer" ON buyers;
CREATE POLICY "insert_own_buyer" ON buyers FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_buyer" ON buyers;
CREATE POLICY "update_own_buyer" ON buyers FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_buyer" ON buyers;
CREATE POLICY "delete_own_buyer" ON buyers FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Crops catalog
CREATE TABLE IF NOT EXISTS crops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  category text NOT NULL CHECK (category IN ('Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Flowers')),
  unit text NOT NULL DEFAULT 'kg',
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE crops ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_crops" ON crops;
CREATE POLICY "read_crops" ON crops FOR SELECT
  TO authenticated USING (true);

-- Crop listings
CREATE TABLE IF NOT EXISTS crop_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  crop_name text NOT NULL,
  quantity numeric NOT NULL,
  unit text NOT NULL DEFAULT 'kg',
  expected_price numeric NOT NULL,
  quality_grade text NOT NULL DEFAULT 'B' CHECK (quality_grade IN ('A', 'B', 'C')),
  harvest_date date,
  location text,
  description text,
  image_url text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'buyer_interested', 'sold')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE crop_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_all_listings" ON crop_listings;
CREATE POLICY "select_all_listings" ON crop_listings FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_listing" ON crop_listings;
CREATE POLICY "insert_own_listing" ON crop_listings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = farmer_id);

DROP POLICY IF EXISTS "update_own_listing" ON crop_listings;
CREATE POLICY "update_own_listing" ON crop_listings FOR UPDATE
  TO authenticated USING (auth.uid() = farmer_id) WITH CHECK (auth.uid() = farmer_id);

DROP POLICY IF EXISTS "delete_own_listing" ON crop_listings;
CREATE POLICY "delete_own_listing" ON crop_listings FOR DELETE
  TO authenticated USING (auth.uid() = farmer_id);

-- Buyer requests
CREATE TABLE IF NOT EXISTS buyer_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  crop_name text NOT NULL,
  quantity numeric NOT NULL,
  unit text NOT NULL DEFAULT 'kg',
  offered_price numeric NOT NULL,
  location text,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'negotiating', 'accepted', 'rejected', 'closed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE buyer_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_all_requests" ON buyer_requests;
CREATE POLICY "select_all_requests" ON buyer_requests FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_request" ON buyer_requests;
CREATE POLICY "insert_own_request" ON buyer_requests FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = buyer_id);

DROP POLICY IF EXISTS "update_own_request" ON buyer_requests;
CREATE POLICY "update_own_request" ON buyer_requests FOR UPDATE
  TO authenticated USING (auth.uid() = buyer_id) WITH CHECK (auth.uid() = buyer_id);

DROP POLICY IF EXISTS "delete_own_request" ON buyer_requests;
CREATE POLICY "delete_own_request" ON buyer_requests FOR DELETE
  TO authenticated USING (auth.uid() = buyer_id);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  message_type text NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'listing', 'offer', 'system')),
  offer_price numeric,
  offer_status text CHECK (offer_status IN ('pending', 'accepted', 'rejected', 'countered')),
  listing_ref uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_messages" ON messages;
CREATE POLICY "select_own_messages" ON messages FOR SELECT
  TO authenticated USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "insert_own_messages" ON messages;
CREATE POLICY "insert_own_messages" ON messages FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "delete_own_messages" ON messages;
CREATE POLICY "delete_own_messages" ON messages FOR DELETE
  TO authenticated USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info' CHECK (type IN ('price', 'buyer', 'demand', 'weather', 'listing', 'info')),
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_notifications" ON notifications;
CREATE POLICY "select_own_notifications" ON notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_notifications" ON notifications;
CREATE POLICY "insert_own_notifications" ON notifications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_notifications" ON notifications;
CREATE POLICY "update_own_notifications" ON notifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_notifications" ON notifications;
CREATE POLICY "delete_own_notifications" ON notifications FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Market prices (demo data table)
CREATE TABLE IF NOT EXISTS market_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_name text NOT NULL,
  market_name text NOT NULL,
  location text NOT NULL,
  price numeric NOT NULL,
  price_yesterday numeric,
  price_high numeric,
  price_low numeric,
  distance_km numeric,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE market_prices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_market_prices" ON market_prices;
CREATE POLICY "read_market_prices" ON market_prices FOR SELECT
  TO authenticated USING (true);

-- Weather alerts (demo data table)
CREATE TABLE IF NOT EXISTS weather_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location text NOT NULL,
  alert_type text NOT NULL,
  message text NOT NULL,
  severity text NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  temperature numeric,
  rain_probability numeric,
  humidity numeric,
  wind_speed numeric,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE weather_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_weather_alerts" ON weather_alerts;
CREATE POLICY "read_weather_alerts" ON weather_alerts FOR SELECT
  TO authenticated USING (true);

-- Price predictions (demo data table)
CREATE TABLE IF NOT EXISTS price_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_name text NOT NULL,
  market_name text,
  current_price numeric NOT NULL,
  predicted_price numeric NOT NULL,
  prediction_date date NOT NULL DEFAULT CURRENT_DATE + INTERVAL '3 days',
  trend text NOT NULL DEFAULT 'up' CHECK (trend IN ('up', 'down', 'stable')),
  confidence numeric DEFAULT 0.75,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE price_predictions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_price_predictions" ON price_predictions;
CREATE POLICY "read_price_predictions" ON price_predictions FOR SELECT
  TO authenticated USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_crop_listings_farmer ON crop_listings(farmer_id);
CREATE INDEX IF NOT EXISTS idx_crop_listings_status ON crop_listings(status);
CREATE INDEX IF NOT EXISTS idx_buyer_requests_buyer ON buyer_requests(buyer_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_market_prices_crop ON market_prices(crop_name);
CREATE INDEX IF NOT EXISTS idx_market_prices_date ON market_prices(date);
