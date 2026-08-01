"use client";

import { Layers } from "lucide-react";
import { useTranslations } from "next-intl";

import { EmptyState } from "@/components/common/empty-state";
import { FormPageLayout } from "@/components/common/form-page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export function NoTypesGate() {
  const t = useTranslations("Assets.add");

  return (
    <FormPageLayout
      title={t("title")}
      cancelLabel={t("cancel")}
      cancelHref="/assets"
    >
      <EmptyState
        icon={<Layers className="size-6" />}
        title={t("noTypesTitle")}
        description={t("noTypesDescription")}
        action={
          <Button
            nativeButton={false}
            render={<Link href="/assets/settings/types" />}
          >
            {t("createTypeCta")}
          </Button>
        }
      />
    </FormPageLayout>
  );
}
