import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.08),transparent_42%)]">
      <main className="container flex min-h-screen items-center justify-center py-16">{children}</main>
    </div>
  );
}
