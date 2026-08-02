CREATE TYPE "public"."asset_lifecycle" AS ENUM('active', 'archived');--> statement-breakpoint
CREATE TYPE "public"."asset_status" AS ENUM('active', 'assigned', 'maintenance', 'retired', 'error');--> statement-breakpoint
CREATE TABLE "asset_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"status_group" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"unique_id" text NOT NULL,
	"display_name" text DEFAULT '' NOT NULL,
	"type_id" uuid NOT NULL,
	"status" "asset_status" DEFAULT 'active' NOT NULL,
	"site" text DEFAULT '' NOT NULL,
	"lifecycle" "asset_lifecycle" DEFAULT 'active' NOT NULL,
	"archived_at" timestamp with time zone,
	"last_inspection_at" timestamp with time zone,
	"open_actions_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_type_id_asset_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."asset_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "assets_unique_id_active_idx" ON "assets" USING btree (lower("unique_id")) WHERE "assets"."lifecycle" = 'active';--> statement-breakpoint
CREATE INDEX "assets_lifecycle_idx" ON "assets" USING btree ("lifecycle");--> statement-breakpoint
CREATE INDEX "assets_type_id_idx" ON "assets" USING btree ("type_id");