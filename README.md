

<img src="https://img.shields.io/badge/Pinux-7678ed?style=for-the-badge" width="40%" alt="Yojee-Blog">   

> [!NOTE]
> Features 🧼   

- Blog about   
    - Tech 
    - Linux
    - Coding
    - Life style  
- Clean UI   
- SEO-Friendly   
- Responsive Design   
- Cloud & Vercel Hosting Ready

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
└── dist/              # Build output (generated, static site served by Vercel)
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

> [!IMPORTANT]
> https://pinux.vercel.app — now using in the config files on production.
> When your project gets a different domain name (for example, new.vercel.app) or you connect your own domain, update all 4 locations; otherwise, the incorrect address will remain.   

> astro.config.mjs   
> public/robots.txt   
> site-config.ts   
> BaseLayout.astro.    
