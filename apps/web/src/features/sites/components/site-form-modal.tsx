"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

type SiteFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialName?: string;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
};

export function SiteFormModal({
  open,
  mode,
  initialName = "",
  onClose,
  onSubmit,
}: SiteFormModalProps) {
  const t = useTranslations("Assets.settings.sites");
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initialName);
      setError(null);
      setPending(false);
    }
  }, [open, initialName]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || pending) return;
    setError(null);
    setPending(true);
    try {
      await onSubmit(name.trim());
      setName("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("saveFailed"));
    } finally {
      setPending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onClick={pending ? undefined : onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="site-form-title"
        className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="site-form-title" className="text-heading-sm font-heading">
            {mode === "create" ? t("createModalTitle") : t("editModalTitle")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="text-muted-foreground hover:text-foreground disabled:opacity-50"
            aria-label={t("cancel")}
          >
            ×
          </button>
        </div>
        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="mt-6 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="site-name">{t("siteName")}</Label>
            <Input
              id="site-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("siteNamePlaceholder")}
              required
              disabled={pending}
            />
          </div>
          {error ? (
            <p className="text-body-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={pending}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={pending}>
              {mode === "create" ? t("create") : t("save")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
