"use client";

import { Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { EmptyState } from "@/components/common/empty-state";
import { SettingsLayout } from "@/components/common/settings-layout";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import {
  useMembers,
  useOrganization,
  useOrganizationMutations,
} from "@/features/organization/api";
import { OrganizationSettingsTabs } from "@/features/organization/components/organization-settings-tabs";
import type {
  MembershipRole,
  OrganizationMember,
} from "@/features/organization/contracts/organization.schemas";
import { ApiClientError } from "@/lib/api/client";
import { Card } from "@repo/ui/card";

function canManage(role: string | undefined): boolean {
  return role === "owner" || role === "admin";
}

function assignableRoles(viewerRole: MembershipRole | undefined): MembershipRole[] {
  if (viewerRole === "owner") {
    return ["owner", "admin", "member"];
  }
  if (viewerRole === "admin") {
    return ["admin", "member"];
  }
  return [];
}

function canActOnMember(
  viewerRole: MembershipRole | undefined,
  target: OrganizationMember,
): boolean {
  if (!canManage(viewerRole)) return false;
  if (viewerRole === "owner") return true;
  return target.role !== "owner";
}

export function MembersSettingsPage() {
  const t = useTranslations("Organization");
  const tSettings = useTranslations("Organization.settings");
  const tMembers = useTranslations("Organization.members");
  const tRoles = useTranslations("Organization.roles");

  const orgQuery = useOrganization();
  const membersQuery = useMembers();
  const { addMember, updateMemberRole, removeMember } =
    useOrganizationMutations();

  const viewerRole = orgQuery.data?.viewerRole;
  const manage = canManage(viewerRole);
  const roles = assignableRoles(viewerRole);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<MembershipRole>("member");
  const [formError, setFormError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const members = membersQuery.data ?? [];

  async function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    if (!manage) return;
    setFormError(null);
    try {
      await addMember.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });
      setName("");
      setEmail("");
      setPassword("");
      setRole("member");
    } catch (err) {
      if (err instanceof ApiClientError && err.code === "CONFLICT") {
        setFormError(tMembers("emailTaken"));
      } else if (err instanceof ApiClientError) {
        setFormError(err.message);
      } else {
        setFormError(tMembers("addFailed"));
      }
    }
  }

  async function handleRoleChange(member: OrganizationMember, nextRole: MembershipRole) {
    setActionError(null);
    try {
      await updateMemberRole.mutateAsync({
        id: member.id,
        body: { role: nextRole },
      });
    } catch (err) {
      setActionError(
        err instanceof ApiClientError ? err.message : tMembers("updateFailed"),
      );
    }
  }

  async function handleRemove(member: OrganizationMember) {
    setActionError(null);
    try {
      await removeMember.mutateAsync(member.id);
    } catch (err) {
      setActionError(
        err instanceof ApiClientError ? err.message : tMembers("removeFailed"),
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
      <div className="flex flex-col gap-6">
        {manage ? (
          <Card className="p-6">
            <h2 className="mb-4 text-heading-sm font-heading">
              {tMembers("addTitle")}
            </h2>
            <form
              className="grid max-w-xl gap-4 sm:grid-cols-2"
              onSubmit={handleAdd}
            >
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="member-name">{tMembers("name")}</Label>
                <Input
                  id="member-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="member-email">{tMembers("email")}</Label>
                <Input
                  id="member-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="member-password">{tMembers("password")}</Label>
                <Input
                  id="member-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="member-role">{tMembers("role")}</Label>
                <Select
                  id="member-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as MembershipRole)}
                >
                  {roles.map((value) => (
                    <option key={value} value={value}>
                      {tRoles(value)}
                    </option>
                  ))}
                </Select>
              </div>
              {formError ? (
                <p
                  className="text-body-sm text-destructive sm:col-span-2"
                  role="alert"
                >
                  {formError}
                </p>
              ) : null}
              <div className="sm:col-span-2">
                <Button type="submit" disabled={addMember.isPending}>
                  {addMember.isPending
                    ? tMembers("adding")
                    : tMembers("addSubmit")}
                </Button>
              </div>
            </form>
          </Card>
        ) : null}

        {actionError ? (
          <p className="text-body-sm text-destructive" role="alert">
            {actionError}
          </p>
        ) : null}

        {membersQuery.isLoading || orgQuery.isLoading ? (
          <p className="text-body-sm text-muted-foreground">{t("loading")}</p>
        ) : membersQuery.isError || orgQuery.isError ? (
          <p className="text-body-sm text-destructive" role="alert">
            {t("loadError")}
          </p>
        ) : members.length === 0 ? (
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <EmptyState
              icon={<Users className="size-6" />}
              title={tMembers("emptyTitle")}
              description={tMembers("emptyDescription")}
            />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full text-body-sm">
              <thead>
                <tr className="border-b border-border text-start text-muted-foreground">
                  <th className="px-4 py-3 font-medium">{tMembers("name")}</th>
                  <th className="px-4 py-3 font-medium">{tMembers("email")}</th>
                  <th className="px-4 py-3 font-medium">{tMembers("role")}</th>
                  {manage ? (
                    <th className="px-4 py-3 font-medium">{tMembers("actions")}</th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {members.map((member) => {
                  const actionable = canActOnMember(viewerRole, member);
                  const rowRoles = assignableRoles(viewerRole);
                  return (
                    <tr key={member.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3">{member.name}</td>
                      <td className="px-4 py-3">{member.email}</td>
                      <td className="px-4 py-3">
                        {actionable ? (
                          <Select
                            aria-label={tMembers("role")}
                            value={member.role}
                            disabled={updateMemberRole.isPending}
                            onChange={(e) =>
                              void handleRoleChange(
                                member,
                                e.target.value as MembershipRole,
                              )
                            }
                          >
                            {rowRoles.map((value) => (
                              <option key={value} value={value}>
                                {tRoles(value)}
                              </option>
                            ))}
                            {!rowRoles.includes(member.role) ? (
                              <option value={member.role}>
                                {tRoles(member.role)}
                              </option>
                            ) : null}
                          </Select>
                        ) : (
                          tRoles(member.role)
                        )}
                      </td>
                      {manage ? (
                        <td className="px-4 py-3">
                          {actionable ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              disabled={removeMember.isPending}
                              onClick={() => void handleRemove(member)}
                            >
                              {tMembers("remove")}
                            </Button>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      ) : null}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </SettingsLayout>
  );
}
