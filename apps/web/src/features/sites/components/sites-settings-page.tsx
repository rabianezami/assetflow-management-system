"use client";

import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { EmptyState } from "@/components/common/empty-state";
import { SettingsLayout } from "@/components/common/settings-layout";
import { Button } from "@/components/ui/button";
import { AssetsSettingsTabs } from "@/features/assets/components/assets-settings-tabs";
import { isConflictError } from "@/lib/api/client";
import { useSiteMutations, useSites } from "@/features/sites/api";
import { SiteFormModal } from "@/features/sites/components/site-form-modal";

type ModalState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; siteId: string; name: string };

export function SitesSettingsPage() {
  const t = useTranslations("Assets.settings");
  const tSites = useTranslations("Assets.settings.sites");
  const tAssets = useTranslations("Assets");

  const sitesQuery = useSites({ limit: 100 });
  const { createSite, updateSite, deleteSite } = useSiteMutations();

  const [modal, setModal] = useState<ModalState>({ mode: "closed" });
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const sites = sitesQuery.data?.items ?? [];

  async function handleDelete(siteId: string) {
    setDeleteError(null);
    try {
      await deleteSite.mutateAsync(siteId);
    } catch (error) {
      setDeleteError(
        isConflictError(error) ? tSites("deleteBlocked") : tAssets("loadError"),
      );
    }
  }

  return (
    <SettingsLayout
      title={t("title")}
      backLabel={t("backToAssets")}
      backHref="/assets"
      tabs={<AssetsSettingsTabs />}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-heading-sm font-heading">{tSites("manageTitle")}</h2>
          <Button onClick={() => setModal({ mode: "create" })}>
            {tSites("createSite")}
          </Button>
        </div>

        {deleteError ? (
          <p className="text-body-sm text-destructive" role="alert">
            {deleteError}
          </p>
        ) : null}

        {sitesQuery.isLoading ? (
          <p className="px-4 py-10 text-center text-body-sm text-muted-foreground">
            {tAssets("loading")}
          </p>
        ) : sitesQuery.isError ? (
          <p
            className="px-4 py-10 text-center text-body-sm text-destructive"
            role="alert"
          >
            {tAssets("loadError")}
          </p>
        ) : sites.length === 0 ? (
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <EmptyState
              icon={<MapPin className="size-6" />}
              title={tSites("emptyTitle")}
              description={tSites("emptyDescription")}
              action={
                <Button onClick={() => setModal({ mode: "create" })}>
                  {tSites("createSite")}
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
                    {tSites("columns.name")}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-end font-medium text-muted-foreground"
                  >
                    {tSites("columns.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sites.map((site) => (
                  <tr
                    key={site.id}
                    className="border-b border-border last:border-0 hover:bg-muted/50"
                  >
                    <td className="px-4 py-3 font-medium">{site.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setModal({
                              mode: "edit",
                              siteId: site.id,
                              name: site.name,
                            })
                          }
                        >
                          {tSites("edit")}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => void handleDelete(site.id)}
                          disabled={deleteSite.isPending}
                        >
                          {tSites("delete")}
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

      <SiteFormModal
        open={modal.mode !== "closed"}
        mode={modal.mode === "edit" ? "edit" : "create"}
        initialName={modal.mode === "edit" ? modal.name : ""}
        onClose={() => setModal({ mode: "closed" })}
        onSubmit={async (name) => {
          try {
            if (modal.mode === "create") {
              await createSite.mutateAsync({ name });
              return;
            }
            if (modal.mode === "edit") {
              await updateSite.mutateAsync({
                id: modal.siteId,
                body: { name },
              });
            }
          } catch (error) {
            if (isConflictError(error)) {
              throw new Error(tSites("nameTaken"));
            }
            throw new Error(tAssets("loadError"));
          }
        }}
      />
    </SettingsLayout>
  );
}
