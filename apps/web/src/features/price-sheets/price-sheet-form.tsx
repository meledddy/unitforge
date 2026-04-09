"use client";

import {
  Button,
  buttonVariants,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  Input,
  Label,
  Select,
  Textarea,
} from "@unitforge/ui";
import Link from "next/link";
import { useActionState, useState } from "react";

import type { PriceSheetFormActionState } from "@/server/price-sheets/actions";

import {
  getEmptyPriceSheetFormValues,
  getEmptyPriceSheetItemValues,
  type PriceSheetFormValues,
  slugifyPriceSheetValue,
} from "./validation";

interface PriceSheetFormProps {
  mode: "create" | "edit";
  action: (
    previousState: PriceSheetFormActionState,
    formData: FormData,
  ) => Promise<PriceSheetFormActionState>;
  initialValues?: PriceSheetFormValues;
  cancelHref: string;
}

const initialFormState: PriceSheetFormActionState = {
  status: "idle",
};

export function PriceSheetForm({ mode, action, initialValues = getEmptyPriceSheetFormValues(), cancelHref }: PriceSheetFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialFormState);
  const [values, setValues] = useState(initialValues);
  const [hasEditedSlug, setHasEditedSlug] = useState(Boolean(initialValues.slug));
  const fieldErrorEntries = state.fieldErrors ? Object.entries(state.fieldErrors) : [];

  function updateTopLevelField(field: keyof Omit<PriceSheetFormValues, "items">, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  }

  function updateTitle(value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      title: value,
      slug: hasEditedSlug ? currentValues.slug : slugifyPriceSheetValue(value),
    }));
  }

  function updateSlug(value: string) {
    setHasEditedSlug(true);
    updateTopLevelField("slug", slugifyPriceSheetValue(value));
  }

  function updateItemField(index: number, field: keyof PriceSheetFormValues["items"][number], value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      items: currentValues.items.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }));
  }

  function addItem() {
    setValues((currentValues) => ({
      ...currentValues,
      items: [...currentValues.items, getEmptyPriceSheetItemValues()],
    }));
  }

  function removeItem(index: number) {
    setValues((currentValues) => ({
      ...currentValues,
      items:
        currentValues.items.length > 1
          ? currentValues.items.filter((_, itemIndex) => itemIndex !== index)
          : [getEmptyPriceSheetItemValues()],
    }));
  }

  function getFieldError(path: string) {
    return state.fieldErrors?.[path];
  }

  function getFieldErrorLabel(path: string) {
    const itemMatch = path.match(/^items\.(\d+)\.(name|price|section|description)$/);

    if (itemMatch) {
      const fieldLabels: Record<string, string> = {
        description: "description",
        name: "name",
        price: "price",
        section: "category / section",
      };
      const itemIndex = Number(itemMatch[1]) + 1;
      const fieldKey = itemMatch[2] as keyof typeof fieldLabels;

      return `Item ${itemIndex} ${fieldLabels[fieldKey] ?? "field"}`;
    }

    const topLevelLabels: Record<string, string> = {
      currency: "Currency",
      description: "Description",
      items: "Items",
      locale: "Locale",
      slug: "Slug",
      theme: "Theme",
      title: "Title",
    };

    return topLevelLabels[path] ?? "Form";
  }

  function getFieldClasses(path: string) {
    return getFieldError(path) ? "border-destructive focus-visible:ring-destructive" : undefined;
  }

  return (
    <form action={formAction} className="space-y-6">
      <input name="payload" type="hidden" value={JSON.stringify(values)} />

      {state.status === "error" && state.message ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {state.message}
        </div>
      ) : null}

      {fieldErrorEntries.length > 0 ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="text-sm font-medium text-destructive">Validation errors</p>
          <ul className="mt-2 space-y-1 text-sm text-destructive">
            {fieldErrorEntries.map(([path, message]) => (
              <li key={path}>
                {getFieldErrorLabel(path)}: {message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>{mode === "create" ? "Price Sheet details" : "Edit Price Sheet"}</CardTitle>
          <CardDescription>One sheet, one locale, one presentation theme, and a focused set of items.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input
              aria-invalid={Boolean(getFieldError("title"))}
              className={getFieldClasses("title")}
              id="title"
              value={values.title}
              onChange={(event) => updateTitle(event.target.value)}
            />
            {getFieldError("title") ? <p className="text-sm text-destructive">{getFieldError("title")}</p> : null}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              aria-invalid={Boolean(getFieldError("description"))}
              className={getFieldClasses("description")}
              id="description"
              value={values.description}
              onChange={(event) => updateTopLevelField("description", event.target.value)}
            />
            {getFieldError("description") ? <p className="text-sm text-destructive">{getFieldError("description")}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              aria-invalid={Boolean(getFieldError("slug"))}
              className={getFieldClasses("slug")}
              id="slug"
              value={values.slug}
              onChange={(event) => updateSlug(event.target.value)}
            />
            {getFieldError("slug") ? <p className="text-sm text-destructive">{getFieldError("slug")}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              aria-invalid={Boolean(getFieldError("status"))}
              className={getFieldClasses("status")}
              id="status"
              value={values.status}
              onChange={(event) => updateTopLevelField("status", event.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme">Presentation theme</Label>
            <Select
              aria-invalid={Boolean(getFieldError("theme"))}
              className={getFieldClasses("theme")}
              id="theme"
              value={values.theme}
              onChange={(event) => updateTopLevelField("theme", event.target.value)}
            >
              <option value="amber">Amber</option>
              <option value="slate">Slate</option>
              <option value="stone">Stone</option>
            </Select>
            {getFieldError("theme") ? <p className="text-sm text-destructive">{getFieldError("theme")}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input
              aria-invalid={Boolean(getFieldError("currency"))}
              className={getFieldClasses("currency")}
              id="currency"
              maxLength={3}
              value={values.currency}
              onChange={(event) => updateTopLevelField("currency", event.target.value.toUpperCase())}
            />
            {getFieldError("currency") ? <p className="text-sm text-destructive">{getFieldError("currency")}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="locale">Locale</Label>
            <Input
              aria-invalid={Boolean(getFieldError("locale"))}
              className={getFieldClasses("locale")}
              id="locale"
              value={values.locale}
              onChange={(event) => updateTopLevelField("locale", event.target.value)}
            />
            {getFieldError("locale") ? <p className="text-sm text-destructive">{getFieldError("locale")}</p> : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Items</CardTitle>
              <CardDescription>Each item is public-facing and priced in the sheet currency.</CardDescription>
            </div>
            <Button onClick={addItem} type="button" variant="outline">
              Add item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {values.items.map((item, index) => (
            <div key={item.id ?? `item-${index}`} className="rounded-3xl border border-border/70 bg-background/70 p-5">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">Item {index + 1}</p>
                  <p className="text-sm text-muted-foreground">Name, optional category / section, description, and price.</p>
                </div>
                <Button onClick={() => removeItem(index)} type="button" variant="ghost">
                  Remove
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-[1fr,180px]">
                <div className="space-y-2">
                  <Label htmlFor={`item-name-${index}`}>Name</Label>
                  <Input
                    aria-invalid={Boolean(getFieldError(`items.${index}.name`))}
                    className={getFieldClasses(`items.${index}.name`)}
                    id={`item-name-${index}`}
                    value={item.name}
                    onChange={(event) => updateItemField(index, "name", event.target.value)}
                  />
                  {getFieldError(`items.${index}.name`) ? (
                    <p className="text-sm text-destructive">{getFieldError(`items.${index}.name`)}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`item-price-${index}`}>Price</Label>
                  <Input
                    aria-invalid={Boolean(getFieldError(`items.${index}.price`))}
                    className={getFieldClasses(`items.${index}.price`)}
                    id={`item-price-${index}`}
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    type="number"
                    value={item.price}
                    onChange={(event) => updateItemField(index, "price", event.target.value)}
                  />
                  {getFieldError(`items.${index}.price`) ? (
                    <p className="text-sm text-destructive">{getFieldError(`items.${index}.price`)}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`item-section-${index}`}>Category / section</Label>
                  <Input
                    aria-invalid={Boolean(getFieldError(`items.${index}.section`))}
                    className={getFieldClasses(`items.${index}.section`)}
                    id={`item-section-${index}`}
                    value={item.section}
                    onChange={(event) => updateItemField(index, "section", event.target.value)}
                  />
                  {getFieldError(`items.${index}.section`) ? (
                    <p className="text-sm text-destructive">{getFieldError(`items.${index}.section`)}</p>
                  ) : null}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`item-description-${index}`}>Description</Label>
                  <Textarea
                    aria-invalid={Boolean(getFieldError(`items.${index}.description`))}
                    className={getFieldClasses(`items.${index}.description`)}
                    id={`item-description-${index}`}
                    value={item.description}
                    onChange={(event) => updateItemField(index, "description", event.target.value)}
                  />
                  {getFieldError(`items.${index}.description`) ? (
                    <p className="text-sm text-destructive">{getFieldError(`items.${index}.description`)}</p>
                  ) : null}
                </div>
              </div>
            </div>
          ))}

          {getFieldError("items") ? <p className="text-sm text-destructive">{getFieldError("items")}</p> : null}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button disabled={isPending} type="submit">
          {isPending ? "Saving..." : mode === "create" ? "Create Price Sheet" : "Save changes"}
        </Button>
        <Link className={cn(buttonVariants({ size: "default", variant: "outline" }))} href={cancelHref}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
