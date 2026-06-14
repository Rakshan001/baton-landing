import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Baton — coordinate AI coding agents on one repo";

// Dark card with the baton-pass visual and the headline.
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A0A0B",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 16,
              borderRadius: 99,
              background: "#FFA028",
              transform: "rotate(-24deg)",
              boxShadow: "0 0 40px #FFA028",
            }}
          />
          <div style={{ color: "#F4F4F2", fontSize: 34, fontWeight: 700 }}>baton</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              color: "#FFA028",
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Multi-agent coordination
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              color: "#F4F4F2",
              fontSize: 56,
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            <div style={{ display: "flex" }}>
              Plan on your&nbsp;<span style={{ color: "#FFA028" }}>expensive</span>&nbsp;agent.
            </div>
            <div style={{ display: "flex" }}>Pass the baton to your cheap one.</div>
          </div>
        </div>

        <div style={{ color: "#A2A2A8", fontSize: 26 }}>
          Coordinate Claude Code, Cursor, Codex &amp; Gemini on one repo. Open source.
        </div>
      </div>
    ),
    { ...size }
  );
}
