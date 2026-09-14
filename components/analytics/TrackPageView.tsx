"use client";

import { useEffect } from "react";
import { track, type TrackEventType } from "@/lib/track";

export function TrackPageView({ type, meta }: { type: TrackEventType; meta?: Record<string, unknown> }) {
  useEffect(() => {
    track(type, meta);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  return null;
}
