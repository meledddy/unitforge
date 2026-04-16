import "dotenv/config";

import { onboardPilotWorkspaceUser } from "../onboarding";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required.");
  }

  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  const result = await onboardPilotWorkspaceUser({
    workspaceName: getRequiredArg(args, "workspace-name"),
    email: getRequiredArg(args, "email"),
    password: getRequiredArg(args, "password"),
    name: typeof args.name === "string" ? args.name : undefined,
  });

  console.log("Pilot onboarding completed.");
  console.log(`Workspace: ${result.workspace.name}`);
  console.log(`Workspace slug: ${result.workspace.slug}`);
  console.log(`User email: ${result.user.email}`);
  console.log(`Membership role: ${result.membership.role}`);
  console.log("This user can now sign in through the existing /login flow with the password you provided.");
}

function parseArgs(argv: string[]) {
  const args: Record<string, string | boolean | undefined> = {};

  for (let index = 0; index < argv.length; index += 1) {
    const currentArg = argv[index];

    if (!currentArg) {
      continue;
    }

    if (currentArg === "--help" || currentArg === "-h") {
      args.help = true;
      continue;
    }

    if (!currentArg.startsWith("--")) {
      throw new Error(`Unexpected argument: ${currentArg}`);
    }

    const key = currentArg.slice(2);
    const nextArg = argv[index + 1];

    if (!nextArg || nextArg.startsWith("--")) {
      throw new Error(`Missing value for --${key}`);
    }

    args[key] = nextArg;
    index += 1;
  }

  return args;
}

function getRequiredArg(args: Record<string, string | boolean | undefined>, key: string) {
  const value = args[key];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`--${key} is required. Run with --help for usage.`);
  }

  return value;
}

function printHelp() {
  console.log("Unitforge manual pilot onboarding");
  console.log("");
  console.log("Usage:");
  console.log('  pnpm onboard:pilot -- --workspace-name "Acme Studio" --email owner@example.com --password "strong-password" [--name "Owner Name"]');
  console.log("");
  console.log("Required:");
  console.log("  --workspace-name   Workspace name used for the new workspace");
  console.log("  --email            Login email for the new user");
  console.log("  --password         Initial password for the new user (minimum 12 characters)");
  console.log("");
  console.log("Optional:");
  console.log("  --name             Display name for the new user");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
