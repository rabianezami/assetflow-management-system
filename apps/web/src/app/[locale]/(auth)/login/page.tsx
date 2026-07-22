import { getTranslations, setRequestLocale } from "next-intl/server";

import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;
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
