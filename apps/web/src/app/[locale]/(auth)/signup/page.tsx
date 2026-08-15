import { getTranslations, setRequestLocale } from "next-intl/server";

import { PageHeader } from "@/components/common/page-header";
import { SignupForm } from "@/features/auth/components/signup-form";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SignupPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Auth");

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-8 shadow-sm">
      <PageHeader title={t("signupTitle")} description={t("signupDescription")} />
      <SignupForm />
      <p className="text-center text-body-sm">
        <Link
          href="/"
          className="text-muted-foreground underline-offset-4 hover:underline"
        >
          {t("backHome")}
        </Link>
      </p>
    </div>
  );
}
