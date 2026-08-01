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
  onSubmit: (name: string, statusGroup: string) => void;
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
  const [name, setName] = useState(initialName);
  const [statusGroup, setStatusGroup] = useState(initialStatusGroup);

  useEffect(() => {
    if (open) {
      setName(initialName);
      setStatusGroup(initialStatusGroup);
    }
  }, [open, initialName, initialStatusGroup]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name, statusGroup);
    setName("");
    setStatusGroup("");
    onClose();
  }

  const title = mode === "create" ? t("createModalTitle") : t("editModalTitle");
  const submitLabel = mode === "create" ? t("create") : t("save");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onClick={onClose}
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
            className="text-muted-foreground hover:text-foreground"
            aria-label={t("cancel")}
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="type-name">{t("typeName")}</Label>
            <Input
              id="type-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("typeNamePlaceholder")}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="status-group">{t("statusGroup")}</Label>
            <Input
              id="status-group"
              value={statusGroup}
              onChange={(e) => setStatusGroup(e.target.value)}
              placeholder={t("statusGroupPlaceholder")}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button type="submit">{submitLabel}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
