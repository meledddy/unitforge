export const mockSessionUser = {
  id: "0e53fe17-7af9-4c45-83df-a1a6d7231bf5",
  email: "operator@unitforge.dev",
  name: "Unitforge Operator",
} as const;

export const mockSessionWorkspace = {
  id: "f5ec1830-7b93-48cf-b157-fbafca907157",
  name: "Unitforge Studio",
  slug: "unitforge-studio",
} as const;

export const mockSessionMembership = {
  role: "owner",
} as const;

export const mockSessionSubscription = {
  plan: "studio",
  provider: "stripe",
  status: "trialing",
  currentPeriodEnd: "2026-05-08T00:00:00.000Z",
} as const;
