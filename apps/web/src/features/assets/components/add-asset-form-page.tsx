"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { FormPageLayout } from "@/components/common/form-page-layout";
import { Button } from "@/components/ui/button";
import { useAssetMutations, useAssetTypes } from "@/features/assets/api";
import {
  AssetFormFields,
  type AssetFormValues,
} from "@/features/assets/components/asset-form-fields";
import { NoTypesGate } from "@/features/assets/components/no-types-gate";
import { isConflictError } from "@/lib/api/client";
import { useSites } from "@/features/sites/api";
import { useRouter } from "@/i18n/navigation";
import { Card } from "@repo/ui/card";

export function AddAssetFormPage() {
  const t = useTranslations("Assets.add");
  const tAssets = useTranslations("Assets");
  const router = useRouter();
  const typesQuery = useAssetTypes({ limit: 100 });
  const sitesQuery = useSites({ limit: 100 });
  const { createAsset } = useAssetMutations();

  const [values, setValues] = useState<AssetFormValues>({
    uniqueId: "",
    displayName: "",
    typeId: "",
    status: "active",
    siteId: "",
  });
  const [error, setError] = useState<string | null>(null);

  if (typesQuery.isLoading || sitesQuery.isLoading) {
    return (
      <p className="px-4 py-16 text-center text-body-sm text-muted-foreground">
        {tAssets("loading")}
      </p>
    );
  }

  if (typesQuery.isError || sitesQuery.isError) {
    return (
      <p className="px-4 py-16 text-center text-body-sm text-destructive" role="alert">
        {tAssets("loadError")}
      </p>
    );
  }

  const assetTypes = typesQuery.data?.items ?? [];
  const sites = sitesQuery.data?.items ?? [];

  if (assetTypes.length === 0) {
    return <NoTypesGate />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.uniqueId.trim() || !values.typeId) return;
    setError(null);
    try {
      const asset = await createAsset.mutateAsync({
        uniqueId: values.uniqueId,
        displayName: values.displayName || undefined,
        typeId: values.typeId,
        status: values.status,
        siteId: values.siteId || null,
      });
      router.push(`/assets/${asset.id}`);
    } catch (err) {
      setError(isConflictError(err) ? t("duplicateUniqueId") : tAssets("loadError"));
    }
  }

  return (
    <FormPageLayout
      title={t("title")}
      cancelLabel={t("cancel")}
      cancelHref="/assets"
    >
      <Card className="p-6">
        <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-5">
          <AssetFormFields
            assetTypes={assetTypes}
            sites={sites}
            values={values}
            onChange={setValues}
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
            disabled={createAsset.isPending}
          >
            {t("save")}
          </Button>
        </form>
      </Card>
    </FormPageLayout>
  );
}
