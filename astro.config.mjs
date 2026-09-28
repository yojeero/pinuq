// @ts-check

import { readFileSync } from "node:fs";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

const blogDir = new URL("./src/content/blog/", import.meta.url);

function getBlogLastmod(url) {
  const match = url.match(/\/blog\/([^/]+)\/?\$/);
  const slug = match?.[1];
  if (!slug) return undefined;
  try {
    const content = readFileSync(new URL(`${slug}.md`, blogDir), "utf-8");
    const updated = content.match(/^updatedDate:\s*['"]?([\d-]{10})/m)?.[1];
    const published = content.match(/^publishDate:\s*['"]?([\d-]{10})/m)?.[1];
    const date = updated ?? published;
    return date ? new Date(date) : undefined;
  } catch {
    return undefined;
  }
}

export default defineConfig({
  site: "https://inux.pages.dev",
  markdown: {
    shikiConfig: {
      theme: "css-variables",
    },
  },
  integrations: [
    mdx(),
    sitemap({
      serialize(item) {
        const lastmod = getBlogLastmod(item.url);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Space Grotesk",
      cssVariable: "--font-space-grotesk",
      fallbacks: ["sans-serif"],
      options: {
        variants: [
          {
            weight: "300 700",
            style: "normal",
            src: ["./src/assets/fonts/SpaceGrotesk-Variable.woff2"],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains-mono",
      fallbacks: ["monospace"],
      options: {
        variants: [
          {
            weight: "400 700",
            style: "normal",
            src: ["./src/assets/fonts/JetBrainsMono-VariableFont_wght.woff2"],
          },
        ],
      },
    },
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: [
        {
          // Workaround for astro 7.3.5: `astro/components/Font.astro` imports
          // "virtual:astro:assets/fonts", but the fonts Vite plugin only
          // registers "virtual:astro:assets/fonts/internal". Without this
          // mapping, every import from `astro:assets` (e.g. `<Image />`)
          // fails to resolve and the page renders a 500.
          find: /^virtual:astro:assets\/fonts$/,
          replacement: "virtual:astro:assets/fonts/internal",
        },
      ],
    },
  },
});
