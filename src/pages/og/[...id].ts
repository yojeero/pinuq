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

const ogRoutesResult = await OGImageRoute({
  param: "id",
  pages: pages,
  getSlug: (key) => `${key}.png`,
  getImageOptions: (_, page) => {
    return {
      title: page.title,
      bgGradient: [[255, 255, 255]],
      border: { color: [200, 200, 200], width: 10 },
      padding: 60,
      logo: {
        path: "./public/android-chrome-512x512.png",
        size: [128],
      },
    };
  },
});

export const getStaticPaths = ogRoutesResult.getStaticPaths;
export const GET = ogRoutesResult.GET;
