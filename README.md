<img src="preview/inux-2.jpg" width="100%">

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
Astro | Bun | Vite | Biome | Tailwind CSS | TypeScript   
```

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
| `bunx wrangler deploy` | Deploys `./dist` to Cloudflare Pages or Workers (build first)    |

## Learn More

- [Astro documentation](https://docs.astro.build)
