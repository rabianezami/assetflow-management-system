import { getTranslations, setRequestLocale } from "next-intl/server";

import { LocaleSwitcher } from "@/components/common/locale-switcher";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import { localeNames, type Locale } from "@/i18n/config";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function MarketingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("HomePage");
  const tStatus = await getTranslations("Status");
  const tMarketing = await getTranslations("Marketing");

  return (
    <div className="flex min-h-svh flex-1 flex-col items-center justify-center px-6 py-16">
      <main className="flex w-full max-w-2xl flex-col gap-8 rounded-xl border border-border bg-card p-8 shadow-sm">
        <PageHeader
          title={t("title")}
          description={t("description")}
          actions={<ThemeToggle />}
        />

        <p className="text-caption tracking-wide text-muted-foreground uppercase">
          {t("localeLabel")}: {localeNames[locale as Locale]}
        </p>

        <div className="flex flex-wrap gap-2">
          <StatusBadge status="active" label={tStatus("active")} />
          <StatusBadge status="assigned" label={tStatus("assigned")} />
          <StatusBadge status="maintenance" label={tStatus("maintenance")} />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button nativeButton={false} render={<Link href="/dashboard" />}>
            {tMarketing("goToDashboard")}
          </Button>
          <Button
            nativeButton={false}
            render={<Link href="/login" />}
            variant="outline"
          >
            {tMarketing("goToLogin")}
          </Button>
        </div>

        <LocaleSwitcher />
      </main>
    </div>
  );
}
