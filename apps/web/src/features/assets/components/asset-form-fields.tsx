"use client";

import { useTranslations } from "next-intl";

import { FileDropzone } from "@/components/common/file-dropzone";
import { Input, Label, Select } from "@/components/ui/input";
import type { AssetStatus } from "@/features/assets/types/asset.types";
import type { AssetType } from "@/features/assets/types/asset.types";
import type { Site } from "@/features/sites/api/sites";

const STATUSES: AssetStatus[] = [
  "active",
  "assigned",
  "maintenance",
  "retired",
  "error",
];

export type AssetFormValues = {
  uniqueId: string;
  displayName: string;
  typeId: string;
  status: AssetStatus;
  siteId: string;
};

type AssetFormFieldsProps = {
  assetTypes: AssetType[];
  sites: Site[];
  values: AssetFormValues;
  onChange: (values: AssetFormValues) => void;
  showPhoto?: boolean;
};

export function AssetFormFields({
  assetTypes,
  sites,
  values,
  onChange,
  showPhoto = true,
}: AssetFormFieldsProps) {
  const t = useTranslations("Assets.add");
  const tStatus = useTranslations("Status");

  function patch(partial: Partial<AssetFormValues>) {
    onChange({ ...values, ...partial });
  }

  return (
    <>
      {showPhoto ? (
        <FileDropzone label={t("photoLabel")} browseLabel={t("browse")} />
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="asset-type">
          {t("type")}{" "}
          <span className="text-muted-foreground">({t("required")})</span>
        </Label>
        <Select
          id="asset-type"
          value={values.typeId}
          onChange={(e) => patch({ typeId: e.target.value })}
          required
        >
          <option value="">{t("selectType")}</option>
          {assetTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="unique-id">
          {t("uniqueId")}{" "}
          <span className="text-muted-foreground">({t("required")})</span>
        </Label>
        <Input
          id="unique-id"
          value={values.uniqueId}
          onChange={(e) => patch({ uniqueId: e.target.value })}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="display-name">{t("displayName")}</Label>
        <Input
          id="display-name"
          value={values.displayName}
          onChange={(e) => patch({ displayName: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="status">{t("status")}</Label>
        <Select
          id="status"
          value={values.status}
          onChange={(e) => patch({ status: e.target.value as AssetStatus })}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {tStatus(s)}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="site">{t("site")}</Label>
        <Select
          id="site"
          value={values.siteId}
          onChange={(e) => patch({ siteId: e.target.value })}
        >
          <option value="">{t("sitePlaceholder")}</option>
          {sites.map((site) => (
            <option key={site.id} value={site.id}>
              {site.name}
            </option>
          ))}
        </Select>
      </div>
    </>
  );
}
