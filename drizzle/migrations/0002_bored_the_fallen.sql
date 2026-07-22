ALTER TABLE "bookings" ALTER COLUMN "pickup_location" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "drop_location" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "vehicle_type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "booking_type" text DEFAULT 'ride' NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "pickup" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "drop" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "hotel_name" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "room_type" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "fare" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "currency" text DEFAULT 'CAD';--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "payment_status" text DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "check_in" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "check_out" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "guests_count" integer;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "guest_name" text;--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "verification_status" text DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "rejection_reason" text;