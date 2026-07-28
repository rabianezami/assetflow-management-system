import { setRequestLocale } from "next-intl/server";

import { AssetDetailPageClient } from "@/features/assets/components/asset-detail-page";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function AssetDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <AssetDetailPageClient assetId={id} />;
}
