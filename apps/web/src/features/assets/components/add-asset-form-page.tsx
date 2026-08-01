"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { FormPageLayout } from "@/components/common/form-page-layout";
import { Button } from "@/components/ui/button";
import {
  AssetFormFields,
  type AssetFormValues,
} from "@/features/assets/components/asset-form-fields";
import { NoTypesGate } from "@/features/assets/components/no-types-gate";
import { useAssetsStore } from "@/features/assets/stores/use-assets-store";
import { useRouter } from "@/i18n/navigation";
import { Card } from "@repo/ui/card";

export function AddAssetFormPage() {
  const t = useTranslations("Assets.add");
  const router = useRouter();
  const assetTypes = useAssetsStore((s) => s.assetTypes);
  const addAsset = useAssetsStore((s) => s.addAsset);

  const [values, setValues] = useState<AssetFormValues>({
    uniqueId: "",
    displayName: "",
    typeId: "",
    status: "active",
    site: "",
  });
  const [error, setError] = useState<string | null>(null);

  if (assetTypes.length === 0) {
    return <NoTypesGate />;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.uniqueId.trim() || !values.typeId) return;
    setError(null);
    const asset = addAsset(values);
    if (!asset) {
      setError(t("duplicateUniqueId"));
      return;
    }
    router.push(`/assets/${asset.id}`);
  }

  return (
    <FormPageLayout
      title={t("title")}
      cancelLabel={t("cancel")}
      cancelHref="/assets"
    >
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <AssetFormFields
            assetTypes={assetTypes}
            values={values}
            onChange={setValues}
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

