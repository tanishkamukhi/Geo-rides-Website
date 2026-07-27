CREATE TABLE "cities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"province" text,
	"country" text DEFAULT 'Canada'
);
--> statement-breakpoint
CREATE TABLE "hotel_bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"booking_id" text NOT NULL,
	"hotel_name" text NOT NULL,
	"city" text NOT NULL,
	"customer_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"room_type" text NOT NULL,
	"guests" integer NOT NULL,
	"check_in" text NOT NULL,
	"check_out" text NOT NULL,
	"special_request" text,
	"booking_status" text DEFAULT 'Confirmed',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "hotel_bookings_booking_id_unique" UNIQUE("booking_id")
);
--> statement-breakpoint
CREATE TABLE "hotels" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"city_id" integer NOT NULL,
	"address" text
);
--> statement-breakpoint
CREATE TABLE "parcel_bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"tracking_id" text NOT NULL,
	"sender_name" text NOT NULL,
	"sender_phone" text NOT NULL,
	"receiver_name" text NOT NULL,
	"receiver_phone" text NOT NULL,
	"pickup_address" text NOT NULL,
	"delivery_address" text NOT NULL,
	"parcel_weight" text NOT NULL,
	"parcel_type" text NOT NULL,
	"urgent_delivery" boolean DEFAULT false,
	"instructions" text,
	"price" text NOT NULL,
	"status" text DEFAULT 'Pending',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "parcel_bookings_tracking_id_unique" UNIQUE("tracking_id")
);
--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "selfie_photo" text;--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "license_front" text;--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "license_back" text;--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "vehicle_registration" text;--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "insurance_document" text;--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "approved_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "approved_by" integer;--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "verified_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "hotels" ADD CONSTRAINT "hotels_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE no action ON UPDATE no action;