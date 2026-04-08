import { appConfig } from "@unitforge/config";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="container flex flex-col gap-2 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>{appConfig.description}</p>
        <p>&copy; {new Date().getFullYear()} {appConfig.name}</p>
      </div>
    </footer>
  );
}

