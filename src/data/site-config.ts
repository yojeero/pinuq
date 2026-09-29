import type { ImageMetadata } from "astro";
import avatar from "@/assets/avatar.webp";

export type Image = {
  src: ImageMetadata | string;
  alt?: string;
};

export type Link = {
  text: string;
  href: string;
};

export type SocialLink = Link & {
  icon: "github" | "dribbble" | "rss";
};

export type Hero = {
  title?: string;
  text?: string;
  cta?: Link[];
};

export type SiteConfig = {
  title: string;
  titleSeparator: string;
  description: string;
  author: string;
  twitter: string;
  image: Image & { src: ImageMetadata };
  primaryNavLinks?: Link[];
  socialLinks?: SocialLink[];
  hero?: Hero;
};

const siteUrl = (import.meta.env.SITE ?? "https://pinux.vercel.app").replace(
  /\/$/,
  "",
);

const siteConfig: SiteConfig = {
  title: "PINUX",
  titleSeparator: "|",
  description:
    "I'm a full stack developer and consultant based in the Cloud, obsessed with crafting seamless, impactful digital solutions.",
  author: "Yojee",
  twitter: "@yojeero",
  image: {
    src: avatar,
    alt: "Yojee - Full Stack Developer and Consultant in the Cloud",
  },
  primaryNavLinks: [
    {
      text: "About",
      href: "/about",
    },
    {
      text: "Projects",
      href: "/projects",
    },
  ],
  socialLinks: [
    {
      text: "RSS",
      href: `${siteUrl}/rss.xml`,
      icon: "rss",
    },
    {
      text: "GitHub",
      href: "https://github.com/yojeero",
      icon: "github",
    },
    {
      text: "Dribbble",
      href: "https://dribbble.com/yojeero",
      icon: "dribbble",
    },
  ],
};

export default siteConfig;
