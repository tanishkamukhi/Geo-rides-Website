import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../drizzle/schema';

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL || '';

export const pool = new Pool({
  connectionString,
});

export const db = drizzle(pool, { schema });
export { schema };
export const useRealDB = !!connectionString;

// Simple migration to ensure tables exist (run on server start)
export async function runMigrations() {
  if (!useRealDB) return;
  // Users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      password TEXT NOT NULL,
      api_token TEXT UNIQUE,
      profile_photo TEXT,
      rating NUMERIC(2,1) DEFAULT 4.5,
      total_rides INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
  `);
  // Drivers table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS drivers (
      id SERIAL PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      password TEXT NOT NULL,
      vehicle_type TEXT NOT NULL,
      vehicle_number TEXT UNIQUE NOT NULL,
      license_number TEXT UNIQUE NOT NULL,
      profile_photo TEXT,
      rating NUMERIC(2,1) DEFAULT 4.5,
      total_rides INTEGER DEFAULT 0,
      status TEXT DEFAULT 'offline',
      latitude NUMERIC(10,8),
      longitude NUMERIC(11,8),
      is_verified BOOLEAN DEFAULT false,
      verification_status TEXT DEFAULT 'pending',
      rejection_reason TEXT,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
    ALTER TABLE drivers ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
    ALTER TABLE drivers ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending';
    ALTER TABLE drivers ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
  `);
  // Bookings table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      booking_id TEXT UNIQUE NOT NULL,
      user_id INTEGER REFERENCES users(id) NOT NULL,
      driver_id INTEGER REFERENCES drivers(id),
      pickup_location TEXT,
      drop_location TEXT,
      vehicle_type TEXT,
      estimated_fare TEXT,
      actual_fare TEXT,
      status TEXT DEFAULT 'pending',
      pickup_lat NUMERIC(10,8),
      pickup_lng NUMERIC(11,8),
      drop_lat NUMERIC(10,8),
      drop_lng NUMERIC(11,8),
      scheduled_time TIMESTAMPTZ,
      started_at TIMESTAMPTZ,
      completed_at TIMESTAMPTZ,
      booking_type TEXT DEFAULT 'ride' NOT NULL,
      pickup TEXT,
      drop TEXT,
      hotel_name TEXT,
      room_type TEXT,
      fare TEXT,
      currency TEXT DEFAULT 'CAD',
      payment_status TEXT DEFAULT 'pending',
      check_in TEXT,
      check_out TEXT,
      guests_count INTEGER,
      guest_name TEXT,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
  `);
  // Cities table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS cities (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      province TEXT NOT NULL,
      country TEXT DEFAULT 'Canada',
      lat NUMERIC(10,8),
      lng NUMERIC(11,8)
    );
  `);
  // Hotels table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS hotels (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      city_id INTEGER REFERENCES cities(id) NOT NULL,
      address TEXT,
      city TEXT,
      lat NUMERIC(10,8),
      lng NUMERIC(11,8)
    );
    CREATE TABLE IF NOT EXISTS hotel_bookings (
      id SERIAL PRIMARY KEY,
      booking_id TEXT UNIQUE NOT NULL,
      hotel_name TEXT NOT NULL,
      city TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      room_type TEXT NOT NULL,
      guests INTEGER NOT NULL,
      check_in TEXT NOT NULL,
      check_out TEXT NOT NULL,
      special_request TEXT,
      booking_status TEXT DEFAULT 'Confirmed',
      created_at TIMESTAMPTZ DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS parcel_bookings (
      id SERIAL PRIMARY KEY,
      tracking_id TEXT UNIQUE NOT NULL,
      sender_name TEXT NOT NULL,
      sender_phone TEXT NOT NULL,
      receiver_name TEXT NOT NULL,
      receiver_phone TEXT NOT NULL,
      pickup_address TEXT NOT NULL,
      delivery_address TEXT NOT NULL,
      parcel_weight TEXT NOT NULL,
      parcel_type TEXT NOT NULL,
      urgent_delivery BOOLEAN DEFAULT false,
      instructions TEXT,
      price TEXT NOT NULL,
      status TEXT DEFAULT 'Pending',
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `);

  // Migration: ensure city_id exists and populate it from city name
  await pool.query(`

    DO $$

    BEGIN

    IF EXISTS (

    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'hotels'
      AND column_name = 'city'
  ) THEN
    UPDATE hotels h
    SET city_id = c.id
    FROM cities c
    WHERE h.city = c.name;
  END IF;
END $$;
`);
}