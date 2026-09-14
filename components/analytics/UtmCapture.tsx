"use client";

import { useEffect } from "react";
import { captureUtmFromUrl } from "@/lib/analytics";

/** Silent — persists utm_* params from the landing URL for later form submits. */
export function UtmCapture() {
  useEffect(() => {
    captureUtmFromUrl();
  }, []);

  return null;
}
