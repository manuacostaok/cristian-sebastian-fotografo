import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(155deg, #1b1712 0%, #14110f 60%, #2c2013 100%)",
        }}
      >
        <span
          style={{
            fontSize: 104,
            fontWeight: 700,
            color: "#c9a15a",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontStyle: "italic",
            lineHeight: 1,
          }}
        >
          C
        </span>
      </div>
    ),
    { ...size },
  );
}
