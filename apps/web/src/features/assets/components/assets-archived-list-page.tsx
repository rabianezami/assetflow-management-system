"use client";

import { Archive, ArrowLeft } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { DataTableShell } from "@/components/common/data-table-shell";
import { DirectionalIcon } from "@/components/common/directional-icon";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { TableEmptyState } from "@/components/common/table-empty-state";
import { Button } from "@/components/ui/button";
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

export function AssetsArchivedListPage() {
  const locale = useLocale();
  const t = useTranslations("Assets");
  const tArchived = useTranslations("Assets.archived");
  const tStatus = useTranslations("Status");
  const allAssets = useAssetsStore((s) => s.assets);
  const archivedAssets = useMemo(
    () => allAssets.filter((a) => a.lifecycle === "archived"),
    [allAssets],
  );
  const getTypeById = useAssetsStore((s) => s.getTypeById);
  const restoreAsset = useAssetsStore((s) => s.restoreAsset);

  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState<AssetTableFiltersState>({
    search: "",
    typeId: "all",
    status: "all",
  });

  const assetTypes = useAssetsStore((s) => s.assetTypes);

  const statusLabels: Record<AssetStatus, string> = {
    active: tStatus("active"),
    assigned: tStatus("assigned"),
    maintenance: tStatus("maintenance"),
    retired: tStatus("retired"),
    error: tStatus("error"),
  };

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return archivedAssets.filter((asset) => {
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
  }, [archivedAssets, filters, getTypeById]);

  const isEmpty = archivedAssets.length === 0;
  const noFilterResults = !isEmpty && filtered.length === 0;

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
            {isEmpty ? (
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
                      <StatusBadge status={asset.status} label={tStatus(asset.status)} />
                    </td>
                    <td className="px-4 py-2.5 text-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => restoreAsset(asset.id)}
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
