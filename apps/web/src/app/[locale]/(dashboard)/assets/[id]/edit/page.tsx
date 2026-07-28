import { setRequestLocale } from "next-intl/server";

import { EditAssetFormPage } from "@/features/assets/components/edit-asset-form-page";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function EditAssetPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <EditAssetFormPage assetId={id} />;
}
