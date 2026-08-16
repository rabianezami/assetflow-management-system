"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { SettingsLayout } from "@/components/common/settings-layout";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import {
  useOrganization,
  useOrganizationMutations,
} from "@/features/organization/api";
import { OrganizationSettingsTabs } from "@/features/organization/components/organization-settings-tabs";
import { ApiClientError } from "@/lib/api/client";
import { Card } from "@repo/ui/card";

function canManage(role: string | undefined): boolean {
  return role === "owner" || role === "admin";
}

export function OrganizationSettingsPage() {
  const t = useTranslations("Organization");
  const tSettings = useTranslations("Organization.settings");
  const orgQuery = useOrganization();
  const { updateOrganization } = useOrganizationMutations();

  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (orgQuery.data?.name) {
      setName(orgQuery.data.name);
    }
  }, [orgQuery.data?.name]);

  const viewerRole = orgQuery.data?.viewerRole;
  const manage = canManage(viewerRole);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!manage) return;
    setError(null);
    setSaved(false);
    try {
      await updateOrganization.mutateAsync({ name: name.trim() });
      setSaved(true);
    } catch (err) {
      setError(
        err instanceof ApiClientError ? err.message : t("saveFailed"),
      );
    }
  }

  return (
    <SettingsLayout
      title={tSettings("title")}
      backLabel={tSettings("backToDashboard")}
      backHref="/dashboard"
      tabs={<OrganizationSettingsTabs />}
    >
      {orgQuery.isLoading ? (
        <p className="text-body-sm text-muted-foreground">{t("loading")}</p>
      ) : orgQuery.isError ? (
        <p className="text-body-sm text-destructive" role="alert">
          {t("loadError")}
        </p>
      ) : (
        <Card className="p-6">
          <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="org-name">{t("name")}</Label>
              <Input
                id="org-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSaved(false);
                }}
                disabled={!manage || updateOrganization.isPending}
                required
              />
            </div>

            {error ? (
              <p className="text-body-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            {saved ? (
              <p className="text-body-sm text-muted-foreground" role="status">
                {t("saved")}
              </p>
            ) : null}

            {manage ? (
              <Button
                type="submit"
                disabled={updateOrganization.isPending || !name.trim()}
                className="w-fit"
              >
                {updateOrganization.isPending ? t("saving") : t("save")}
              </Button>
            ) : (
              <p className="text-body-sm text-muted-foreground">
                {t("readOnly")}
              </p>
            )}
          </form>
        </Card>
      )}
    </SettingsLayout>
  );
}
