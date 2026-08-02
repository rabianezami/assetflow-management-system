import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const assetTypes = pgTable("asset_types", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  statusGroup: text("status_group").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export type AssetTypeRow = typeof assetTypes.$inferSelect;
export type NewAssetTypeRow = typeof assetTypes.$inferInsert;
