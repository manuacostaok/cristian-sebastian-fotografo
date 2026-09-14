import { ImageResponse } from "next/og";
import { CameraMark } from "@/lib/icons/camera-mark";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          background: "linear-gradient(155deg, #1b1712 0%, #14110f 60%, #2c2013 100%)",
        }}
      >
        <CameraMark size={220} strokeWidth={1.5} />
        <span
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: "#c9a15a",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontStyle: "italic",
            letterSpacing: 2,
            lineHeight: 1,
          }}
        >
          CS
        </span>
      </div>
    ),
    { width: 512, height: 512 },
  );
}
