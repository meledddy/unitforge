import { existsSync, readdirSync, readFileSync, realpathSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

import { loadEnvConfig } from "@next/env";

let hasLoadedRuntimeEnv = false;
const require = createRequire(import.meta.url);

const envFileNames = [
  ".env.development.local",
  ".env.local",
  ".env.development",
  ".env.production",
  ".env.production.local",
  ".env",
];

function hasEnvFiles(directory: string) {
  return envFileNames.some((fileName) => existsSync(path.join(directory, fileName)));
}

function isMonorepoRoot(directory: string) {
  return existsSync(path.join(directory, "pnpm-workspace.yaml")) && existsSync(path.join(directory, "apps", "web", "package.json"));
}

function findMonorepoRoot(startDirectory: string) {
  let currentDirectory = path.resolve(startDirectory);

  for (;;) {
    if (isMonorepoRoot(currentDirectory)) {
      return currentDirectory;
    }

    for (const entry of readdirSync(currentDirectory, { withFileTypes: true })) {
      if (!entry.isDirectory()) {
        continue;
      }

      const childDirectory = path.join(currentDirectory, entry.name);

      if (isMonorepoRoot(childDirectory)) {
        return childDirectory;
      }
    }

    const parentDirectory = path.dirname(currentDirectory);

    if (parentDirectory === currentDirectory) {
      return null;
    }

    currentDirectory = parentDirectory;
  }
}

function resolveMonorepoRootFromWorkspacePackage() {
  try {
    const dbEntryPath = realpathSync(require.resolve("@unitforge/db"));

    return path.resolve(path.dirname(dbEntryPath), "../../..");
  } catch {
    return null;
  }
}

function getRuntimeEnvDirectories() {
  const monorepoRoot = resolveMonorepoRootFromWorkspacePackage() ?? findMonorepoRoot(process.cwd());
  const appDirectory = monorepoRoot ? path.join(monorepoRoot, "apps", "web") : process.cwd();

  return Array.from(new Set([appDirectory, monorepoRoot, process.cwd()].filter(Boolean) as string[]));
}

function readEnvValueFromFile(filePath: string, key: string) {
  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const currentKey = trimmedLine.slice(0, separatorIndex).trim();

    if (currentKey !== key) {
      continue;
    }

    const rawValue = trimmedLine.slice(separatorIndex + 1).trim();

    if (
      (rawValue.startsWith('"') && rawValue.endsWith('"')) ||
      (rawValue.startsWith("'") && rawValue.endsWith("'"))
    ) {
      return rawValue.slice(1, -1);
    }

    return rawValue;
  }

  return undefined;
}

export function loadAppRuntimeEnv() {
  if (hasLoadedRuntimeEnv && process.env.DATABASE_URL) {
    return;
  }

  const directories = getRuntimeEnvDirectories();
  let loadedAnyDirectory = false;

  for (const directory of directories) {
    if (hasEnvFiles(directory)) {
      loadEnvConfig(directory, process.env.NODE_ENV !== "production");
      loadedAnyDirectory = true;
    }
  }

  hasLoadedRuntimeEnv = loadedAnyDirectory;
}

export function getRuntimeEnvValue(key: string) {
  loadAppRuntimeEnv();

  const existingValue = process.env[key];

  if (existingValue) {
    return existingValue;
  }

  for (const directory of getRuntimeEnvDirectories()) {
    for (const fileName of envFileNames) {
      const filePath = path.join(directory, fileName);

      if (!existsSync(filePath)) {
        continue;
      }

      const resolvedValue = readEnvValueFromFile(filePath, key);

      if (!resolvedValue) {
        continue;
      }

      process.env[key] = resolvedValue;

      return resolvedValue;
    }
  }

  return undefined;
}
