import { pgTable, serial, text, timestamp, integer, boolean, decimal } from "drizzle-orm/pg-core";

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").unique().notNull(),
  phone: text("phone").notNull(),
  password: text("password").notNull(),
  apiToken: text("api_token").unique(),
  profilePhoto: text("profile_photo"),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("4.5"),
  totalRides: integer("total_rides").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const drivers = pgTable("drivers", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").unique().notNull(),
  phone: text("phone").notNull(),
  password: text("password").notNull(),
  vehicleType: text("vehicle_type").notNull(),
  vehicleNumber: text("vehicle_number").unique().notNull(),
  licenseNumber: text("license_number").unique().notNull(),
  profilePhoto: text("profile_photo"),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("4.5"),
  totalRides: integer("total_rides").default(0),
  status: text("status").default("offline"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  bookingId: text("booking_id").unique().notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  driverId: integer("driver_id").references(() => drivers.id),
  pickupLocation: text("pickup_location").notNull(),
  dropLocation: text("drop_location").notNull(),
  vehicleType: text("vehicle_type").notNull(),
  estimatedFare: text("estimated_fare"),
  actualFare: text("actual_fare"),
  status: text("status").default("pending"),
  pickupLat: decimal("pickup_lat", { precision: 10, scale: 8 }),
  pickupLng: decimal("pickup_lng", { precision: 11, scale: 8 }),
  dropLat: decimal("drop_lat", { precision: 10, scale: 8 }),
  dropLng: decimal("drop_lng", { precision: 11, scale: 8 }),
  scheduledTime: timestamp("scheduled_time", { withTimezone: true }),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

