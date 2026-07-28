"use client";

import { Package, Plus, Settings } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { DataTableShell } from "@/components/common/data-table-shell";
import { KpiStatCard } from "@/components/common/kpi-stat-card";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { TableEmptyState } from "@/components/common/table-empty-state";
import { Button, buttonVariants } from "@/components/ui/button";
import { AssetOnboardingBanner } from "@/features/assets/components/asset-onboarding-banner";
import {
  AssetTableFilters,
  type AssetTableFiltersState,
} from "@/features/assets/components/asset-table-filters";
import { useAssetsStore } from "@/features/assets/stores/use-assets-store";
import type { AssetStatus } from "@/features/assets/types/asset.types";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

function formatLastInspection(iso: string | null | undefined, locale: string) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
    new Date(iso),
  );
}

function countRecentInspections(assets: { lastInspectionAt?: string | null }[]) {
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return assets.filter((asset) => {
    if (!asset.lastInspectionAt) return false;
    return new Date(asset.lastInspectionAt).getTime() >= cutoff;
  }).length;
}

export function AssetsListPage() {
  const locale = useLocale();
  const t = useTranslations("Assets");
  const tStatus = useTranslations("Status");
  const allAssets = useAssetsStore((s) => s.assets);
  const assets = useMemo(
    () => allAssets.filter((a) => (a.lifecycle ?? "active") === "active"),
    [allAssets],
  );
  const assetTypes = useAssetsStore((s) => s.assetTypes);
  const getTypeById = useAssetsStore((s) => s.getTypeById);

  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState<AssetTableFiltersState>({
    search: "",
    typeId: "all",
    status: "all",
  });

  const statusLabels: Record<AssetStatus, string> = {
    active: tStatus("active"),
    assigned: tStatus("assigned"),
    maintenance: tStatus("maintenance"),
    retired: tStatus("retired"),
    error: tStatus("error"),
  };

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return assets.filter((asset) => {
      if (filters.typeId !== "all" && asset.typeId !== filters.typeId) {
        return false;
      }
      if (filters.status !== "all" && asset.status !== filters.status) {
        return false;
      }
      if (!q) return true;
      const typeName = getTypeById(asset.typeId)?.name.toLowerCase() ?? "";
      return (
        asset.uniqueId.toLowerCase().includes(q) ||
        asset.displayName.toLowerCase().includes(q) ||
        typeName.includes(q)
      );
    });
  }, [assets, filters, getTypeById]);

  const openActionsTotal = assets.reduce(
    (sum, asset) => sum + (asset.openActionsCount ?? 0),
    0,
  );
  const inspectionsCount = countRecentInspections(assets);
  const isEmpty = assets.length === 0;
  const noFilterResults = !isEmpty && filtered.length === 0;

  return (
    <div className="mx-auto flex w-full max-w-[var(--content-max-width)] flex-col gap-6">
      <PageHeader
        title={t("title")}
        actions={
          <>
            <Link
              href="/assets/settings/types"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
            >
              <Settings className="size-4" aria-hidden />
              {t("settingsButton")}
            </Link>
            <Button
              nativeButton={false}
              render={<Link href="/assets/new" />}
              size="sm"
              className="gap-2"
            >
              <Plus className="size-4" aria-hidden />
              {t("addAsset")}
            </Button>
          </>
        }
      />

      <AssetOnboardingBanner />

      <div className="flex justify-end">
        <Link
          href="/assets/archived"
          className="text-body-sm font-medium text-muted-foreground hover:text-foreground"
        >
          {t("viewArchived")}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiStatCard
          compact
          label={t("kpi.totalAssets")}
          value={assets.length}
        />
        <KpiStatCard
          compact
          label={t("kpi.openActions")}
          value={openActionsTotal}
        />
        <KpiStatCard
          compact
          label={t("kpi.inspectionsLast30Days")}
          value={inspectionsCount}
        />
      </div>

      <DataTableShell>
        <AssetTableFilters
          searchPlaceholder={t("searchPlaceholder")}
          addFilterLabel={t("addFilter")}
          filterByTypeLabel={t("filters.type")}
          filterByStatusLabel={t("filters.status")}
          allTypesLabel={t("filters.allTypes")}
          allStatusesLabel={t("filters.allStatuses")}
          clearFiltersLabel={t("filters.clear")}
          statusLabels={statusLabels}
          assetTypes={assetTypes}
          filters={filters}
          onFiltersChange={setFilters}
          filtersVisible={filtersVisible}
          onShowFilters={() => setFiltersVisible(true)}
        />

        <table className="w-full text-body-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th
                scope="col"
                className="px-4 py-2.5 text-start font-medium text-muted-foreground"
              >
                {t("columns.uniqueId")}
              </th>
              <th
                scope="col"
                className="px-4 py-2.5 text-start font-medium text-muted-foreground"
              >
                {t("columns.displayName")}
              </th>
              <th
                scope="col"
                className="px-4 py-2.5 text-start font-medium text-muted-foreground"
              >
                {t("columns.type")}
              </th>
              <th
                scope="col"
                className="px-4 py-2.5 text-start font-medium text-muted-foreground"
              >
                {t("columns.status")}
              </th>
              <th
                scope="col"
                className="px-4 py-2.5 text-start font-medium text-muted-foreground"
              >
                {t("columns.lastInspection")}
              </th>
              <th
                scope="col"
                className="px-4 py-2.5 text-start font-medium text-muted-foreground"
              >
                {t("columns.openActions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {isEmpty ? (
              <tr>
                <td colSpan={6} className="p-0">
                  <TableEmptyState
                    icon={<Package className="size-5" />}
                    title={t("emptyTableTitle")}
                    description={t("emptyTableDescription")}
                    action={
                      <Button
                        nativeButton={false}
                        render={<Link href="/assets/new" />}
                        size="sm"
                      >
                        <Plus className="size-4" aria-hidden />
                        {t("addAsset")}
                      </Button>
                    }
                  />
                </td>
              </tr>
            ) : noFilterResults ? (
              <tr>
                <td colSpan={6} className="p-0">
                  <TableEmptyState title={t("noFilterResults")} />
                </td>
              </tr>
            ) : (
              filtered.map((asset) => {
                const typeName = getTypeById(asset.typeId)?.name ?? "—";
                return (
                  <tr
                    key={asset.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-2.5">
                      <Link
                        href={`/assets/${asset.id}`}
                        className="font-medium text-foreground hover:text-primary hover:underline"
                      >
                        {asset.uniqueId}
                      </Link>
                    </td>
                    <td
                      className={cn(
                        "px-4 py-2.5",
                        !asset.displayName && "text-muted-foreground",
                      )}
                    >
                      {asset.displayName || "—"}
                    </td>
                    <td className="px-4 py-2.5">{typeName}</td>
                    <td className="px-4 py-2.5">
                      <StatusBadge
                        status={asset.status}
                        label={tStatus(asset.status)}
                      />
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {formatLastInspection(asset.lastInspectionAt, locale)}
                    </td>
                    <td className="px-4 py-2.5 tabular-nums">
                      {asset.openActionsCount ?? 0}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </DataTableShell>
    </div>
  );
}
