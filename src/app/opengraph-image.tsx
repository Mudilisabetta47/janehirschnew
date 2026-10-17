import { ImageResponse } from "next/og";

export const alt = "Jane Hirsch – Brautstyling-Coaching & Make-up Artist";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg,#241b17 0%,#3a2b24 60%,#8a5a48 140%)",
          color: "#fbf7f2",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 8, textTransform: "uppercase", color: "#c9a190" }}>
          Brautstyling-Coaching
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 150, lineHeight: 0.95, fontWeight: 300 }}>Jane Hirsch</div>
          <div style={{ marginTop: 28, fontSize: 36, color: "#e9d6c8" }}>Make-up Artist · Hairstylistin · Coach – Weyhe bei Bremen</div>
        </div>
      </div>
    ),
    size,
  );
}
