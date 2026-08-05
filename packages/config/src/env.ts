import { z } from "zod";

const emptyStringToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim().length === 0 ? undefined : value;

const optionalNonEmptyString = z.preprocess(
  emptyStringToUndefined,
  z.string().min(1).optional(),
);

const optionalEmail = z.preprocess(
  emptyStringToUndefined,
  z.string().email().optional(),
);

export const appEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("Unitforge"),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_SALES_EMAIL: optionalEmail,
  DATABASE_URL: z.string().url(),
  TRUST_PROXY_HEADERS: z.enum(["true", "false"]).default("false"),
  STRIPE_SECRET_KEY: optionalNonEmptyString,
  STRIPE_WEBHOOK_SECRET: optionalNonEmptyString,
  STRIPE_PRICE_STUDIO_MONTHLY_ID: optionalNonEmptyString,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: optionalNonEmptyString,
  ANALYTICS_WRITE_KEY: optionalNonEmptyString,
});

export type AppEnv = z.infer<typeof appEnvSchema>;

export function parseAppEnv(env: Record<string, string | undefined>) {
  return appEnvSchema.parse(env);
}
