import { ImageResponse } from "next/og";
import { CameraMark } from "@/lib/icons/camera-mark";

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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          background: "linear-gradient(155deg, #1b1712 0%, #14110f 60%, #2c2013 100%)",
        }}
      >
        <CameraMark size={76} strokeWidth={1.6} />
        <span
          style={{
            fontSize: 34,
            fontWeight: 700,
            color: "#c9a15a",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontStyle: "italic",
            letterSpacing: 1,
            lineHeight: 1,
          }}
        >
          CS
        </span>
      </div>
    ),
    { ...size },
  );
}
