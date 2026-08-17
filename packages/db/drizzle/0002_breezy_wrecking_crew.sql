ALTER TABLE "assets" ADD COLUMN "site_id" uuid;--> statement-breakpoint
CREATE UNIQUE INDEX "sites_org_name_lower_uidx" ON "sites" USING btree ("organization_id",lower("name"));--> statement-breakpoint
INSERT INTO "sites" ("organization_id", "name")
SELECT DISTINCT ON ("organization_id", lower(trim("site")))
  "organization_id",
  trim("site")
FROM "assets"
WHERE trim("site") <> ''
ORDER BY "organization_id", lower(trim("site")), trim("site");--> statement-breakpoint
UPDATE "assets" AS a
SET "site_id" = s."id"
FROM "sites" AS s
WHERE a."organization_id" = s."organization_id"
  AND lower(trim(a."site")) = lower(s."name")
  AND trim(a."site") <> '';--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "assets_site_id_idx" ON "assets" USING btree ("site_id");
