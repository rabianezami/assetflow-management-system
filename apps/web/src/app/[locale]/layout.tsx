import { Geist, Geist_Mono, Noto_Sans_Arabic, Vazirmatn } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThemeScript } from "@/components/theme-script";
import { isRtlLocale } from "@/i18n/config";
import { routing } from "@/i18n/routing";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const rtl = isRtlLocale(locale);
  const direction = rtl ? "rtl" : "ltr";
  const fontVariables = rtl
    ? `${vazirmatn.variable} ${notoSansArabic.variable} ${geistMono.variable}`
    : `${geistSans.variable} ${geistMono.variable}`;

  const fontSansStyle = {
    "--font-sans": rtl
      ? "var(--font-vazirmatn), var(--font-noto-arabic), ui-sans-serif, system-ui, sans-serif"
      : "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
  } as CSSProperties;

  return (
    <html
      lang={locale}
      dir={direction}
      suppressHydrationWarning
      className={`${fontVariables} h-full antialiased`}
      style={fontSansStyle}
    >
      <body className="flex min-h-full flex-col">
        <ThemeScript />
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
