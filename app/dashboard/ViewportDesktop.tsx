"use client";

import { useEffect } from "react";

export default function ViewportDesktop() {
  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    if (!isMobile) return;

    let viewport = document.querySelector(
      'meta[name="viewport"]'
    ) as HTMLMetaElement | null;

    if (!viewport) {
      viewport = document.createElement("meta");
      viewport.name = "viewport";
      document.head.appendChild(viewport);
    }

    const previousContent = viewport.content;

    viewport.content =
      "width=980, initial-scale=0.4, maximum-scale=1";

    return () => {
      viewport!.content =
        previousContent || "width=device-width, initial-scale=1";
    };
  }, []);

  return null;
}