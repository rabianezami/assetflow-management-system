import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type TableToolbarProps = {
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  addFilterLabel?: string;
  className?: string;
};

export function TableToolbar({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  addFilterLabel,
  className,
}: TableToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 border-b border-border px-4 py-3",
        className,
      )}
    >
      <div className="relative min-w-[12rem] flex-1 max-w-sm">
        <input
          type="search"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
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
      {addFilterLabel ? (
        <button
          type="button"
          className="text-body-sm font-medium text-primary hover:text-primary/80"
        >
          + {addFilterLabel}
        </button>
      ) : null}
    </div>
  );
}
