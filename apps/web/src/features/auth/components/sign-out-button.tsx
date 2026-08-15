"use client";

import { signOut } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const t = useTranslations("Auth");
  const locale = useLocale();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => {
        void signOut({ callbackUrl: `/${locale}/login` });
      }}
    >
      {t("signOut")}
    </Button>
  );
}
