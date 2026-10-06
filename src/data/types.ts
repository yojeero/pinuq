// src/types.ts
import type { CollectionEntry } from "astro:content";
import type { ImageMetadata } from "astro";
import type { Thing, WithContext } from "schema-dts";

export type { Thing, WithContext } from "schema-dts";

export type Image = {
  src: ImageMetadata | string;
  alt?: string;
};

export type Link = {
  text: string;
  href: string;
};

export type SocialIconType = "github" | "twitter";

export type SocialLink = Link & {
  icon: SocialIconType;
};

export type TeamMember = {
  name: string;
  author?: string;
  role: string;
  bio: string;
  avatar: ImageMetadata;
  socials: SocialLink[];
};

export type SiteConfig = {
  title: string;
  titleSeparator: string;
  url: string;
  description: string;
  author: string;
  logo: {
    src: string;
    alt: string;
  };
  image: Image & { src: ImageMetadata };
  primaryNavLinks?: Link[];
  socialLinks?: SocialLink[];
  team: TeamMember[];
};
// -------------------------------------------------------------

export type BlogPost = CollectionEntry<"blog">;

export interface BaseHeadProps extends Record<string, unknown> {
  title?: string;
  description?: string;
  author?: string;
  twitter?: string;
  image?: Image;
  pageType?: "website" | "article";
  publishedTime?: Date;
  modifiedTime?: Date;
  tags?: string[];
  noindex?: boolean;
}

export interface PostListItemProps extends Record<string, unknown> {
  post: BlogPost;
  class?: string;
  hideTags?: boolean;
  showCover?: boolean;
}

export interface TOCProps extends Record<string, unknown> {
  headings: readonly import("astro").MarkdownHeading[];
  class?: string;
}

export interface TocItem extends Record<string, unknown> {
  depth: number;
  slug: string;
  text: string;
  subheadings: TocItem[];
}

export type TagData = {
  name: string;
  id: string;
};

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface JsonLdProps {
  schema: WithContext<Thing> | WithContext<Thing>[];
}
