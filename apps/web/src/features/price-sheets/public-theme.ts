import type { PublishedPriceSheet } from "@/server/price-sheets/service";

export interface PublicPriceSheetTheme {
  id: PublishedPriceSheet["theme"];
  pageClassName: string;
  glowClassName: string;
  eyebrowBadgeClassName: string;
  languageShellClassName: string;
  languageLabelClassName: string;
  languageActiveClassName: string;
  languageInactiveClassName: string;
  heroSurfaceClassName: string;
  heroMarkClassName: string;
  heroEyebrowClassName: string;
  heroTitleClassName: string;
  heroBodyClassName: string;
  metricChipClassName: string;
  metricChipLabelClassName: string;
  metricChipValueClassName: string;
  summaryCardClassName: string;
  summaryBadgeClassName: string;
  summaryTitleClassName: string;
  summaryDescriptionClassName: string;
  detailRowClassName: string;
  detailRowLabelClassName: string;
  detailRowValueClassName: string;
  sectionCardClassName: string;
  sectionHeaderClassName: string;
  sectionBadgeClassName: string;
  itemSurfaceClassName: string;
  itemTitleClassName: string;
  itemDescriptionClassName: string;
  priceClassName: string;
  railCardClassName: string;
  railBadgeClassName: string;
  contactRowClassName: string;
  contactLabelClassName: string;
  contactValueClassName: string;
  primaryButtonClassName: string;
  secondaryButtonClassName: string;
  leadCardClassName: string;
  leadEyebrowClassName: string;
  leadTitleClassName: string;
  leadDescriptionClassName: string;
  leadLabelClassName: string;
  leadInputClassName: string;
  leadTextareaClassName: string;
  leadSubmitButtonClassName: string;
  leadErrorSummaryClassName: string;
  leadErrorTextClassName: string;
  leadFieldErrorClassName: string;
}

const commonPublicPriceSheetTheme = {
  pageClassName: "price-sheet-public-page bg-[hsl(var(--ps-page))] text-[hsl(var(--ps-text))]",
  glowClassName: "price-sheet-public-glow",
  eyebrowBadgeClassName: "border-[hsl(var(--ps-border-strong)/0.72)] bg-[hsl(var(--ps-accent-soft)/0.72)] text-[hsl(var(--ps-accent-text))] shadow-[0_14px_32px_-24px_hsl(var(--ps-shadow)/0.42)]",
  languageShellClassName: "border-[hsl(var(--ps-border)/0.88)] bg-[hsl(var(--ps-surface)/0.78)] text-[hsl(var(--ps-text-soft))] shadow-[0_22px_52px_-40px_hsl(var(--ps-shadow)/0.36)] backdrop-blur-xl",
  languageLabelClassName: "text-[hsl(var(--ps-text-muted))]",
  languageActiveClassName: "bg-[hsl(var(--ps-control-active))] text-[hsl(var(--ps-control-active-text))] shadow-[0_12px_28px_-20px_hsl(var(--ps-shadow)/0.48)] hover:bg-[hsl(var(--ps-control-active-hover))]",
  languageInactiveClassName: "text-[hsl(var(--ps-text-soft))] hover:bg-[hsl(var(--ps-surface-muted)/0.86)] hover:text-[hsl(var(--ps-text))]",
  heroSurfaceClassName: "border-[hsl(var(--ps-border)/0.92)] bg-[linear-gradient(135deg,hsl(var(--ps-hero)/0.98),hsl(var(--ps-surface)/0.92))] shadow-[0_34px_90px_-54px_hsl(var(--ps-shadow)/0.46)]",
  heroMarkClassName: "border border-[hsl(var(--ps-border-strong)/0.72)] bg-[hsl(var(--ps-mark-bg))] text-[hsl(var(--ps-mark-text))] shadow-[0_20px_42px_-26px_hsl(var(--ps-shadow)/0.46)]",
  heroEyebrowClassName: "text-[hsl(var(--ps-accent-text)/0.78)]",
  heroTitleClassName: "text-[hsl(var(--ps-text))]",
  heroBodyClassName: "text-[hsl(var(--ps-text-soft))]",
  metricChipClassName: "border-[hsl(var(--ps-border)/0.78)] bg-[hsl(var(--ps-surface-muted)/0.76)] shadow-[inset_0_1px_0_hsl(var(--ps-highlight)/0.62)]",
  metricChipLabelClassName: "text-[hsl(var(--ps-text-muted))]",
  metricChipValueClassName: "text-[hsl(var(--ps-text))]",
  summaryCardClassName: "border-[hsl(var(--ps-border)/0.9)] bg-[linear-gradient(180deg,hsl(var(--ps-surface)/0.98),hsl(var(--ps-surface-muted)/0.92))] shadow-[0_24px_58px_-42px_hsl(var(--ps-shadow)/0.36)]",
  summaryBadgeClassName: "border-[hsl(var(--ps-border)/0.84)] bg-[hsl(var(--ps-surface-elevated)/0.78)] text-[hsl(var(--ps-text))]",
  summaryTitleClassName: "text-[hsl(var(--ps-text))]",
  summaryDescriptionClassName: "text-[hsl(var(--ps-text-soft))]",
  detailRowClassName: "border-[hsl(var(--ps-border)/0.7)] bg-[hsl(var(--ps-surface-elevated)/0.58)]",
  detailRowLabelClassName: "text-[hsl(var(--ps-text-muted))]",
  detailRowValueClassName: "text-[hsl(var(--ps-text))]",
  sectionCardClassName: "border-[hsl(var(--ps-border)/0.9)] bg-[hsl(var(--ps-surface)/0.84)] shadow-[0_26px_72px_-54px_hsl(var(--ps-shadow)/0.28)] backdrop-blur-sm",
  sectionHeaderClassName: "border-[hsl(var(--ps-border)/0.72)]",
  sectionBadgeClassName: "border-[hsl(var(--ps-border)/0.82)] bg-[hsl(var(--ps-surface-elevated)/0.78)] text-[hsl(var(--ps-text))]",
  itemSurfaceClassName: "border-[hsl(var(--ps-border)/0.76)] bg-[linear-gradient(180deg,hsl(var(--ps-surface-elevated)/0.9),hsl(var(--ps-surface-muted)/0.78))]",
  itemTitleClassName: "text-[hsl(var(--ps-text))]",
  itemDescriptionClassName: "text-[hsl(var(--ps-text-soft))]",
  priceClassName: "text-[hsl(var(--ps-price))]",
  railCardClassName: "border-[hsl(var(--ps-border)/0.86)] bg-[linear-gradient(180deg,hsl(var(--ps-surface)/0.98),hsl(var(--ps-surface-muted)/0.92))] shadow-[0_24px_58px_-42px_hsl(var(--ps-shadow)/0.34)]",
  railBadgeClassName: "border-[hsl(var(--ps-border)/0.84)] bg-[hsl(var(--ps-surface-elevated)/0.78)] text-[hsl(var(--ps-text))]",
  contactRowClassName: "border-[hsl(var(--ps-border)/0.72)] bg-[hsl(var(--ps-surface-elevated)/0.58)]",
  contactLabelClassName: "text-[hsl(var(--ps-text-muted))]",
  contactValueClassName: "text-[hsl(var(--ps-text))]",
  primaryButtonClassName: "border border-[hsl(var(--ps-control-active)/0.9)] bg-[hsl(var(--ps-control-active))] text-[hsl(var(--ps-control-active-text))] shadow-[0_18px_36px_-22px_hsl(var(--ps-shadow)/0.58)] hover:-translate-y-[1px] hover:bg-[hsl(var(--ps-control-active-hover))] active:translate-y-0",
  secondaryButtonClassName: "border-[hsl(var(--ps-border)/0.82)] bg-[hsl(var(--ps-surface-elevated)/0.78)] text-[hsl(var(--ps-text))] hover:bg-[hsl(var(--ps-surface-muted))]",
  leadCardClassName: "border-[hsl(var(--ps-border)/0.86)] bg-[linear-gradient(180deg,hsl(var(--ps-surface)/0.98),hsl(var(--ps-surface-muted)/0.92))] shadow-[0_24px_58px_-42px_hsl(var(--ps-shadow)/0.34)]",
  leadEyebrowClassName: "text-[hsl(var(--ps-text-muted))]",
  leadTitleClassName: "text-[hsl(var(--ps-text))]",
  leadDescriptionClassName: "text-[hsl(var(--ps-text-soft))]",
  leadLabelClassName: "text-[hsl(var(--ps-text-soft))]",
  leadInputClassName: "h-12 rounded-2xl border-[hsl(var(--ps-input-border)/0.9)] bg-[hsl(var(--ps-input-bg))] text-[hsl(var(--ps-text))] shadow-[inset_0_1px_0_hsl(var(--ps-highlight)/0.42)] placeholder:text-[hsl(var(--ps-text-muted))] focus-visible:ring-[hsl(var(--ps-ring)/0.42)]",
  leadTextareaClassName: "min-h-36 rounded-2xl border-[hsl(var(--ps-input-border)/0.9)] bg-[hsl(var(--ps-input-bg))] text-[hsl(var(--ps-text))] shadow-[inset_0_1px_0_hsl(var(--ps-highlight)/0.42)] placeholder:text-[hsl(var(--ps-text-muted))] focus-visible:ring-[hsl(var(--ps-ring)/0.42)]",
  leadSubmitButtonClassName: "border border-[hsl(var(--ps-control-active)/0.9)] bg-[hsl(var(--ps-control-active))] text-[hsl(var(--ps-control-active-text))] shadow-[0_18px_36px_-22px_hsl(var(--ps-shadow)/0.58)] hover:-translate-y-[1px] hover:bg-[hsl(var(--ps-control-active-hover))] active:translate-y-0",
  leadErrorSummaryClassName: "border-[hsl(var(--ps-danger)/0.42)] bg-[hsl(var(--ps-danger)/0.08)] text-[hsl(var(--ps-danger-text))]",
  leadErrorTextClassName: "text-[hsl(var(--ps-danger-text))]",
  leadFieldErrorClassName: "border-[hsl(var(--ps-danger)/0.72)] bg-[hsl(var(--ps-danger)/0.07)] focus-visible:ring-[hsl(var(--ps-danger)/0.38)]",
} satisfies Omit<PublicPriceSheetTheme, "id">;

const publicPriceSheetThemes: PublicPriceSheetTheme[] = [
  createPublicPriceSheetTheme("amber"),
  createPublicPriceSheetTheme("slate"),
  createPublicPriceSheetTheme("stone"),
];

export function getPublicPriceSheetTheme(themeId: PublishedPriceSheet["theme"]) {
  return publicPriceSheetThemes.find((theme) => theme.id === themeId) ?? publicPriceSheetThemes[0]!;
}

function createPublicPriceSheetTheme(id: PublishedPriceSheet["theme"]): PublicPriceSheetTheme {
  return {
    id,
    ...commonPublicPriceSheetTheme,
  };
}
