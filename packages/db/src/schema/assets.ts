import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { assetTypes } from "./asset-types";
import { assetLifecycleEnum, assetStatusEnum } from "./enums";

export const assets = pgTable(
  "assets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    uniqueId: text("unique_id").notNull(),
    displayName: text("display_name").notNull().default(""),
    typeId: uuid("type_id")
      .notNull()
      .references(() => assetTypes.id),
    status: assetStatusEnum("status").notNull().default("active"),
    site: text("site").notNull().default(""),
    lifecycle: assetLifecycleEnum("lifecycle").notNull().default("active"),
    archivedAt: timestamp("archived_at", {
      withTimezone: true,
      mode: "string",
    }),
    lastInspectionAt: timestamp("last_inspection_at", {
      withTimezone: true,
      mode: "string",
    }),
    openActionsCount: integer("open_actions_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    // Runtime-only via Drizzle updates; DB default covers inserts.
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date().toISOString()),
  },
  (table) => [
    // Matches Phase 1: unique among active assets, case-insensitive.
    uniqueIndex("assets_unique_id_active_idx")
      .using("btree", sql`lower(${table.uniqueId})`)
      .where(sql`${table.lifecycle} = 'active'`),
    index("assets_lifecycle_idx").on(table.lifecycle),
    index("assets_type_id_idx").on(table.typeId),
  ],
);

export type AssetRow = typeof assets.$inferSelect;
export type NewAssetRow = typeof assets.$inferInsert;
