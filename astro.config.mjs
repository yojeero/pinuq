// astro.config.mjs
// @ts-check

import { readFileSync } from "node:fs";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import icon from "astro-icon";

const blogDir = new URL("./src/content/blog/", import.meta.url);

function getBlogLastmod(url) {
  const { pathname } = new URL(url);
  const match = pathname.match(/^\/blog\/([^/]+)\/?$/);
  const slug = match?.[1];
  if (!slug) return undefined;

  let content = "";
  try {
    const folderUrl = new URL(`${slug}/index.mdx`, blogDir);
    content = readFileSync(folderUrl, "utf-8");
  } catch {
    try {
      const fileUrl = new URL(`${slug}.mdx`, blogDir);
      content = readFileSync(fileUrl, "utf-8");
    } catch {
      return undefined;
    }
  }

  const updated = content.match(/^updatedDate:\s*['"]?([\d-]{10})/m)?.[1];
  const published = content.match(/^publishDate:\s*['"]?([\d-]{10})/m)?.[1];
  const date = updated ?? published;

  return date ? new Date(date) : undefined;
}

export default defineConfig({
  site: "https://pinuq.vercel.app",
  output: "static",

  image: {
    formats: ["webp"],
  },

  markdown: {
    shikiConfig: {
      theme: "css-variables",
    },
  },

  fonts: [
    {
      provider: fontProviders.local(),
      name: "DM Sans",
      cssVariable: "--font-dmsans",
      fallbacks: ["sans-serif"],
      options: {
        variants: [
          {
            weight: "300",
            style: "normal",
            src: ["./src/assets/fonts/DM-Sans-variable.woff2"],
          },
          {
            weight: "400",
            style: "normal",
            src: ["./src/assets/fonts/DM-Sans-variable.woff2"],
          },
        ],
      },
    },

    {
      provider: fontProviders.local(),
      name: "Source Serif 4",
      cssVariable: "--font-sourceserif4",
      fallbacks: ["sans-serif"],
      options: {
        variants: [
          {
            weight: "700",
            style: "normal",
            src: ["./src/assets/fonts/Source-Serif-4-variable.woff2"],
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
            src: ["./src/assets/fonts/JetBrainsMono-Variable.woff2"],
          },
        ],
      },
    },
  ],

  integrations: [
    mdx(),
    sitemap({
      serialize(item) {
        const lastmod = getBlogLastmod(item.url);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
    icon({
      iconDir: "src/assets/icons",
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: [
        {
          find: /^virtual:astro:assets\/fonts\$/,
          replacement: "virtual:astro:assets/fonts/internal",
        },
      ],
    },
  },
});
