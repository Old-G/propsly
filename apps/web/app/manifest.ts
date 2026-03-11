import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Propsly — Proposal Platform",
    short_name: "Propsly",
    description:
      "Create beautiful interactive proposals as web pages. Interactive pricing, view tracking, e-signatures.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#34d399",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
