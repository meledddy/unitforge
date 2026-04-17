import { Badge, Card, CardDescription, CardHeader, CardTitle } from "@unitforge/ui";

import { getCurrentInterfaceLocale } from "@/i18n/interface-locale.server";
import { getMessages } from "@/i18n/messages";

export default async function ImportMarginPage() {
  const locale = await getCurrentInterfaceLocale();
  const messages = getMessages(locale);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Badge variant="secondary">{messages.importMargin.badge}</Badge>
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{messages.importMargin.title}</h2>
          <p className="max-w-2xl text-muted-foreground">{messages.importMargin.description}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{messages.importMargin.nextStepTitle}</CardTitle>
          <CardDescription>{messages.importMargin.nextStepDescription}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
