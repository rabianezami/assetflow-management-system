"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

type TypeFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialName?: string;
  initialStatusGroup?: string;
  onClose: () => void;
  onSubmit: (name: string, statusGroup: string) => Promise<void>;
};

export function TypeFormModal({
  open,
  mode,
  initialName = "",
  initialStatusGroup = "",
  onClose,
  onSubmit,
}: TypeFormModalProps) {
  const t = useTranslations("Assets.settings.types");
  const tAssets = useTranslations("Assets");
  const [name, setName] = useState(initialName);
  const [statusGroup, setStatusGroup] = useState(initialStatusGroup);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initialName);
      setStatusGroup(initialStatusGroup);
      setError(null);
      setPending(false);
    }
  }, [open, initialName, initialStatusGroup]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || pending) return;
    setError(null);
    setPending(true);
    try {
      await onSubmit(name, statusGroup);
      setName("");
      setStatusGroup("");
      onClose();
    } catch {
      setError(tAssets("loadError"));
    } finally {
      setPending(false);
    }
  }

  const title = mode === "create" ? t("createModalTitle") : t("editModalTitle");
  const submitLabel = mode === "create" ? t("create") : t("save");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onClick={pending ? undefined : onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="type-form-title"
        className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="type-form-title" className="text-heading-sm font-heading">
            {title}
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
            <Label htmlFor="type-name">{t("typeName")}</Label>
            <Input
              id="type-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("typeNamePlaceholder")}
              required
              disabled={pending}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="status-group">{t("statusGroup")}</Label>
            <Input
              id="status-group"
              value={statusGroup}
              onChange={(e) => setStatusGroup(e.target.value)}
              placeholder={t("statusGroupPlaceholder")}
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
              {submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
