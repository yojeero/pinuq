import teamData from "@/data/team.json";
import type { SiteConfig, TeamMember } from "@/data/types";

const siteUrl = (import.meta.env.SITE ?? "https://pinuq.vercel.app").replace(
  /\/$/,
  "",
);

const siteConfig: SiteConfig = {
  title: "PINUQ",
  titleSeparator: "",
  url: siteUrl,
  description: "Tech Lover",
  logo: {
    src: "/assets/icons/pinuq.svg",
    alt: "PINUQ",
  },
  author: "Yojee",
  image: {
    src: "/assets/team/yojee.png",
    alt: "Yojee - Full Stack Developer",
  },
};

export const team = teamData as TeamMember[];

export default siteConfig;
