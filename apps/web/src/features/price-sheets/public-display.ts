export function getPublicPriceSheetDisplayTitle({
  isDemo,
  title,
}: {
  isDemo: boolean;
  title: string;
}) {
  return isDemo ? title.replace(/\s+—\s+.*$/, "") : title;
}
