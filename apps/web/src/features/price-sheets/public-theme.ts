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
}

const publicPriceSheetThemes: PublicPriceSheetTheme[] = [
  {
    id: "amber",
    pageClassName: "bg-[linear-gradient(180deg,rgba(255,251,235,0.9),rgba(255,255,255,0)_26%)]",
    glowClassName: "bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.28),transparent_62%)]",
    eyebrowBadgeClassName: "border-amber-200/80 bg-amber-100/90 text-amber-950 shadow-[0_12px_32px_-22px_rgba(217,119,6,0.7)]",
    languageShellClassName: "border-amber-200/80 bg-white/88 shadow-[0_24px_56px_-40px_rgba(217,119,6,0.45)]",
    languageLabelClassName: "text-amber-900/70",
    languageActiveClassName: "bg-amber-400 text-amber-950 shadow-sm hover:bg-amber-300",
    languageInactiveClassName: "text-amber-950/70 hover:bg-amber-100 hover:text-amber-950",
    heroSurfaceClassName:
      "border-amber-200/80 bg-[linear-gradient(135deg,rgba(255,251,235,0.98),rgba(255,255,255,0.93))] shadow-[0_32px_90px_-48px_rgba(180,83,9,0.45)]",
    heroMarkClassName: "border border-amber-200/80 bg-amber-200/90 text-amber-950 shadow-[0_18px_40px_-24px_rgba(217,119,6,0.7)]",
    heroEyebrowClassName: "text-amber-900/65",
    heroTitleClassName: "text-stone-950",
    heroBodyClassName: "text-stone-700",
    metricChipClassName: "border-amber-200/70 bg-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]",
    metricChipLabelClassName: "text-amber-900/60",
    metricChipValueClassName: "text-stone-900",
    summaryCardClassName:
      "border-amber-200/80 bg-[linear-gradient(180deg,rgba(255,251,235,0.96),rgba(255,255,255,0.94))] shadow-[0_22px_56px_-36px_rgba(180,83,9,0.35)]",
    summaryBadgeClassName: "border-amber-200/80 bg-white/82 text-amber-950",
    summaryTitleClassName: "text-stone-950",
    summaryDescriptionClassName: "text-stone-700",
    detailRowClassName: "border-amber-200/70 bg-white/74",
    detailRowLabelClassName: "text-amber-900/60",
    detailRowValueClassName: "text-stone-900",
    sectionCardClassName: "border-amber-200/80 bg-white/94 shadow-[0_24px_70px_-48px_rgba(180,83,9,0.22)]",
    sectionHeaderClassName: "border-amber-200/70",
    sectionBadgeClassName: "border-amber-200/80 bg-amber-50 text-amber-950",
    itemSurfaceClassName: "border-amber-200/70 bg-[linear-gradient(180deg,rgba(255,251,235,0.82),rgba(255,255,255,0.74))]",
    itemTitleClassName: "text-stone-950",
    itemDescriptionClassName: "text-stone-600",
    priceClassName: "text-amber-950",
    railCardClassName:
      "border-amber-200/80 bg-[linear-gradient(180deg,rgba(255,251,235,0.95),rgba(255,255,255,0.93))] shadow-[0_22px_56px_-36px_rgba(180,83,9,0.3)]",
    railBadgeClassName: "border-amber-200/80 bg-amber-50 text-amber-950",
    contactRowClassName: "border-amber-200/70 bg-white/74",
    contactLabelClassName: "text-amber-900/60",
    contactValueClassName: "text-stone-900",
    primaryButtonClassName: "border border-amber-400 bg-amber-400 text-amber-950 hover:bg-amber-300 shadow-[0_18px_36px_-22px_rgba(217,119,6,0.72)]",
    secondaryButtonClassName: "border-amber-300 bg-white/80 text-amber-950 hover:bg-amber-50",
    leadCardClassName:
      "border-amber-200/80 bg-[linear-gradient(180deg,rgba(255,251,235,0.95),rgba(255,255,255,0.94))] shadow-[0_22px_56px_-36px_rgba(180,83,9,0.28)]",
    leadEyebrowClassName: "text-amber-900/65",
    leadTitleClassName: "text-stone-950",
    leadDescriptionClassName: "text-stone-700",
    leadLabelClassName: "text-stone-800",
    leadInputClassName: "border-amber-200/80 bg-white/84 focus-visible:ring-amber-400",
    leadTextareaClassName: "border-amber-200/80 bg-white/84 focus-visible:ring-amber-400",
    leadSubmitButtonClassName: "border border-amber-400 bg-amber-400 text-amber-950 hover:bg-amber-300 shadow-[0_18px_36px_-22px_rgba(217,119,6,0.72)]",
  },
  {
    id: "slate",
    pageClassName: "bg-[linear-gradient(180deg,rgba(241,245,249,0.9),rgba(255,255,255,0)_28%)]",
    glowClassName: "bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.28),transparent_62%)]",
    eyebrowBadgeClassName: "border-slate-300/85 bg-slate-200/95 text-slate-950 shadow-[0_12px_32px_-22px_rgba(15,23,42,0.5)]",
    languageShellClassName: "border-slate-300/85 bg-slate-50/92 shadow-[0_24px_56px_-40px_rgba(15,23,42,0.45)]",
    languageLabelClassName: "text-slate-600",
    languageActiveClassName: "bg-slate-900 text-slate-50 shadow-sm hover:bg-slate-800",
    languageInactiveClassName: "text-slate-700 hover:bg-slate-200 hover:text-slate-950",
    heroSurfaceClassName:
      "border-slate-300/85 bg-[linear-gradient(135deg,rgba(248,250,252,0.98),rgba(226,232,240,0.9))] shadow-[0_32px_90px_-48px_rgba(15,23,42,0.42)]",
    heroMarkClassName: "border border-slate-700 bg-slate-900 text-slate-50 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.8)]",
    heroEyebrowClassName: "text-slate-600",
    heroTitleClassName: "text-slate-950",
    heroBodyClassName: "text-slate-700",
    metricChipClassName: "border-slate-300/80 bg-slate-50/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]",
    metricChipLabelClassName: "text-slate-600",
    metricChipValueClassName: "text-slate-950",
    summaryCardClassName:
      "border-slate-300/85 bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(241,245,249,0.95))] shadow-[0_22px_56px_-36px_rgba(15,23,42,0.3)]",
    summaryBadgeClassName: "border-slate-300/85 bg-white/82 text-slate-950",
    summaryTitleClassName: "text-slate-950",
    summaryDescriptionClassName: "text-slate-700",
    detailRowClassName: "border-slate-200/90 bg-white/78",
    detailRowLabelClassName: "text-slate-600",
    detailRowValueClassName: "text-slate-950",
    sectionCardClassName: "border-slate-300/85 bg-slate-50/92 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.22)]",
    sectionHeaderClassName: "border-slate-200/90",
    sectionBadgeClassName: "border-slate-300/85 bg-white text-slate-950",
    itemSurfaceClassName: "border-slate-300/85 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(241,245,249,0.9))]",
    itemTitleClassName: "text-slate-950",
    itemDescriptionClassName: "text-slate-700",
    priceClassName: "text-slate-950",
    railCardClassName:
      "border-slate-300/85 bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(241,245,249,0.95))] shadow-[0_22px_56px_-36px_rgba(15,23,42,0.28)]",
    railBadgeClassName: "border-slate-300/85 bg-slate-100 text-slate-950",
    contactRowClassName: "border-slate-200/90 bg-white/78",
    contactLabelClassName: "text-slate-600",
    contactValueClassName: "text-slate-950",
    primaryButtonClassName: "border border-slate-900 bg-slate-900 text-slate-50 hover:bg-slate-800 shadow-[0_18px_36px_-22px_rgba(15,23,42,0.8)]",
    secondaryButtonClassName: "border-slate-300 bg-white text-slate-950 hover:bg-slate-100",
    leadCardClassName:
      "border-slate-300/85 bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(241,245,249,0.95))] shadow-[0_22px_56px_-36px_rgba(15,23,42,0.26)]",
    leadEyebrowClassName: "text-slate-600",
    leadTitleClassName: "text-slate-950",
    leadDescriptionClassName: "text-slate-700",
    leadLabelClassName: "text-slate-800",
    leadInputClassName: "border-slate-300/85 bg-white focus-visible:ring-slate-500",
    leadTextareaClassName: "border-slate-300/85 bg-white focus-visible:ring-slate-500",
    leadSubmitButtonClassName: "border border-slate-900 bg-slate-900 text-slate-50 hover:bg-slate-800 shadow-[0_18px_36px_-22px_rgba(15,23,42,0.8)]",
  },
  {
    id: "stone",
    pageClassName: "bg-[linear-gradient(180deg,rgba(250,250,249,0.92),rgba(255,255,255,0)_28%)]",
    glowClassName: "bg-[radial-gradient(circle_at_top,rgba(214,211,209,0.24),transparent_64%)]",
    eyebrowBadgeClassName: "border-stone-200/85 bg-stone-100/95 text-stone-800 shadow-[0_10px_28px_-24px_rgba(120,113,108,0.4)]",
    languageShellClassName: "border-stone-200/85 bg-white/90 shadow-[0_24px_56px_-42px_rgba(120,113,108,0.35)]",
    languageLabelClassName: "text-stone-500",
    languageActiveClassName: "bg-stone-700 text-stone-50 shadow-sm hover:bg-stone-600",
    languageInactiveClassName: "text-stone-600 hover:bg-stone-100 hover:text-stone-900",
    heroSurfaceClassName:
      "border-stone-200/85 bg-[linear-gradient(135deg,rgba(250,250,249,0.98),rgba(245,245,244,0.92))] shadow-[0_30px_80px_-50px_rgba(120,113,108,0.32)]",
    heroMarkClassName: "border border-stone-200/85 bg-stone-200/88 text-stone-900 shadow-[0_14px_34px_-24px_rgba(120,113,108,0.42)]",
    heroEyebrowClassName: "text-stone-500",
    heroTitleClassName: "text-stone-900",
    heroBodyClassName: "text-stone-600",
    metricChipClassName: "border-stone-200/80 bg-white/78 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]",
    metricChipLabelClassName: "text-stone-500",
    metricChipValueClassName: "text-stone-900",
    summaryCardClassName:
      "border-stone-200/85 bg-[linear-gradient(180deg,rgba(250,250,249,0.98),rgba(255,255,255,0.95))] shadow-[0_22px_52px_-38px_rgba(120,113,108,0.22)]",
    summaryBadgeClassName: "border-stone-200/85 bg-white/82 text-stone-800",
    summaryTitleClassName: "text-stone-900",
    summaryDescriptionClassName: "text-stone-600",
    detailRowClassName: "border-stone-200/85 bg-white/78",
    detailRowLabelClassName: "text-stone-500",
    detailRowValueClassName: "text-stone-900",
    sectionCardClassName: "border-stone-200/85 bg-white/94 shadow-[0_24px_70px_-50px_rgba(120,113,108,0.18)]",
    sectionHeaderClassName: "border-stone-200/85",
    sectionBadgeClassName: "border-stone-200/85 bg-stone-50 text-stone-800",
    itemSurfaceClassName: "border-stone-200/85 bg-[linear-gradient(180deg,rgba(250,250,249,0.84),rgba(255,255,255,0.78))]",
    itemTitleClassName: "text-stone-900",
    itemDescriptionClassName: "text-stone-600",
    priceClassName: "text-stone-900",
    railCardClassName:
      "border-stone-200/85 bg-[linear-gradient(180deg,rgba(250,250,249,0.98),rgba(255,255,255,0.95))] shadow-[0_22px_52px_-38px_rgba(120,113,108,0.2)]",
    railBadgeClassName: "border-stone-200/85 bg-stone-50 text-stone-800",
    contactRowClassName: "border-stone-200/85 bg-white/78",
    contactLabelClassName: "text-stone-500",
    contactValueClassName: "text-stone-900",
    primaryButtonClassName: "border border-stone-700 bg-stone-700 text-stone-50 hover:bg-stone-600 shadow-[0_18px_34px_-24px_rgba(120,113,108,0.55)]",
    secondaryButtonClassName: "border-stone-300 bg-white/82 text-stone-800 hover:bg-stone-100",
    leadCardClassName:
      "border-stone-200/85 bg-[linear-gradient(180deg,rgba(250,250,249,0.98),rgba(255,255,255,0.95))] shadow-[0_22px_52px_-38px_rgba(120,113,108,0.2)]",
    leadEyebrowClassName: "text-stone-500",
    leadTitleClassName: "text-stone-900",
    leadDescriptionClassName: "text-stone-600",
    leadLabelClassName: "text-stone-700",
    leadInputClassName: "border-stone-200/85 bg-white/84 focus-visible:ring-stone-400",
    leadTextareaClassName: "border-stone-200/85 bg-white/84 focus-visible:ring-stone-400",
    leadSubmitButtonClassName: "border border-stone-700 bg-stone-700 text-stone-50 hover:bg-stone-600 shadow-[0_18px_34px_-24px_rgba(120,113,108,0.55)]",
  },
];

export function getPublicPriceSheetTheme(themeId: PublishedPriceSheet["theme"]) {
  return publicPriceSheetThemes.find((theme) => theme.id === themeId) ?? publicPriceSheetThemes[0]!;
}
