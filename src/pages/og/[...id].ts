import { getCollection } from "astro:content";
import { OGImageRoute } from "astro-og-canvas";

const posts = await getCollection("blog");

const pages = Object.fromEntries(
  posts.map(({ data, id }) => [
    id,
    {
      title: data.title,
      customData: data,
    },
  ]),
);

export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  getSlug: (id: string) => `${id}.png`,
  getImageOptions: (_, page: (typeof pages)[string]) => {
    return {
      title: page.title,
      bgGradient: [[240, 236, 227]],
      border: { color: [200, 168, 112], width: 10 },
      padding: 60,
      logo: {
        path: "./public/android-chrome-512x512.png",
        size: [80],
      },
      font: {
        title: {
          color: [28, 38, 68],
          size: 60,
          lineHeight: 1.25,
          families: ["Pier Sans"],
          weight: "Normal",
        },
      },
      fonts: ["./src/assets/fonts/PierSans-Regular.woff2"],
    };
  },
});
