"use client";

import { useQuery } from "@tanstack/react-query";

import {
  fetchMembers,
  fetchOrganization,
} from "@/features/organization/api/organization";
import {
  memberKeys,
  organizationKeys,
} from "@/features/organization/api/keys";

export function useOrganization() {
  return useQuery({
    queryKey: organizationKeys.detail(),
    queryFn: () => fetchOrganization(),
  });
}

export function useMembers() {
  return useQuery({
    queryKey: memberKeys.list(),
    queryFn: () => fetchMembers(),
  });
}
