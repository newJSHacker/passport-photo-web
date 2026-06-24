import type { ImgHTMLAttributes } from "react";

/**
 * passport-photo.online CDN blocks cross-origin referrers (403).
 * Strip referrer so local dev and production can load CMS images.
 */
export function OnlineCmsImage({
  referrerPolicy = "no-referrer",
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img referrerPolicy={referrerPolicy} {...props} />;
}
