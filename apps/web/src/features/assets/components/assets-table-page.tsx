"use client";

import { Archive, ArrowLeft, Package, Plus, Settings } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import { DataTableShell } from "@/components/common/data-table-shell";
import { DirectionalIcon } from "@/components/common/directional-icon";
import { KpiStatCard } from "@/components/common/kpi-stat-card";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { TableEmptyState } from "@/components/common/table-empty-state";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  filtersToListQuery,
  useAssetMutations,
  useAssets,
  useAssetTypes,
} from "@/features/assets/api";
import { AssetOnboardingBanner } from "@/features/assets/components/asset-onboarding-banner";
import {
  AssetTableFilters,
  type AssetTableFiltersState,
} from "@/features/assets/components/asset-table-filters";
import { isConflictError } from "@/lib/api/client";
import {
  countRecentInspections,
  formatLastInspection,
  getTypeName,
} from "@/features/assets/lib/asset-helpers";
import type { AssetStatus } from "@/features/assets/types/asset.types";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type AssetsTablePageProps = {
  mode: "active" | "archived";
};

export function AssetsTablePage({ mode }: AssetsTablePageProps) {
  const locale = useLocale();
  const t = useTranslations("Assets");
  const tArchived = useTranslations("Assets.archived");
  const tStatus = useTranslations("Status");

  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState<AssetTableFiltersState>({
    search: "",
    typeId: "all",
    status: "all",
  });
  const [actionError, setActionError] = useState<string | null>(null);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const lifecycle = mode === "active" ? "active" : "archived";
  const assetsQuery = useAssets(filtersToListQuery(filters, { lifecycle }));
  const typesQuery = useAssetTypes({ limit: 100 });
  const { restoreAsset } = useAssetMutations();

  const assets = assetsQuery.data?.items ?? [];
  const assetTypes = typesQuery.data?.items ?? [];
  const totalAssets = assetsQuery.data?.meta.total;

  const statusLabels: Record<AssetStatus, string> = {
    active: tStatus("active"),
    assigned: tStatus("assigned"),
    maintenance: tStatus("maintenance"),
    retired: tStatus("retired"),
    error: tStatus("error"),
  };

  const openActionsTotal = assets.reduce(
    (sum, asset) => sum + (asset.openActionsCount ?? 0),
    0,
  );
  const inspectionsCount = countRecentInspections(assets);
  const isLoading = assetsQuery.isLoading || typesQuery.isLoading;
  const isError = assetsQuery.isError || typesQuery.isError;
  const isEmpty = !isLoading && !isError && assets.length === 0;
  const hasActiveFilters =
    Boolean(filters.search.trim()) ||
    filters.typeId !== "all" ||
    filters.status !== "all";
  const noFilterResults = isEmpty && hasActiveFilters;
  const trulyEmpty = isEmpty && !hasActiveFilters;
  const colSpan = mode === "archived" ? 5 : 6;

  async function handleRestore(assetId: string) {
    setActionError(null);
    setRestoringId(assetId);
    try {
      await restoreAsset.mutateAsync(assetId);
    } catch (error) {
      setActionError(
        isConflictError(error)
          ? tArchived("restoreConflict")
          : t("loadError"),
      );
    } finally {
      setRestoringId(null);
    }
  }

  let emptyState: ReactNode = null;
  if (trulyEmpty && mode === "active") {
    emptyState = (
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
    );
  } else if (trulyEmpty) {
    emptyState = (
      <TableEmptyState
        icon={<Archive className="size-5" />}
        title={tArchived("emptyTitle")}
        description={tArchived("emptyDescription")}
      />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[var(--content-max-width)] flex-col gap-6">
      {mode === "archived" ? (
        <Link
          href="/assets"
          className="inline-flex w-fit items-center gap-2 text-body-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <DirectionalIcon icon={ArrowLeft} className="size-4" />
          {tArchived("backToAssets")}
        </Link>
      ) : null}

      {mode === "active" ? (
        <PageHeader
          title={t("title")}
          actions={
            <>
              <Link
                href="/assets/settings/types"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "gap-2",
                )}
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
      ) : (
        <PageHeader
          title={tArchived("title")}
          description={tArchived("description")}
        />
      )}

      {mode === "active" ? <AssetOnboardingBanner /> : null}

      {mode === "active" ? (
        <div className="flex justify-end">
          <Link
            href="/assets/archived"
            className="text-body-sm font-medium text-muted-foreground hover:text-foreground"
          >
            {t("viewArchived")}
          </Link>
        </div>
      ) : null}

      {mode === "active" ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <KpiStatCard
            compact
            label={t("kpi.totalAssets")}
            value={isLoading || totalAssets === undefined ? "—" : totalAssets}
          />
          <KpiStatCard
            compact
            label={t("kpi.openActions")}
            value={isLoading ? "—" : openActionsTotal}
          />
          <KpiStatCard
            compact
            label={t("kpi.inspectionsLast30Days")}
            value={isLoading ? "—" : inspectionsCount}
          />
        </div>
      ) : null}

      {actionError ? (
        <p className="text-body-sm text-destructive" role="alert">
          {actionError}
        </p>
      ) : null}

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
              {mode === "active" ? (
                <>
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
                </>
              ) : (
                <th
                  scope="col"
                  className="px-4 py-2.5 text-end font-medium text-muted-foreground"
                >
                  {t("columns.actions")}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={colSpan}
                  className="px-4 py-10 text-center text-body-sm text-muted-foreground"
                >
                  {t("loading")}
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={colSpan} className="p-0">
                  <TableEmptyState title={t("loadError")} />
                </td>
              </tr>
            ) : emptyState ? (
              <tr>
                <td colSpan={colSpan} className="p-0">
                  {emptyState}
                </td>
              </tr>
            ) : noFilterResults ? (
              <tr>
                <td colSpan={colSpan} className="p-0">
                  <TableEmptyState title={t("noFilterResults")} />
                </td>
              </tr>
            ) : (
              assets.map((asset) => {
                const typeName = getTypeName(assetTypes, asset.typeId);
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
                    {mode === "active" ? (
                      <>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {formatLastInspection(asset.lastInspectionAt, locale)}
                        </td>
                        <td className="px-4 py-2.5 tabular-nums">
                          {asset.openActionsCount ?? 0}
                        </td>
                      </>
                    ) : (
                      <td className="px-4 py-2.5 text-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={restoringId === asset.id}
                          onClick={() => void handleRestore(asset.id)}
                        >
                          {tArchived("restore")}
                        </Button>
                      </td>
                    )}
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
