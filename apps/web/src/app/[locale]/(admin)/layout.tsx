import { getTranslations } from "next-intl/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("Admin");

  return (
    <div className="flex min-h-svh flex-col">
      <div className="border-b border-border bg-muted/40 px-[var(--page-padding-x)] py-3">
        <p className="text-body-sm text-muted-foreground">{t("layoutNotice")}</p>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
