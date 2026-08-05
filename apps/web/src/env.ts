import { parseAppEnv } from "@unitforge/config";

import { loadAppRuntimeEnv } from "@/server/runtime-env";

loadAppRuntimeEnv();

export const env = parseAppEnv({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SALES_EMAIL: process.env.NEXT_PUBLIC_SALES_EMAIL,
  DATABASE_URL: process.env.DATABASE_URL,
  TRUST_PROXY_HEADERS: process.env.TRUST_PROXY_HEADERS,
  ANALYTICS_WRITE_KEY: process.env.ANALYTICS_WRITE_KEY,
});
