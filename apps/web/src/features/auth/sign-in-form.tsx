"use client";

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, cn, Input, Label } from "@unitforge/ui";
import Link from "next/link";
import { useActionState } from "react";

import { signInAction } from "@/server/auth/actions";
import { initialSignInActionState } from "@/server/auth/sign-in-state";

interface SignInFormProps {
  next?: string;
}

export function SignInForm({ next }: SignInFormProps) {
  const [state, formAction, isPending] = useActionState(signInAction, initialSignInActionState);

  function getFieldError(field: "email" | "password") {
    return state.fieldErrors?.[field];
  }

  return (
    <Card className="border-border/70 bg-card/95 shadow-sm">
      <CardHeader className="space-y-3">
        <div>
          <CardTitle>Sign in</CardTitle>
          <CardDescription className="mt-2">
            Use the workspace operator account to access the protected Price Sheets app.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input name="next" type="hidden" value={next ?? ""} />

          {state.status === "error" && state.message ? (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {state.message}
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="sign-in-email">Email</Label>
            <Input
              aria-invalid={Boolean(getFieldError("email"))}
              className={cn(getFieldError("email") ? "border-destructive focus-visible:ring-destructive" : undefined)}
              id="sign-in-email"
              name="email"
              type="email"
            />
            {getFieldError("email") ? <p className="text-sm text-destructive">{getFieldError("email")}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sign-in-password">Password</Label>
            <Input
              aria-invalid={Boolean(getFieldError("password"))}
              className={cn(getFieldError("password") ? "border-destructive focus-visible:ring-destructive" : undefined)}
              id="sign-in-password"
              name="password"
              type="password"
            />
            {getFieldError("password") ? <p className="text-sm text-destructive">{getFieldError("password")}</p> : null}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button className="w-full sm:w-auto" disabled={isPending} type="submit">
              {isPending ? "Signing in..." : "Sign in"}
            </Button>
            <Link className="text-sm text-muted-foreground hover:text-foreground" href="/">
              Return to public site
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
