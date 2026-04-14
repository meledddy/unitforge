ALTER TABLE "auth_sessions" ADD COLUMN "workspace_id" uuid;--> statement-breakpoint
UPDATE "auth_sessions"
SET "workspace_id" = "default_membership"."workspace_id"
FROM (
  SELECT DISTINCT ON ("memberships"."user_id")
    "memberships"."user_id",
    "memberships"."workspace_id"
  FROM "memberships"
  ORDER BY "memberships"."user_id", "memberships"."joined_at" ASC
) AS "default_membership"
WHERE "auth_sessions"."user_id" = "default_membership"."user_id"
  AND "auth_sessions"."workspace_id" IS NULL;--> statement-breakpoint
DELETE FROM "auth_sessions" WHERE "workspace_id" IS NULL;--> statement-breakpoint
ALTER TABLE "auth_sessions" ALTER COLUMN "workspace_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "auth_sessions_workspace_idx" ON "auth_sessions" USING btree ("workspace_id");
