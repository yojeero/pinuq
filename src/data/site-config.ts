import type { ImageMetadata } from "astro";

import alexAvatar from "@/assets/team/alex.webp";
import yojeeAvatar from "@/assets/team/yojee.webp";
import juraAvatar from "@/assets/team/yura.webp";

export type Image = {
  src: ImageMetadata | string;
  alt?: string;
};

export type Link = {
  text: string;
  href: string;
};

export type SocialIconType = "github" | "dribbble" | "rss" | "telegram";

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
  logo: {
    src: string;
    alt: string;
  };
  image: Image & { src: ImageMetadata };
  primaryNavLinks?: Link[];
  socialLinks?: SocialLink[];
  hero?: Hero;
  team: TeamMember[];
};

const siteUrl = (import.meta.env.SITE ?? "https://pinux.vercel.app").replace(
  /\/\$/,
  "",
);

export const team: TeamMember[] = [
  {
    name: "Yojee",
    author: "Yojee",
    role: "Full Stack Developer",
    avatar: yojeeAvatar,
    bio: "Tech Lover / Linux Nerd / Open Source Enthusiast",
    socials: [
      { text: "GitHub", href: "https://github.com/yojeero", icon: "github" },
      {
        text: "Dribbble",
        href: "https://dribbble.com/yojeero",
        icon: "dribbble",
      },
      { text: "Telegram", href: "https://t.me", icon: "telegram" },
    ],
  },
  {
    name: "ADTech",
    author: "ADTD",
    role: "Kotlin Developer",
    avatar: alexAvatar,
    bio: "Tech & DevOps.",
    socials: [
      { text: "GitHub", href: "https://github.com/", icon: "github" },
      { text: "Dribbble", href: "https://dribbble.com/", icon: "dribbble" },
      { text: "Telegram", href: "https://t.me", icon: "telegram" },
    ],
  },
  {
    name: "Junso",
    author: "PhD.Junso",
    role: "Frontend Engineer",
    avatar: juraAvatar,
    bio: "PR & Media.",
    socials: [
      { text: "GitHub", href: "https://github.com/", icon: "github" },
      { text: "Dribbble", href: "https://dribbble.com/", icon: "dribbble" },
      { text: "Telegram", href: "https://t.me", icon: "telegram" },
    ],
  },
];

const siteConfig: SiteConfig = {
  title: "PINUX",
  titleSeparator: "|",
  description: team[0].bio,
  logo: {
    src: "/images/logo.png",
    alt: "PINUX",
  },
  author: team[0].author || team[0].name,
  image: {
    src: team[0].avatar,
    alt: `${team[0].name} - ${team[0].role}`,
  },
  primaryNavLinks: [
    { text: "About", href: "/about" },
    { text: "Projects", href: "/projects" },
  ],
  socialLinks: [
    {
      text: "RSS",
      href: `${siteUrl}/rss.xml`,
      icon: "rss",
    },
    ...team[0].socials,
  ],
  team: team,
};

export default siteConfig;
