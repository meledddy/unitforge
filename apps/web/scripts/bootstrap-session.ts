import { mockSessionUser, mockSessionWorkspace } from "@unitforge/core";

import { getBootstrapAppShellSession } from "../src/server/auth/service";

export async function getSeededAppShellSession() {
  return getBootstrapAppShellSession({
    userId: mockSessionUser.id,
    workspaceId: mockSessionWorkspace.id,
  });
}
