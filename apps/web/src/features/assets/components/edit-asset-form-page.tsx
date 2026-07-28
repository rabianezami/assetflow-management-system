"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { EmptyState } from "@/components/common/empty-state";
import { FormPageLayout } from "@/components/common/form-page-layout";
import { Button } from "@/components/ui/button";
import {
  AssetFormFields,
  type AssetFormValues,
} from "@/features/assets/components/asset-form-fields";
import { useAssetsStore } from "@/features/assets/stores/use-assets-store";
import { Link, useRouter } from "@/i18n/navigation";
import { Card } from "@repo/ui/card";

type EditAssetFormPageProps = {
  assetId: string;
};

export function EditAssetFormPage({ assetId }: EditAssetFormPageProps) {
  const t = useTranslations("Assets.edit");
  const tAdd = useTranslations("Assets.add");
  const tDetail = useTranslations("Assets.detail");
  const router = useRouter();
  const asset = useAssetsStore((s) => s.assets.find((a) => a.id === assetId));
  const assetTypes = useAssetsStore((s) => s.assetTypes);
  const updateAsset = useAssetsStore((s) => s.updateAsset);

  const [values, setValues] = useState<AssetFormValues | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (asset && (asset.lifecycle ?? "active") === "active") {
      setValues({
        uniqueId: asset.uniqueId,
        displayName: asset.displayName,
        typeId: asset.typeId,
        status: asset.status,
        site: asset.site,
      });
    }
  }, [asset]);

  if (!asset) {
    return (
      <EmptyState
        title={tDetail("notFoundTitle")}
        description={tDetail("notFoundDescription")}
        action={
          <Link href="/assets" className="text-primary hover:underline">
            {tDetail("backToList")}
          </Link>
        }
      />
    );
  }

  if ((asset.lifecycle ?? "active") === "archived") {
    return (
      <EmptyState
        title={tDetail("archivedNotice")}
        action={
          <Link href={`/assets/${assetId}`} className="text-primary hover:underline">
            {tDetail("backToList")}
          </Link>
        }
      />
    );
  }

  if (!values) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values || !values.uniqueId.trim() || !values.typeId) return;
    setError(null);
    const ok = updateAsset(assetId, values);
    if (!ok) {
      setError(t("duplicateUniqueId"));
      return;
    }
    router.push(`/assets/${assetId}`);
  }

  return (
    <FormPageLayout
      title={t("title")}
      cancelLabel={tAdd("cancel")}
      cancelHref={`/assets/${assetId}`}
    >
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <AssetFormFields
            assetTypes={assetTypes}
            values={values}
            onChange={setValues}
            showPhoto={false}
          />
          {error ? (
            <p className="text-body-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" size="lg" className="w-full">
            {t("save")}
          </Button>
        </form>
      </Card>
    </FormPageLayout>
  );
}
