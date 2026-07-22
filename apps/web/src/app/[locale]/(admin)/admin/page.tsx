import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminPage({ params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations("Admin");

  return (
    <div className="mx-auto flex w-full max-w-[var(--content-max-width)] flex-col gap-6 px-[var(--page-padding-x)] py-[var(--page-padding-y)]">
      <PageHeader title={t("title")} description={t("description")} />
      <Button nativeButton={false} render={<Link href="/dashboard" />} variant="outline">
        {t("backToDashboard")}
      </Button>
    </div>
  );
}
