"use client";

import { Archive, ArrowLeft, MapPin, Package, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { DetailTabNav, type DetailTab } from "@/components/common/detail-tab-nav";
import { DirectionalIcon } from "@/components/common/directional-icon";
import { EmptyState } from "@/components/common/empty-state";
import { KeyValueCard } from "@/components/common/key-value-card";
import { SummaryCard } from "@/components/common/summary-card";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  useAsset,
  useAssetMutations,
  useAssetTypes,
} from "@/features/assets/api";
import { AssetIdentityHeader } from "@/features/assets/components/asset-identity-header";
import { isConflictError } from "@/lib/api/client";
import { getTypeName, isArchivedLifecycle } from "@/features/assets/lib/asset-helpers";
import type { AssetStatus } from "@/features/assets/types/asset.types";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type AssetDetailPageProps = {
  assetId: string;
};

export function AssetDetailPageClient({ assetId }: AssetDetailPageProps) {
  const t = useTranslations("Assets.detail");
  const tAssets = useTranslations("Assets");
  const tStatus = useTranslations("Status");
  const router = useRouter();
  const [tab, setTab] = useState<DetailTab>("overview");
  const [actionError, setActionError] = useState<string | null>(null);

  const assetQuery = useAsset(assetId);
  const typesQuery = useAssetTypes({ limit: 100 });
  const { updateAsset, archiveAsset, restoreAsset } = useAssetMutations();

  const asset = assetQuery.data;
  const assetTypes = typesQuery.data?.items ?? [];
  const isLoading = assetQuery.isLoading || typesQuery.isLoading;

  if (isLoading) {
    return (
      <p className="px-4 py-16 text-center text-body-sm text-muted-foreground">
        {tAssets("loading")}
      </p>
    );
  }

  if (assetQuery.isError || !asset) {
    return (
      <EmptyState
        title={t("notFoundTitle")}
        description={t("notFoundDescription")}
        action={
          <Link href="/assets" className="text-primary hover:underline">
            {t("backToList")}
          </Link>
        }
      />
    );
  }

  const typeName = getTypeName(assetTypes, asset.typeId);
  const isArchived = isArchivedLifecycle(asset);
  const actionPending =
    updateAsset.isPending || archiveAsset.isPending || restoreAsset.isPending;

  const tabs: { id: DetailTab; label: string }[] = [
    { id: "overview", label: t("tabs.overview") },
    { id: "details", label: t("tabs.details") },
  ];

  async function handleStatusChange(status: AssetStatus) {
    if (!asset) return;
    setActionError(null);
    try {
      await updateAsset.mutateAsync({
        id: asset.id,
        body: {
          uniqueId: asset.uniqueId,
          displayName: asset.displayName,
          typeId: asset.typeId,
          status,
          siteId: asset.siteId,
        },
      });
    } catch {
      setActionError(t("actionError"));
    }
  }

  async function handleArchive() {
    setActionError(null);
    try {
      await archiveAsset.mutateAsync(assetId);
      router.push("/assets");
    } catch {
      setActionError(t("actionError"));
    }
  }

  async function handleRestore() {
    setActionError(null);
    try {
      await restoreAsset.mutateAsync(assetId);
    } catch (error) {
      setActionError(
        isConflictError(error)
          ? tAssets("archived.restoreConflict")
          : t("actionError"),
      );
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[var(--content-max-width)] flex-col gap-6">
      <Link
        href={isArchived ? "/assets/archived" : "/assets"}
        className="inline-flex w-fit items-center gap-2 text-body-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <DirectionalIcon icon={ArrowLeft} className="size-4" />
        {isArchived ? t("backToList") : t("breadcrumb")}
      </Link>

      {isArchived ? (
        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-body-sm text-muted-foreground">
          {t("archivedNotice")}
        </div>
      ) : null}

      {actionError ? (
        <p className="text-body-sm text-destructive" role="alert">
          {actionError}
        </p>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AssetIdentityHeader
          asset={asset}
          typeName={typeName}
          onStatusChange={(status) => void handleStatusChange(status)}
          statusDisabled={isArchived || actionPending}
        />
        <div className="flex shrink-0 flex-wrap gap-2">
          {!isArchived ? (
            <>
              <Link
                href={`/assets/${asset.id}/edit`}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
              >
                <Pencil className="size-4" aria-hidden />
                {t("edit")}
              </Link>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={actionPending}
                onClick={() => void handleArchive()}
              >
                <Archive className="size-4" aria-hidden />
                {t("archive")}
              </Button>
            </>
          ) : (
            <Button
              type="button"
              size="sm"
              disabled={actionPending}
              onClick={() => void handleRestore()}
            >
              {t("restore")}
            </Button>
          )}
        </div>
      </div>

      <DetailTabNav tabs={tabs} active={tab} onChange={setTab} />

      {tab === "overview" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <SummaryCard title={t("overview.location")}>
            <EmptyState
              className="py-8"
              icon={<MapPin className="size-6" />}
              title={t("overview.locationEmptyTitle")}
              description={t("overview.locationEmptyDescription")}
            />
          </SummaryCard>
          <SummaryCard title={t("overview.summary")}>
            <EmptyState
              className="py-8"
              icon={<Package className="size-6" />}
              title={t("overview.activityEmptyTitle")}
              description={t("overview.activityEmptyDescription")}
            />
          </SummaryCard>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <KeyValueCard
            title={t("details.summary")}
            rows={[
              { label: t("fields.uniqueId"), value: asset.uniqueId },
              {
                label: t("fields.displayName"),
                value: asset.displayName || "—",
              },
              { label: t("fields.type"), value: typeName },
              { label: t("fields.site"), value: asset.site || "—" },
            ]}
          />
          <KeyValueCard
            title={t("details.status")}
            rows={[
              {
                label: t("fields.status"),
                value: tStatus(asset.status),
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}
