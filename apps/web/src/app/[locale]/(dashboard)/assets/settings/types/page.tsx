import { setRequestLocale } from "next-intl/server";

import { AssetTypesSettingsPage } from "@/features/assets/components/asset-types-settings-page";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AssetTypesSettingsRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AssetTypesSettingsPage />;
}
