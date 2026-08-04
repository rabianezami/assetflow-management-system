"use client";

import { Archive, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { DataTableShell } from "@/components/common/data-table-shell";
import { DirectionalIcon } from "@/components/common/directional-icon";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { TableEmptyState } from "@/components/common/table-empty-state";
import { Button } from "@/components/ui/button";
import { useAssetMutations, useAssets, useAssetTypes } from "@/features/assets/api";
import {
  AssetTableFilters,
  type AssetTableFiltersState,
} from "@/features/assets/components/asset-table-filters";
import { isConflictError } from "@/features/assets/lib/api-error";
import { getTypeName } from "@/features/assets/lib/asset-helpers";
import type { AssetStatus } from "@/features/assets/types/asset.types";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function AssetsArchivedListPage() {
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

  const assetsQuery = useAssets({
    lifecycle: "archived",
    limit: 100,
    typeId: filters.typeId === "all" ? undefined : filters.typeId,
    status: filters.status === "all" ? undefined : filters.status,
    search: filters.search.trim() || undefined,
  });
  const typesQuery = useAssetTypes({ limit: 100 });
  const { restoreAsset } = useAssetMutations();

  const archivedAssets = assetsQuery.data?.items ?? [];
  const assetTypes = typesQuery.data?.items ?? [];

  const statusLabels: Record<AssetStatus, string> = {
    active: tStatus("active"),
    assigned: tStatus("assigned"),
    maintenance: tStatus("maintenance"),
    retired: tStatus("retired"),
    error: tStatus("error"),
  };

  const isLoading = assetsQuery.isLoading || typesQuery.isLoading;
  const isError = assetsQuery.isError || typesQuery.isError;
  const isEmpty = !isLoading && !isError && archivedAssets.length === 0;
  const hasActiveFilters =
    Boolean(filters.search.trim()) ||
    filters.typeId !== "all" ||
    filters.status !== "all";
  const noFilterResults = isEmpty && hasActiveFilters;
  const trulyEmpty = isEmpty && !hasActiveFilters;

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

  return (
    <div className="mx-auto flex w-full max-w-[var(--content-max-width)] flex-col gap-6">
      <Link
        href="/assets"
        className="inline-flex w-fit items-center gap-2 text-body-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <DirectionalIcon icon={ArrowLeft} className="size-4" />
        {tArchived("backToAssets")}
      </Link>

      <PageHeader title={tArchived("title")} description={tArchived("description")} />

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
              <th scope="col" className="px-4 py-2.5 text-start font-medium text-muted-foreground">
                {t("columns.uniqueId")}
              </th>
              <th scope="col" className="px-4 py-2.5 text-start font-medium text-muted-foreground">
                {t("columns.displayName")}
              </th>
              <th scope="col" className="px-4 py-2.5 text-start font-medium text-muted-foreground">
                {t("columns.type")}
              </th>
              <th scope="col" className="px-4 py-2.5 text-start font-medium text-muted-foreground">
                {t("columns.status")}
              </th>
              <th scope="col" className="px-4 py-2.5 text-end font-medium text-muted-foreground">
                {t("columns.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-body-sm text-muted-foreground"
                >
                  {t("loading")}
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={5} className="p-0">
                  <TableEmptyState title={t("loadError")} />
                </td>
              </tr>
            ) : trulyEmpty ? (
              <tr>
                <td colSpan={5} className="p-0">
                  <TableEmptyState
                    icon={<Archive className="size-5" />}
                    title={tArchived("emptyTitle")}
                    description={tArchived("emptyDescription")}
                  />
                </td>
              </tr>
            ) : noFilterResults ? (
              <tr>
                <td colSpan={5} className="p-0">
                  <TableEmptyState title={t("noFilterResults")} />
                </td>
              </tr>
            ) : (
              archivedAssets.map((asset) => {
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
                      <StatusBadge status={asset.status} label={tStatus(asset.status)} />
                    </td>
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
