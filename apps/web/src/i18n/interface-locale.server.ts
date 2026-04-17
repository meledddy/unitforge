import { cookies } from "next/headers";

import { interfaceLocaleCookieName, resolveInterfaceLocale } from "@/i18n/interface-locale";

export async function getCurrentInterfaceLocale() {
  const cookieStore = await cookies();

  return resolveInterfaceLocale(cookieStore.get(interfaceLocaleCookieName)?.value);
}
