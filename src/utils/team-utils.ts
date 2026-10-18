import type { ImageMetadata } from "astro";

const avatars = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/team/*.{png,jpg,jpeg,webp}",
  { eager: true },
);

const DEFAULT_AVATAR = "yojee.webp";

export function resolveAvatar(
  avatar?: ImageMetadata | string,
): ImageMetadata | undefined {
  if (typeof avatar !== "string") return avatar;
  return avatars[`/src/assets/team/${avatar}`]?.default;
}

export const defaultAvatar = resolveAvatar(DEFAULT_AVATAR);
