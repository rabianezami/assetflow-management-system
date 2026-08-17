export const organizationKeys = {
  all: ["organization"] as const,
  detail: () => [...organizationKeys.all, "detail"] as const,
};

export const memberKeys = {
  all: ["members"] as const,
  lists: () => [...memberKeys.all, "list"] as const,
  list: () => [...memberKeys.lists()] as const,
};
