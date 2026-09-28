<img src="preview/inux.jpg" width="100%">

<img src="https://img.shields.io/badge/Inux-7678ed?style=for-the-badge" width="40%" alt="Yojee-Blog">   

> [!NOTE]
> Features 🧼   


- Blog   
- Clean UI   
- SEO-Friendly   
- Responsive Design   
- Cloud & Static Hosting Ready   

#### Tech Stack   
```
Astro | Bun | Vite | Biome | Tailwind CSS | Cloudflare | TypeScript   
```

Personal Blog built with [Astro](https://astro.build) — static output, TypeScript (strict preset).

## Content

Content: Markdown blog (`src/content/blog`) + MDX pages (`src/content/pages`), validated by Zod schemas in `src/content.config.ts`.

## Project Structure

```text
/
├── public/            # Static assets (favicons, manifest, og.png, robots.txt)
├── src/
│   ├── assets/        # Optimizable images imported from components (avatar.png)
│   ├── components/    # Astro components (Badge, Breadcrumbs, TOC, ThemeToggle, ...)
│   ├── content/       # Content collections (blog/*.md, pages/*.mdx)
│   ├── content.config.ts  # Collection schemas (Zod via astro/zod)
│   ├── data/          # site-config.ts (nav, social, hero)
│   ├── icons/         # Astro icon components
│   ├── layouts/       # BaseLayout.astro (head, JSON-LD, breadcrumbs, view transitions)
│   ├── lib/           # cn() helper
│   ├── pages/         # File-based routes (index, blog/, tags/, og/, rss.xml, 404)
│   ├── styles/
│   │   └── global.css # Tailwind v4 entry: theme tokens, @theme inline fonts, prose overrides
│   ├── types/         # Shared types
│   └── utils/         # data, schema (JSON-LD), breadcrumb, toc helpers
├── astro.config.mjs   # Astro configuration (site, fonts, mdx/sitemap integrations)
├── biome.json         # Biome lint/format configuration
├── tsconfig.json      # Extends astro/tsconfigs/strict, @/* path alias
├── wrangler.jsonc     # Cloudflare Workers static assets config (serves ./dist)
└── dist/              # Build output (generated)
```

## Commands

All commands are run from the root of the project:

| Command           | Action                                          |
| :---------------- | :---------------------------------------------- |
| `bun install`     | Installs dependencies                           |
| `bun run dev`     | Starts local dev server at `localhost:4321`     |
| `bun run build`   | Builds the production site to `./dist/`         |
| `bun run preview` | Previews the build locally                      |
| `bun run check`   | Lints + formats (Biome, applies safe fixes)     |
| `bun run ci`      | Non-mutating Biome check for CI                 |
| `bunx wrangler dev`    | Serves `./dist` on a local Workers runtime (build first) |
| `bunx wrangler deploy` | Deploys `./dist` to Cloudflare Workers (build first)    |

## Deployment

The site deploys to Cloudflare Workers as static assets, configured in `wrangler.jsonc`:

- `assets.directory` points at the Astro build output (`./dist`) — always run `bun run build` before `npx wrangler dev` or `npx wrangler deploy`.
- `assets.not_found_handling: "404-page"` serves the built `404.html` for unknown routes.
- Wrangler local state lives in `.wrangler/` (gitignored).

## Learn More

- [Astro documentation](https://docs.astro.build)
