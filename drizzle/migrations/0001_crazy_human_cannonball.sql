CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"booking_id" text NOT NULL,
	"user_id" integer NOT NULL,
	"driver_id" integer,
	"pickup_location" text NOT NULL,
	"drop_location" text NOT NULL,
	"vehicle_type" text NOT NULL,
	"estimated_fare" text,
	"actual_fare" text,
	"status" text DEFAULT 'pending',
	"pickup_lat" numeric(10, 8),
	"pickup_lng" numeric(11, 8),
	"drop_lat" numeric(10, 8),
	"drop_lng" numeric(11, 8),
	"scheduled_time" timestamp with time zone,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bookings_booking_id_unique" UNIQUE("booking_id")
);
--> statement-breakpoint
CREATE TABLE "drivers" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"password" text NOT NULL,
	"vehicle_type" text NOT NULL,
	"vehicle_number" text NOT NULL,
	"license_number" text NOT NULL,
	"profile_photo" text,
	"rating" numeric(2, 1) DEFAULT '4.5',
	"total_rides" integer DEFAULT 0,
	"status" text DEFAULT 'offline',
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "drivers_email_unique" UNIQUE("email"),
	CONSTRAINT "drivers_vehicle_number_unique" UNIQUE("vehicle_number"),
	CONSTRAINT "drivers_license_number_unique" UNIQUE("license_number")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"password" text NOT NULL,
	"api_token" text,
	"profile_photo" text,
	"rating" numeric(2, 1) DEFAULT '4.5',
	"total_rides" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_api_token_unique" UNIQUE("api_token")
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE no action ON UPDATE no action;