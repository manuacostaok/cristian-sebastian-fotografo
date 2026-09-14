/**
 * Shared camera glyph for the favicon/app-icon family (generated via
 * next/og ImageResponse, which renders plain SVG through satori — no
 * external image asset needed). Kept as one function so the icon reads the
 * same everywhere: favicon, apple-touch-icon, PWA icons.
 */
export function CameraMark({ color = "#c9a15a", size = 24, strokeWidth = 1.7 }: {
  color?: string;
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M8.5 7 L9.7 4.8 A1 1 0 0 1 10.6 4.3 H13.4 A1 1 0 0 1 14.3 4.8 L15.5 7"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <rect x="2" y="7" width="20" height="13.5" rx="2.4" stroke={color} strokeWidth={strokeWidth} />
      <circle cx="12" cy="14" r="4" stroke={color} strokeWidth={strokeWidth} />
      <circle cx="12" cy="14" r="1.3" fill={color} />
    </svg>
  );
}
