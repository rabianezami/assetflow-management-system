import { setRequestLocale } from "next-intl/server";

import { AssetsListPage } from "@/features/assets/components/assets-list-page";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AssetsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AssetsListPage />;
}
