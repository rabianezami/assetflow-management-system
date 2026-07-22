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

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations("Auth");

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-8 shadow-sm">
      <PageHeader title={t("loginTitle")} description={t("loginDescription")} />
      <Button nativeButton={false} render={<Link href="/dashboard" />}>
        {t("continuePlaceholder")}
      </Button>
      <Button nativeButton={false} render={<Link href="/" />} variant="ghost">
        {t("backHome")}
      </Button>
    </div>
  );
}
