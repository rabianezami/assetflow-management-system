import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LayoutDashboard } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations("Dashboard");

  return (
    <div className="mx-auto flex w-full max-w-[var(--content-max-width)] flex-col gap-8">
      <PageHeader title={t("title")} description={t("description")} />
      <EmptyState
        icon={<LayoutDashboard className="size-6" />}
        title={t("emptyTitle")}
        description={t("emptyDescription")}
        action={
          <Button nativeButton={false} render={<Link href="/" />} variant="outline">
            {t("backHome")}
          </Button>
        }
      />
    </div>
  );
}
