/**
 * Phase 2 single-tenant mock.
 * Auth / real organization scoping land in Phase 3.
 */
export const MOCK_ORGANIZATION_ID = "00000000-0000-4000-8000-000000000001";

export function getRequestOrganizationId(): string {
  return MOCK_ORGANIZATION_ID;
}
