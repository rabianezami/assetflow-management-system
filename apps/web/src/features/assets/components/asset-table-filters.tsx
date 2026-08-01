"use client";

import { X } from "lucide-react";

import { Select } from "@/components/ui/input";
import type { AssetStatus, AssetType } from "@/features/assets/types/asset.types";
import { cn } from "@/lib/utils";

export type AssetTableFiltersState = {
  search: string;
  typeId: string;
  status: AssetStatus | "all";
};

type AssetTableFiltersProps = {
  searchPlaceholder: string;
  addFilterLabel: string;
  filterByTypeLabel: string;
  filterByStatusLabel: string;
  allTypesLabel: string;
  allStatusesLabel: string;
  clearFiltersLabel: string;
  statusLabels: Record<AssetStatus, string>;
  assetTypes: AssetType[];
  filters: AssetTableFiltersState;
  onFiltersChange: (filters: AssetTableFiltersState) => void;
  filtersVisible: boolean;
  onShowFilters: () => void;
  className?: string;
};

const STATUSES: AssetStatus[] = [
  "active",
  "assigned",
  "maintenance",
  "retired",
  "error",
];

export function AssetTableFilters({
  searchPlaceholder,
  addFilterLabel,
  filterByTypeLabel,
  filterByStatusLabel,
  allTypesLabel,
  allStatusesLabel,
  clearFiltersLabel,
  statusLabels,
  assetTypes,
  filters,
  onFiltersChange,
  filtersVisible,
  onShowFilters,
  className,
}: AssetTableFiltersProps) {
  const hasActiveFilters =
    filters.typeId !== "all" || filters.status !== "all";

  function update(patch: Partial<AssetTableFiltersState>) {
    onFiltersChange({ ...filters, ...patch });
  }

  function clearFilters() {
    onFiltersChange({ ...filters, typeId: "all", status: "all" });
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3">
        <div className="relative min-w-[12rem] flex-1 max-w-sm">
          <input
            type="search"
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            placeholder={searchPlaceholder}
            className="h-9 w-full rounded-lg border border-input bg-background ps-9 pe-3 text-body-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <svg
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.35-4.35M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>

        {!filtersVisible ? (
          <button
            type="button"
            onClick={onShowFilters}
            className="text-body-sm font-medium text-primary hover:text-primary/80"
          >
            + {addFilterLabel}
          </button>
        ) : null}
      </div>

      {filtersVisible ? (
        <div className="flex flex-wrap items-end gap-3 border-b border-border px-4 py-3">
          <div className="flex min-w-[10rem] flex-col gap-1.5">
            <label htmlFor="filter-type" className="text-caption text-muted-foreground">
              {filterByTypeLabel}
            </label>
            <Select
              id="filter-type"
              value={filters.typeId}
              onChange={(e) => update({ typeId: e.target.value })}
              className="min-w-[10rem]"
            >
              <option value="all">{allTypesLabel}</option>
              {assetTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex min-w-[10rem] flex-col gap-1.5">
            <label htmlFor="filter-status" className="text-caption text-muted-foreground">
              {filterByStatusLabel}
            </label>
            <Select
              id="filter-status"
              value={filters.status}
              onChange={(e) =>
                update({ status: e.target.value as AssetStatus | "all" })
              }
              className="min-w-[10rem]"
            >
              <option value="all">{allStatusesLabel}</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </Select>
          </div>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-9 items-center gap-1 text-body-sm text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" aria-hidden />
              {clearFiltersLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
