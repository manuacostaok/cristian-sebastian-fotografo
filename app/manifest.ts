import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Christian Sebastián — Fotógrafo",
    short_name: "Christian Sebastián",
    description: "Fotógrafo profesional en Buenos Aires. 15 años, cumpleaños, eventos y retratos.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f3ee",
    theme_color: "#14110f",
    icons: [
      { src: "/manifest-icons/192", sizes: "192x192", type: "image/png" },
      { src: "/manifest-icons/512", sizes: "512x512", type: "image/png" },
    ],
  };
}
