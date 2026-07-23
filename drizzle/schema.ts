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
  verificationStatus: text("verification_status").default("pending"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const bookings = pgTable("bookings", {
  // existing fields...
  id: serial("id").primaryKey(),
  bookingId: text("booking_id").unique().notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  driverId: integer("driver_id").references(() => drivers.id),
  pickupLocation: text("pickup_location"),
  dropLocation: text("drop_location"),
  vehicleType: text("vehicle_type"),
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
  bookingType: text("booking_type").default("ride").notNull(),
  pickup: text("pickup"),
  drop: text("drop"),
  hotelName: text("hotel_name"),
  roomType: text("room_type"),
  fare: text("fare"),
  currency: text("currency").default("CAD"),
  paymentStatus: text("payment_status").default("pending"),
  checkIn: text("check_in"),
  checkOut: text("check_out"),
  guestsCount: integer("guests_count"),
  guestName: text("guest_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});


export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  province: text("province"),
  country: text("country").default("Canada"),
});

export const hotels = pgTable("hotels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  cityId: integer("city_id").references(() => cities.id).notNull(),
  address: text("address"),
});

export const hotelBookings = pgTable("hotel_bookings", {
  id: serial("id").primaryKey(),
  bookingId: text("booking_id").unique().notNull(),
  hotelName: text("hotel_name").notNull(),
  city: text("city").notNull(),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  roomType: text("room_type").notNull(),
  guests: integer("guests").notNull(),
  checkIn: text("check_in").notNull(),
  checkOut: text("check_out").notNull(),
  specialRequest: text("special_request"),
  bookingStatus: text("booking_status").default("Confirmed"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const parcelBookings = pgTable("parcel_bookings", {
  id: serial("id").primaryKey(),
  trackingId: text("tracking_id").unique().notNull(),
  senderName: text("sender_name").notNull(),
  senderPhone: text("sender_phone").notNull(),
  receiverName: text("receiver_name").notNull(),
  receiverPhone: text("receiver_phone").notNull(),
  pickupAddress: text("pickup_address").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  parcelWeight: text("parcel_weight").notNull(),
  parcelType: text("parcel_type").notNull(),
  urgentDelivery: boolean("urgent_delivery").default(false),
  instructions: text("instructions"),
  price: text("price").notNull(),
  status: text("status").default("Pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
