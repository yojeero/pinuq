import type { MarkdownHeading } from "astro";
import type { TocItem } from "@/types";

export function generateToc(headings: readonly MarkdownHeading[]): TocItem[] {
  const bodyHeadings = headings.filter(({ depth }) => depth > 1);
  const toc: TocItem[] = [];

  const stack: TocItem[] = [];

  for (const h of bodyHeadings) {
    const heading: TocItem = {
      depth: h.depth,
      slug: h.slug,
      text: h.text,
      subheadings: [],
    };

    while (stack.length > 0 && stack[stack.length - 1].depth >= heading.depth) {
      stack.pop();
    }

    if (stack.length === 0) {
      toc.push(heading);
    } else {
      stack[stack.length - 1].subheadings.push(heading);
    }

    stack.push(heading);
  }

  return toc;
}
