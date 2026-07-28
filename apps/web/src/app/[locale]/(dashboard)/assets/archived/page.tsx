import { setRequestLocale } from "next-intl/server";

import { AssetsArchivedListPage } from "@/features/assets/components/assets-archived-list-page";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ArchivedAssetsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AssetsArchivedListPage />;
}
