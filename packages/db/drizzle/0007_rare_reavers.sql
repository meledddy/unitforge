CREATE TYPE "public"."access_request_status" AS ENUM('new', 'contacted', 'qualified', 'closed');--> statement-breakpoint
CREATE TABLE "access_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_name" text NOT NULL,
	"contact_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"note" text,
	"locale" varchar(8) DEFAULT 'en' NOT NULL,
	"status" "access_request_status" DEFAULT 'new' NOT NULL,
	"source" varchar(64) DEFAULT 'request-access' NOT NULL,
	"status_updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "access_requests_locale_check" CHECK ("access_requests"."locale" in ('en', 'ru'))
);
--> statement-breakpoint
CREATE INDEX "access_requests_email_created_at_idx" ON "access_requests" USING btree ("email","created_at");--> statement-breakpoint
CREATE INDEX "access_requests_status_created_at_idx" ON "access_requests" USING btree ("status","created_at");