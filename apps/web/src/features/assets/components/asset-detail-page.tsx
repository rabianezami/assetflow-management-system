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
import { AssetIdentityHeader } from "@/features/assets/components/asset-identity-header";
import { useAssetsStore } from "@/features/assets/stores/use-assets-store";
import type { AssetStatus } from "@/features/assets/types/asset.types";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type AssetDetailPageProps = {
  assetId: string;
};

export function AssetDetailPageClient({ assetId }: AssetDetailPageProps) {
  const t = useTranslations("Assets.detail");
  const tStatus = useTranslations("Status");
  const router = useRouter();
  const asset = useAssetsStore((s) => s.assets.find((a) => a.id === assetId));
  const getTypeById = useAssetsStore((s) => s.getTypeById);
  const updateAssetStatus = useAssetsStore((s) => s.updateAssetStatus);
  const archiveAsset = useAssetsStore((s) => s.archiveAsset);
  const restoreAsset = useAssetsStore((s) => s.restoreAsset);
  const [tab, setTab] = useState<DetailTab>("overview");

  if (!asset) {
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

  const typeName = getTypeById(asset.typeId)?.name ?? "—";
  const isArchived = (asset.lifecycle ?? "active") === "archived";

  const tabs: { id: DetailTab; label: string }[] = [
    { id: "overview", label: t("tabs.overview") },
    { id: "details", label: t("tabs.details") },
  ];

  function handleArchive() {
    if (archiveAsset(assetId)) {
      router.push("/assets");
    }
  }

  function handleRestore() {
    restoreAsset(assetId);
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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AssetIdentityHeader
          asset={asset}
          typeName={typeName}
          onStatusChange={(status: AssetStatus) =>
            updateAssetStatus(asset.id, status)
          }
          statusDisabled={isArchived}
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
                onClick={handleArchive}
              >
                <Archive className="size-4" aria-hidden />
                {t("archive")}
              </Button>
            </>
          ) : (
            <Button type="button" size="sm" onClick={handleRestore}>
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
