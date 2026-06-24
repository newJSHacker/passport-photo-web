const CMS_BASE = "https://passport-photo.online/images/cms";

export function cmsImage(file: string, width: number): string {
  return `${CMS_BASE}/${file}?quality=80&format=webp&width=${width}`;
}
