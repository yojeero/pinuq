import type { MarkdownHeading } from "astro";
import type { TocItem } from "@/types";

export function generateToc(headings: readonly MarkdownHeading[]): TocItem[] {
  const bodyHeadings = headings.filter(({ depth }) => depth > 1);
  const toc: TocItem[] = [];

  // Стек для отслеживания текущего пути вложенности
  const stack: TocItem[] = [];

  for (const h of bodyHeadings) {
    const heading: TocItem = {
      depth: h.depth,
      slug: h.slug,
      text: h.text,
      subheadings: [],
    };

    // Очищаем стек от элементов, которые глубже или равны текущему заголовку
    while (stack.length > 0 && stack[stack.length - 1].depth >= heading.depth) {
      stack.pop();
    }

    if (stack.length === 0) {
      // Если стек пуст, значит это корень (обычно h2, либо первый встреченный заголовок)
      toc.push(heading);
    } else {
      // Иначе добавляем в subheadings к последнему родителю в стеке
      stack[stack.length - 1].subheadings.push(heading);
    }

    // Добавляем текущий заголовок в стек, так как он может стать родителем для следующих
    stack.push(heading);
  }

  return toc;
}
