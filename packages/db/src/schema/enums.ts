import { pgEnum } from "drizzle-orm/pg-core";

/** Matches Phase 1 AssetStatus values. */
export const assetStatusEnum = pgEnum("asset_status", [
  "active",
  "assigned",
  "maintenance",
  "retired",
  "error",
]);

/** Matches Phase 1 AssetLifecycle values. */
export const assetLifecycleEnum = pgEnum("asset_lifecycle", [
  "active",
  "archived",
]);
