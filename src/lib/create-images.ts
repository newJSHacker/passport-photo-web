const BEFORE_AFTER_BASE = "https://passport-photo.online/images/before-after";
const CMS_BASE = "https://passport-photo.online/images/cms";

const BEFORE_AFTER_BEFORE = "before/default.png";
const BEFORE_AFTER_AFTER = "after/15c380439793fb2b889bde1b897f4831.png";

const PROCESSING_FILE = "how_It_Works1_7366acfde0.webp";
const AFTER_PASSPORT_FILE = "US_passport_photo_cover_f9064c684a.png";
const AFTER_VISA_FILE = "USCIS_photo_cover_7528ad6aa5.png";

const VISA_DOCUMENT_IDS = new Set(["us-visa", "schengen-visa"]);

function beforeAfterImage(path: string, width: number): string {
  return `${BEFORE_AFTER_BASE}/${path}?quality=80&format=webp&width=${width}`;
}

function cmsImage(file: string, width: number): string {
  return `${CMS_BASE}/${file}?quality=80&format=webp&width=${width}`;
}

/** "Before" sample in document specifications */
export function getCreateBeforeImage(width = 430): string {
  return beforeAfterImage(BEFORE_AFTER_BEFORE, width);
}

/** "After" sample in document specifications */
export function getCreateAfterImage(
  _documentId?: string | null,
  width = 430,
): string {
  return beforeAfterImage(BEFORE_AFTER_AFTER, width);
}

/** Large preview while processing */
export function getCreateProcessingImage(width = 750): string {
  return beforeAfterImage(BEFORE_AFTER_BEFORE, width);
}

/** Document card thumbnail on the create page */
export function getDocumentCoverImage(
  documentId: string | null | undefined,
  width = 160,
): string {
  const file =
    documentId && VISA_DOCUMENT_IDS.has(documentId)
      ? AFTER_VISA_FILE
      : AFTER_PASSPORT_FILE;
  return cmsImage(file, width);
}

/** Result preview fallback when API output is unavailable */
export function getCreateResultImage(width = 430): string {
  return beforeAfterImage(BEFORE_AFTER_AFTER, width);
}
