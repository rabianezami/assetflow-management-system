import { setRequestLocale } from "next-intl/server";

import { SitesSettingsPage } from "@/features/sites/components/sites-settings-page";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SitesSettingsRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SitesSettingsPage />;
}
