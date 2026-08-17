import { z } from "zod";

export const membershipRoleSchema = z.enum(["owner", "admin", "member"]);

export type MembershipRole = z.infer<typeof membershipRoleSchema>;

export const updateOrganizationSchema = z.object({
  name: z.string().trim().min(1, "name is required"),
});

export type UpdateOrganizationBody = z.infer<typeof updateOrganizationSchema>;

export const addMemberSchema = z.object({
  name: z.string().trim().min(1, "name is required"),
  email: z.string().trim().email("email must be a valid email"),
  password: z.string().min(8, "password must be at least 8 characters"),
  role: membershipRoleSchema.default("member"),
});

export type AddMemberBody = z.infer<typeof addMemberSchema>;

export const updateMemberRoleSchema = z.object({
  role: membershipRoleSchema,
});

export type UpdateMemberRoleBody = z.infer<typeof updateMemberRoleSchema>;

export const memberIdParamSchema = z.object({
  id: z.string().uuid("id must be a valid uuid"),
});

export type OrganizationDetail = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  viewerRole: MembershipRole;
};

export type OrganizationMember = {
  id: string;
  userId: string;
  email: string;
  name: string;
  role: MembershipRole;
  createdAt: string;
};
