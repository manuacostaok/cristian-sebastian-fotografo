import { ImageResponse } from "next/og";
import { CameraMark } from "@/lib/icons/camera-mark";

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
        <CameraMark size={20} strokeWidth={2} />
      </div>
    ),
    { ...size },
  );
}
