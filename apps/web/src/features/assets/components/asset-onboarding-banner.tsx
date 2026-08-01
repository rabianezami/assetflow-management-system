"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { useAssetsStore } from "@/features/assets/stores/use-assets-store";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function AssetOnboardingBanner() {
  const t = useTranslations("Assets.onboarding");
  const assetTypes = useAssetsStore((s) => s.assetTypes);
  const allAssets = useAssetsStore((s) => s.assets);
  const hasAssets = useMemo(
    () => allAssets.some((a) => (a.lifecycle ?? "active") === "active"),
    [allAssets],
  );
  const dismissed = useAssetsStore((s) => s.onboardingDismissed);
  const dismiss = useAssetsStore((s) => s.dismissOnboarding);

  const hasTypes = assetTypes.length > 0;
  const allDone = hasTypes && hasAssets;

  if (dismissed || allDone) return null;

  const steps = [
    { done: hasTypes, label: t("stepTypes"), href: "/assets/settings/types" },
    { done: hasAssets, label: t("stepAssets"), href: "/assets/new" },
  ];

  return (
    <div className="relative rounded-xl border border-border bg-card p-6 shadow-sm">
      <button
        type="button"
        onClick={dismiss}
        className="absolute end-4 top-4 text-muted-foreground hover:text-foreground"
        aria-label={t("dismiss")}
      >
        ×
      </button>
      <h2 className="text-heading-sm font-heading text-foreground">{t("title")}</h2>
      <p className="mt-1 text-body-sm text-muted-foreground">{t("description")}</p>
      <div className="mt-4 flex flex-wrap gap-4">
        {steps.map((step) => (
          <div
            key={step.label}
            className={cn(
              "flex min-w-[10rem] flex-1 items-center gap-3 rounded-lg border border-border p-4",
              step.done && "bg-muted/30",
            )}
          >
            {step.done ? (
              <CheckCircle2 className="size-5 shrink-0 text-status-active" aria-hidden />
            ) : (
              <Circle className="size-5 shrink-0 text-muted-foreground" aria-hidden />
            )}
            <div className="flex flex-col gap-1">
              <span
                className={cn(
                  "text-body-sm font-medium",
                  step.done && "text-muted-foreground line-through",
                )}
              >
                {step.label}
              </span>
              {!step.done ? (
                <Button
                  nativeButton={false}
                  render={<Link href={step.href} />}
                  variant="link"
                  size="sm"
                  className="h-auto p-0"
                >
                  {t("start")}
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
