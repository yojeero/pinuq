import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";
import siteConfig from "@/data/site-config.ts";
import { sortItemsByDateDesc } from "@/utils/data-utils.ts";

const parser = new MarkdownIt();

export async function GET(context) {
  const posts = (await getCollection("blog")).sort(sortItemsByDateDesc);

  const items = posts.map((item) => {
    const htmlContent = parser.render(item.body || "");

    return {
      title: item.data.title,
      description: item.data.excerpt,
      link: `/blog/${item.id}/`,
      pubDate: item.data.publishDate,
      categories: item.data.tags,
      content: sanitizeHtml(htmlContent, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      }),
    };
  });

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site,
    items,
    customData: `<language>en-us</language>`,
  });
}
