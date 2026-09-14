import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#14110f",
        }}
      >
        <span
          style={{
            fontSize: 21,
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
