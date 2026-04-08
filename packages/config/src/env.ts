import { z } from "zod";

export const appEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("Unitforge"),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
  STRIPE_PRICE_STUDIO_MONTHLY_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  ANALYTICS_WRITE_KEY: z.string().min(1).optional(),
});

export type AppEnv = z.infer<typeof appEnvSchema>;

export function parseAppEnv(env: Record<string, string | undefined>) {
  return appEnvSchema.parse(env);
}
