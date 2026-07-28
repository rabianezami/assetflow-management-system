import { setRequestLocale } from "next-intl/server";

import { AddAssetFormPage } from "@/features/assets/components/add-asset-form-page";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function NewAssetPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AddAssetFormPage />;
}
