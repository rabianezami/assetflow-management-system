import { apiFetch } from "@/lib/api/client";
import type {
  AddMemberBody,
  OrganizationDetail,
  OrganizationMember,
  UpdateMemberRoleBody,
  UpdateOrganizationBody,
} from "@/features/organization/contracts/organization.schemas";

const ORGANIZATION_BASE = "/api/v1/organization";
const MEMBERS_BASE = "/api/v1/members";

export async function fetchOrganization(): Promise<OrganizationDetail> {
  const { data } = await apiFetch<OrganizationDetail>(ORGANIZATION_BASE);
  return data;
}

export async function updateOrganization(
  body: UpdateOrganizationBody,
): Promise<OrganizationDetail> {
  const { data } = await apiFetch<OrganizationDetail>(ORGANIZATION_BASE, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return data;
}

export async function fetchMembers(): Promise<OrganizationMember[]> {
  const { data } = await apiFetch<OrganizationMember[]>(MEMBERS_BASE);
  return data;
}

export async function addMember(
  body: AddMemberBody,
): Promise<OrganizationMember> {
  const { data } = await apiFetch<OrganizationMember>(MEMBERS_BASE, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return data;
}

export async function updateMemberRole(
  id: string,
  body: UpdateMemberRoleBody,
): Promise<OrganizationMember> {
  const { data } = await apiFetch<OrganizationMember>(`${MEMBERS_BASE}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return data;
}

export async function removeMember(id: string): Promise<{ id: string }> {
  const { data } = await apiFetch<{ id: string }>(`${MEMBERS_BASE}/${id}`, {
    method: "DELETE",
  });
  return data;
}
