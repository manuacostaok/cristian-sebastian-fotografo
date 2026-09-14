import { ImageResponse } from "next/og";

export function GET() {
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
            fontSize: 300,
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
    { width: 512, height: 512 },
  );
}
