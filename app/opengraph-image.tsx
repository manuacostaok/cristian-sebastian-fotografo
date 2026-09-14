import { ImageResponse } from "next/og";

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
          justifyContent: "flex-end",
          padding: "72px",
          background: "linear-gradient(140deg, #1b1712 0%, #14110f 55%, #2c2013 100%)",
        }}
      >
        <span
          style={{
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#e4be7c",
            marginBottom: 20,
          }}
        >
          Fotógrafo — Buenos Aires
        </span>
        <span
          style={{
            fontSize: 92,
            fontFamily: "Georgia, 'Times New Roman', serif",
            color: "#f7f3ee",
            lineHeight: 1.05,
          }}
        >
          Christian Sebastián
        </span>
        <span
          style={{
            marginTop: 24,
            fontSize: 30,
            fontStyle: "italic",
            fontFamily: "Georgia, 'Times New Roman', serif",
            color: "rgba(247,243,238,0.85)",
          }}
        >
          Historias que merecen ser recordadas.
        </span>
      </div>
    ),
    { ...size },
  );
}
