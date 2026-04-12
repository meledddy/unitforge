CREATE TABLE "price_sheet_leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"price_sheet_id" uuid NOT NULL,
	"sheet_slug_snapshot" varchar(160) NOT NULL,
	"contact_name" text NOT NULL,
	"company_or_business_name" text,
	"email" text NOT NULL,
	"phone_or_handle" text,
	"message" text NOT NULL,
	"locale" varchar(32) DEFAULT 'en-US' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "price_sheet_leads_locale_check" CHECK ("price_sheet_leads"."locale" in ('en-US', 'ru-RU'))
);
--> statement-breakpoint
ALTER TABLE "price_sheet_leads" ADD CONSTRAINT "price_sheet_leads_price_sheet_id_price_sheets_id_fk" FOREIGN KEY ("price_sheet_id") REFERENCES "public"."price_sheets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "price_sheet_leads_price_sheet_idx" ON "price_sheet_leads" USING btree ("price_sheet_id");