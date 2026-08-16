import { setRequestLocale } from "next-intl/server";

import { OrganizationSettingsPage } from "@/features/organization/components/organization-settings-page";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function OrganizationSettingsRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <OrganizationSettingsPage />;
}
