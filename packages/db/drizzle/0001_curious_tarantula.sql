ALTER TABLE "price_sheets" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "price_sheets" ADD COLUMN "theme" varchar(32) DEFAULT 'amber' NOT NULL;