-- Ella Creations Complete Database Schema & Storage Bucket Policies for Supabase (Launch Ready)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  compare_price NUMERIC,
  tax_percent NUMERIC DEFAULT 0,
  rating NUMERIC DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 10,
  sku TEXT UNIQUE NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT true,
  variants JSONB DEFAULT '[]',
  stone_type TEXT DEFAULT 'Cubic Zirconia (CZ)',
  images JSONB NOT NULL,
  videos JSONB DEFAULT '[]',
  description TEXT,
  details JSONB,
  care TEXT,
  weight_grams TEXT,
  dimensions TEXT,
  metal_purity TEXT,
  gemstone_clarity TEXT,
  plating_thickness TEXT,
  occasion_tags JSONB,
  warranty_info TEXT,
  custom_sections JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID,
  author TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  photo TEXT,
  date DATE DEFAULT CURRENT_DATE,
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id UUID,
  customer JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  tax_amount NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  shipping NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'Processing',
  payment_method TEXT NOT NULL,
  payment_id TEXT,
  shipping_pincode TEXT,
  shipping_courier TEXT,
  awb_code TEXT,
  tracking_url TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
  code TEXT PRIMARY KEY,
  discount_percent INTEGER NOT NULL,
  min_spend NUMERIC DEFAULT 0,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- DATABASE ROW LEVEL SECURITY POLICIES
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- DROP EXISTING POLICIES IF RE-RUNNING
DROP POLICY IF EXISTS "Allow public read products" ON public.products;
DROP POLICY IF EXISTS "Allow admin all products" ON public.products;
DROP POLICY IF EXISTS "Allow public insert products" ON public.products;

CREATE POLICY "Allow public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow admin all products" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow public insert products" ON public.products FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow public insert reviews" ON public.reviews;

CREATE POLICY "Allow public read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Allow public insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public read orders" ON public.orders;
DROP POLICY IF EXISTS "Allow admin update orders" ON public.orders;
DROP POLICY IF EXISTS "Allow admin delete orders" ON public.orders;

CREATE POLICY "Allow public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow admin update orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Allow admin delete orders" ON public.orders FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow public read coupons" ON public.coupons;
DROP POLICY IF EXISTS "Allow admin manage coupons" ON public.coupons;

CREATE POLICY "Allow public read coupons" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Allow admin manage coupons" ON public.coupons FOR ALL USING (true);

-- 5. STORAGE BUCKET RLS POLICIES FOR 'products' BUCKET
-- This enables public read & insert/upload permissions for images & videos in the 'products' bucket

INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Allow public select products storage" ON storage.objects;
DROP POLICY IF EXISTS "Allow public insert products storage" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update products storage" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete products storage" ON storage.objects;

CREATE POLICY "Allow public select products storage"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

CREATE POLICY "Allow public insert products storage"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'products');

CREATE POLICY "Allow public update products storage"
ON storage.objects FOR UPDATE
USING (bucket_id = 'products');

CREATE POLICY "Allow public delete products storage"
ON storage.objects FOR DELETE
USING (bucket_id = 'products');

-- 6. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'VIP Sparkle Club Footer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Allow public read newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Allow admin manage newsletter" ON public.newsletter_subscribers;

CREATE POLICY "Allow public insert newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read newsletter" ON public.newsletter_subscribers FOR SELECT USING (true);
CREATE POLICY "Allow admin manage newsletter" ON public.newsletter_subscribers FOR ALL USING (true);

