import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FantaMiccio",
    short_name: "FantaMiccio",
    start_url: "/",
    display: "standalone",
    background_color: "#5C3A21",
    theme_color: "#5C3A21",
    icons: [
      {
        src: "/contrade/icon-app.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}