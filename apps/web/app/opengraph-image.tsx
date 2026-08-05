import { ImageResponse } from "next/og";

export const alt = "Unitforge — public price pages and inquiry management";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "stretch",
        background: "#1b111c",
        color: "#f5eadb",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        padding: "62px 72px",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          background:
            "radial-gradient(circle, rgba(221, 163, 90, 0.27), rgba(27, 17, 28, 0) 68%)",
          borderRadius: "999px",
          display: "flex",
          height: 620,
          position: "absolute",
          right: -160,
          top: -220,
          width: 620,
        }}
      />

      <div
        style={{ alignItems: "center", display: "flex", fontSize: 34, gap: 18 }}
      >
        <div
          style={{
            alignItems: "center",
            background: "linear-gradient(145deg, #f1dfc3, #c47b42)",
            borderRadius: 18,
            color: "#211421",
            display: "flex",
            fontSize: 28,
            fontWeight: 700,
            height: 56,
            justifyContent: "center",
            width: 56,
          }}
        >
          U
        </div>
        <span>Unitforge</span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          maxWidth: 960,
        }}
      >
        <div
          style={{
            color: "#d5aa70",
            display: "flex",
            fontSize: 22,
            letterSpacing: 5,
            textTransform: "uppercase",
          }}
        >
          From price list to inquiry
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 600,
            letterSpacing: -4,
            lineHeight: 1.04,
          }}
        >
          Publish services. Receive requests.
        </div>
        <div
          style={{
            color: "#c9bac7",
            display: "flex",
            fontSize: 30,
            lineHeight: 1.4,
          }}
        >
          One clear public page for service businesses.
        </div>
      </div>
    </div>,
    size,
  );
}
