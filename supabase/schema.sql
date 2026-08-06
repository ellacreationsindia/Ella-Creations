-- Ella Creations Database Schema for Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  compare_price NUMERIC,
  rating NUMERIC DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 10,
  sku TEXT UNIQUE NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT true,
  finish_options JSONB DEFAULT '["Rose Gold", "Gold"]',
  stone_type TEXT DEFAULT 'Cubic Zirconia (CZ)',
  images JSONB NOT NULL,
  description TEXT,
  details JSONB,
  care TEXT,
  -- Enhanced Specifications
  weight_grams TEXT,
  dimensions TEXT,
  metal_purity TEXT,
  gemstone_clarity TEXT,
  plating_thickness TEXT,
  occasion_tags JSONB,
  warranty_info TEXT,
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
  discount NUMERIC DEFAULT 0,
  shipping NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'Processing',
  payment_method TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
  code TEXT PRIMARY KEY,
  discount_percent INTEGER NOT NULL,
  min_spend NUMERIC DEFAULT 0,
  description TEXT,
  active BOOLEAN DEFAULT true
);

-- RLS POLICIES (ENABLE PUBLIC READ, ADMIN ALL)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow admin all products" ON public.products FOR ALL USING (true);

CREATE POLICY "Allow public read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Allow public insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow admin update orders" ON public.orders FOR UPDATE USING (true);

-- STORAGE BUCKET CONFIGURATION FOR ADMIN PHOTO UPLOADS
-- Note: Create a public bucket named 'product-images' in Supabase Dashboard -> Storage
