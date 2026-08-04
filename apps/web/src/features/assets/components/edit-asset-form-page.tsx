"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { EmptyState } from "@/components/common/empty-state";
import { FormPageLayout } from "@/components/common/form-page-layout";
import { Button } from "@/components/ui/button";
import {
  useAsset,
  useAssetMutations,
  useAssetTypes,
} from "@/features/assets/api";
import {
  AssetFormFields,
  type AssetFormValues,
} from "@/features/assets/components/asset-form-fields";
import { isConflictError } from "@/features/assets/lib/api-error";
import { isArchivedLifecycle } from "@/features/assets/lib/asset-helpers";
import { Link, useRouter } from "@/i18n/navigation";
import { Card } from "@repo/ui/card";

type EditAssetFormPageProps = {
  assetId: string;
};

export function EditAssetFormPage({ assetId }: EditAssetFormPageProps) {
  const t = useTranslations("Assets.edit");
  const tAdd = useTranslations("Assets.add");
  const tDetail = useTranslations("Assets.detail");
  const tAssets = useTranslations("Assets");
  const router = useRouter();

  const assetQuery = useAsset(assetId);
  const typesQuery = useAssetTypes({ limit: 100 });
  const { updateAsset } = useAssetMutations();

  const [values, setValues] = useState<AssetFormValues | null>(null);
  const [error, setError] = useState<string | null>(null);

  const asset = assetQuery.data;

  useEffect(() => {
    if (asset && !isArchivedLifecycle(asset)) {
      setValues({
        uniqueId: asset.uniqueId,
        displayName: asset.displayName,
        typeId: asset.typeId,
        status: asset.status,
        site: asset.site,
      });
    }
  }, [asset]);

  if (assetQuery.isLoading || typesQuery.isLoading) {
    return (
      <p className="px-4 py-16 text-center text-body-sm text-muted-foreground">
        {tAssets("loading")}
      </p>
    );
  }

  if (assetQuery.isError || !asset) {
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

  if (isArchivedLifecycle(asset)) {
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

  const assetTypes = typesQuery.data?.items ?? [];

  if (!values) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values || !values.uniqueId.trim() || !values.typeId) return;
    setError(null);
    try {
      await updateAsset.mutateAsync({
        id: assetId,
        body: {
          uniqueId: values.uniqueId,
          displayName: values.displayName || undefined,
          typeId: values.typeId,
          status: values.status,
          site: values.site || undefined,
        },
      });
      router.push(`/assets/${assetId}`);
    } catch (err) {
      setError(isConflictError(err) ? t("duplicateUniqueId") : tAssets("loadError"));
    }
  }

  return (
    <FormPageLayout
      title={t("title")}
      cancelLabel={tAdd("cancel")}
      cancelHref={`/assets/${assetId}`}
    >
      <Card className="p-6">
        <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-5">
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
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={updateAsset.isPending}
          >
            {t("save")}
          </Button>
        </form>
      </Card>
    </FormPageLayout>
  );
}
