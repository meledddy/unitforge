"use client";

import { Button } from "@unitforge/ui";
import { useEffect, useId, useRef, useState } from "react";

interface DeletePriceSheetConfirmationProps {
  action: (formData: FormData) => Promise<void> | void;
  cancelLabel: string;
  confirmButtonLabel: string;
  consequence: string;
  description: string;
  sheetLabel: string;
  sheetTitle: string;
  title: string;
  triggerLabel: string;
}

export function DeletePriceSheetConfirmation({
  action,
  cancelLabel,
  confirmButtonLabel,
  consequence,
  description,
  sheetLabel,
  sheetTitle,
  title,
  triggerLabel,
}: DeletePriceSheetConfirmationProps) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    cancelButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <Button
        className="w-full gap-2 border border-red-500/30 bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-500 dark:border-red-400/35 dark:bg-red-500 dark:text-white dark:hover:bg-red-600"
        type="button"
        variant="destructive"
        onClick={() => setOpen(true)}
      >
        {triggerLabel}
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            aria-label={cancelLabel}
            className="absolute inset-0 cursor-default bg-background/72 backdrop-blur-md"
            type="button"
            onClick={() => setOpen(false)}
          />
          <div
            aria-describedby={descriptionId}
            aria-labelledby={titleId}
            aria-modal="true"
            className="relative z-10 w-full max-w-md rounded-3xl border border-destructive/20 bg-card p-6 text-card-foreground shadow-2xl"
            role="alertdialog"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight" id={titleId}>
                  {title}
                </h2>
                <p className="text-sm leading-6 text-muted-foreground" id={descriptionId}>
                  {description}
                </p>
              </div>

              <div className="rounded-2xl border border-destructive/15 bg-destructive/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {sheetLabel}
                </p>
                <p className="mt-1 break-words text-sm font-medium text-foreground">{sheetTitle}</p>
              </div>

              <p className="rounded-2xl border border-border/70 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                {consequence}
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button ref={cancelButtonRef} type="button" variant="outline" onClick={() => setOpen(false)}>
                  {cancelLabel}
                </Button>
                <form action={action}>
                  <Button className="w-full bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500" type="submit" variant="destructive">
                    {confirmButtonLabel}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
