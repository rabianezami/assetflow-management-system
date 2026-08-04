"use client";

import { ClipboardList } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { EmptyState } from "@/components/common/empty-state";
import { SettingsLayout } from "@/components/common/settings-layout";
import { Button } from "@/components/ui/button";
import {
  useAssetTypeMutations,
  useAssetTypes,
} from "@/features/assets/api";
import { TypeFormModal } from "@/features/assets/components/type-form-modal";
import { isConflictError } from "@/features/assets/lib/api-error";
import { cn } from "@/lib/utils";

type ModalState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; typeId: string; name: string; statusGroup: string };

export function AssetTypesSettingsPage() {
  const t = useTranslations("Assets.settings");
  const tTypes = useTranslations("Assets.settings.types");
  const tAssets = useTranslations("Assets");

  const typesQuery = useAssetTypes({ limit: 100 });
  const { createAssetType, updateAssetType, deleteAssetType } =
    useAssetTypeMutations();

  const [modal, setModal] = useState<ModalState>({ mode: "closed" });
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const assetTypes = typesQuery.data?.items ?? [];
  const isLoading = typesQuery.isLoading;
  const isError = typesQuery.isError;

  const tabs = (
    <nav className="flex gap-6 border-b border-border" aria-label={t("tabsLabel")}>
      <span className="border-b-2 border-primary pb-3 text-body-sm font-medium text-primary">
        {tTypes("tab")}
      </span>
    </nav>
  );

  async function handleDelete(typeId: string) {
    setDeleteError(null);
    try {
      await deleteAssetType.mutateAsync(typeId);
    } catch (error) {
      setDeleteError(
        isConflictError(error) ? tTypes("deleteBlocked") : tAssets("loadError"),
      );
    }
  }

  return (
    <SettingsLayout
      title={t("title")}
      backLabel={t("backToAssets")}
      backHref="/assets"
      tabs={tabs}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-heading-sm font-heading">{tTypes("manageTitle")}</h2>
          <Button onClick={() => setModal({ mode: "create" })}>
            {tTypes("createType")}
          </Button>
        </div>

        {deleteError ? (
          <p className="text-body-sm text-destructive" role="alert">
            {deleteError}
          </p>
        ) : null}

        {isLoading ? (
          <p className="px-4 py-10 text-center text-body-sm text-muted-foreground">
            {tAssets("loading")}
          </p>
        ) : isError ? (
          <p className="px-4 py-10 text-center text-body-sm text-destructive" role="alert">
            {tAssets("loadError")}
          </p>
        ) : assetTypes.length === 0 ? (
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <EmptyState
              icon={<ClipboardList className="size-6" />}
              title={tTypes("emptyTitle")}
              description={tTypes("emptyDescription")}
              action={
                <Button onClick={() => setModal({ mode: "create" })}>
                  {tTypes("createType")}
                </Button>
              }
            />
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full text-body-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th
                    scope="col"
                    className="px-4 py-3 text-start font-medium text-muted-foreground"
                  >
                    {tTypes("columns.name")}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-start font-medium text-muted-foreground"
                  >
                    {tTypes("columns.statusGroup")}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-end font-medium text-muted-foreground"
                  >
                    {tTypes("columns.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {assetTypes.map((type) => (
                  <tr
                    key={type.id}
                    className="border-b border-border last:border-0 hover:bg-muted/50"
                  >
                    <td className="px-4 py-3 font-medium">{type.name}</td>
                    <td
                      className={cn(
                        "px-4 py-3",
                        !type.statusGroup && "text-muted-foreground",
                      )}
                    >
                      {type.statusGroup || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setModal({
                              mode: "edit",
                              typeId: type.id,
                              name: type.name,
                              statusGroup: type.statusGroup,
                            })
                          }
                        >
                          {tTypes("edit")}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => void handleDelete(type.id)}
                          disabled={deleteAssetType.isPending}
                        >
                          {tTypes("delete")}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TypeFormModal
        open={modal.mode !== "closed"}
        mode={modal.mode === "edit" ? "edit" : "create"}
        initialName={modal.mode === "edit" ? modal.name : ""}
        initialStatusGroup={modal.mode === "edit" ? modal.statusGroup : ""}
        onClose={() => setModal({ mode: "closed" })}
        onSubmit={async (name, statusGroup) => {
          if (modal.mode === "create") {
            await createAssetType.mutateAsync({ name, statusGroup });
            return;
          }
          if (modal.mode === "edit") {
            await updateAssetType.mutateAsync({
              id: modal.typeId,
              body: { name, statusGroup },
            });
          }
        }}
      />
    </SettingsLayout>
  );
}
