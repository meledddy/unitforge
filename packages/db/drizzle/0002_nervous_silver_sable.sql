ALTER TABLE "price_sheet_items" ADD COLUMN "translations" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "price_sheets" ADD COLUMN "translations" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
UPDATE "price_sheets"
SET "locale" = CASE
  WHEN lower(replace("locale", '_', '-')) LIKE 'ru%' THEN 'ru-RU'
  ELSE 'en-US'
END
WHERE "locale" NOT IN ('en-US', 'ru-RU');--> statement-breakpoint
ALTER TABLE "price_sheets" ADD CONSTRAINT "price_sheets_locale_check" CHECK ("price_sheets"."locale" in ('en-US', 'ru-RU'));
