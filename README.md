<img src="preview/pinux_1.png" width="100%"><img src="preview/pinux_2.png" width="100%">

<img src="https://img.shields.io/badge/Pinux-7678ed?style=for-the-badge" width="40%" alt="Yojee-Blog">   

> [!NOTE]
> Features 🧼   

- Blog about Tech, Linux & Coders Lifestyle  
- Clean UI   
- SEO-Friendly   
- Responsive Design   
- Cloud & Vercel Hosting Ready

#### Tech Stack
```
Astro | Bun | Vite | Biome | Tailwind CSS | TypeScript
```   

<img src="preview/100.png" width="70%">   

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
> https://pinuq.vercel.app — now using in the config files on production.

When your project gets a different domain name (for example, new.vercel.app)    
or you connect your own domain, update all 4 locations;    
otherwise, the incorrect address will remain.   

> astro.config.mjs   
> public/robots.txt   
> site-config.ts   
> BaseLayout.astro.    
