import { useTranslations } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { use } from "react"

import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { localeNames, type Locale } from "@/i18n/config"
import { routing } from "@/i18n/routing"

type Props = {
  params: Promise<{ locale: string }>
}

export default function HomePage({ params }: Props) {
  const { locale } = use(params)

  setRequestLocale(locale)

  const t = useTranslations("HomePage")

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <main className="flex w-full max-w-2xl flex-col gap-8 rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="flex flex-col gap-3">
          <p className="text-caption text-muted-foreground uppercase tracking-wide">
            {t("localeLabel")}: {localeNames[locale as Locale]}
          </p>
          <h1 className="text-heading-lg font-heading text-foreground">
            {t("title")}
          </h1>
          <p className="text-body text-muted-foreground">{t("description")}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {routing.locales.map((item) => (
            <Button
              key={item}
              nativeButton={false}
              render={<Link href="/" locale={item} />}
              variant={item === locale ? "default" : "outline"}
              size="sm"
            >
              {localeNames[item]}
            </Button>
          ))}
        </div>
      </main>
    </div>
  )
}
