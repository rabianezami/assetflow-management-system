"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  addMember,
  removeMember,
  updateMemberRole,
  updateOrganization,
} from "@/features/organization/api/organization";
import {
  memberKeys,
  organizationKeys,
} from "@/features/organization/api/keys";
import type {
  AddMemberBody,
  UpdateMemberRoleBody,
  UpdateOrganizationBody,
} from "@/features/organization/contracts/organization.schemas";

export function useOrganizationMutations() {
  const queryClient = useQueryClient();

  const invalidateMembers = () =>
    queryClient.invalidateQueries({ queryKey: memberKeys.all });

  const updateOrg = useMutation({
    mutationFn: (body: UpdateOrganizationBody) => updateOrganization(body),
    onSuccess: (org) => {
      queryClient.setQueryData(organizationKeys.detail(), org);
    },
  });

  const createMember = useMutation({
    mutationFn: (body: AddMemberBody) => addMember(body),
    onSuccess: () => invalidateMembers(),
  });

  const changeRole = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: UpdateMemberRoleBody;
    }) => updateMemberRole(id, body),
    onSuccess: () => invalidateMembers(),
  });

  const deleteMember = useMutation({
    mutationFn: (id: string) => removeMember(id),
    onSuccess: () => invalidateMembers(),
  });

  return {
    updateOrganization: updateOrg,
    addMember: createMember,
    updateMemberRole: changeRole,
    removeMember: deleteMember,
  };
}
