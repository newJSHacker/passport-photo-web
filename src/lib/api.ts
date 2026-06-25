export interface DocumentDimensions {
  width_px: number;
  height_px: number;
  dpi: number;
}

export interface HeadRules {
  min_head_height_pct: number;
  max_head_height_pct: number;
  target_head_height_pct: number;
  eye_line_from_bottom_pct: number;
  eye_line_tolerance_pct: number;
}

export interface DocumentSpec {
  id: string;
  name: string;
  country: string;
  document_type: string;
  dimensions: DocumentDimensions;
}

export interface DocumentSpecDetail extends DocumentSpec {
  background_color: string;
  head_rules: HeadRules;
  description: string;
  rules: string[];
}

export interface ValidationIssue {
  code: string;
  severity: "error" | "warning";
  message: string;
}

export interface ValidationReport {
  passed: boolean;
  score: number;
  issues: ValidationIssue[];
}

export type JobStatus =
  | "created"
  | "uploaded"
  | "processing"
  | "completed"
  | "failed";

export interface PhotoJob {
  id: string;
  document_id: string;
  status: JobStatus;
  created_at: string;
  original_url: string | null;
  processed_url: string | null;
  preview_url: string | null;
  validation: ValidationReport | null;
  error: string | null;
}

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "/api/backend").replace(
  /\/+$/,
  "",
);

function joinApiPath(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
}

function parseApiError(message: string, status: number): string {
  try {
    const json = JSON.parse(message) as { detail?: string | { msg: string }[] };
    if (typeof json.detail === "string") return json.detail;
    if (Array.isArray(json.detail) && json.detail[0]?.msg) {
      return json.detail[0].msg;
    }
  } catch {
    // not JSON
  }
  return message || `Request failed: ${status}`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(joinApiPath(path), {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(parseApiError(message, response.status));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function fetchDocuments(): Promise<DocumentSpec[]> {
  return request<DocumentSpec[]>("/documents");
}

export async function fetchDocument(id: string): Promise<DocumentSpecDetail> {
  return request<DocumentSpecDetail>(`/documents/${id}`);
}

export async function createDocumentSpec(
  payload: DocumentSpecDetail,
): Promise<DocumentSpecDetail> {
  return request<DocumentSpecDetail>("/documents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updateDocumentSpec(
  id: string,
  payload: DocumentSpecDetail,
): Promise<DocumentSpecDetail> {
  return request<DocumentSpecDetail>(`/documents/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteDocumentSpec(id: string): Promise<void> {
  return request<void>(`/documents/${id}`, {
    method: "DELETE",
  });
}

export async function createPhotoJob(documentId: string): Promise<PhotoJob> {
  return request<PhotoJob>("/photos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ document_id: documentId }),
  });
}

export async function uploadPhoto(jobId: string, file: File): Promise<PhotoJob> {
  const formData = new FormData();
  formData.append("file", file);

  return request<PhotoJob>(`/photos/${jobId}/upload`, {
    method: "POST",
    body: formData,
  });
}

export async function processPhoto(jobId: string): Promise<PhotoJob> {
  return request<PhotoJob>(`/photos/${jobId}/process`, {
    method: "POST",
  });
}

export async function getPhotoJob(jobId: string): Promise<PhotoJob> {
  return request<PhotoJob>(`/photos/${jobId}`);
}

export async function fetchPhotoJobs(params?: {
  status?: JobStatus;
  limit?: number;
}): Promise<PhotoJob[]> {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set("status", params.status);
  if (params?.limit) searchParams.set("limit", String(params.limit));
  const query = searchParams.toString();
  return request<PhotoJob[]>(`/photos${query ? `?${query}` : ""}`);
}

export function photoFileUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const webOrigin = API_BASE.replace(/\/api\/backend$/, "").replace(
    /\/api\/v1$/,
    "",
  );
  const backendPath = path.replace("/api/v1", "/api/backend");
  return `${webOrigin}${backendPath}`;
}

export interface CheckoutPricingOption {
  id: "digital" | "print";
  title: string;
  description: string;
  amount_cents: number;
  currency: string;
}

export interface CheckoutPricing {
  options: CheckoutPricingOption[];
}

export interface CreateCheckoutSessionPayload {
  photo_job_id: string;
  email: string;
  delivery_type: "digital" | "print";
  print_copies?: 2 | 4 | 6;
  addons?: ("expert_check" | "photo_retouching")[];
  success_url?: string;
  cancel_url?: string;
}

export function getCheckoutReturnUrls(): {
  success_url: string;
  cancel_url: string;
} {
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
          /\/+$/,
          "",
        );

  return {
    success_url: `${origin}/checkout/success`,
    cancel_url: `${origin}/checkout/cancel`,
  };
}

export interface CreateCheckoutSessionResult {
  order_id: string;
  checkout_url: string;
  demo_mode: boolean;
  photo_job_id?: string | null;
  email?: string | null;
}

export interface Order {
  id: string;
  photo_job_id: string;
  email: string;
  delivery_type: string;
  amount_cents: number;
  currency: string;
  status: string;
  created_at: string;
  paid_at: string | null;
  download_url: string | null;
}

export async function fetchCheckoutPricing(): Promise<CheckoutPricing> {
  return request<CheckoutPricing>("/checkout/pricing");
}

export async function createCheckoutSession(
  payload: CreateCheckoutSessionPayload,
): Promise<CreateCheckoutSessionResult> {
  return request<CreateCheckoutSessionResult>("/checkout/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function getOrder(orderId: string): Promise<Order> {
  return request<Order>(`/checkout/orders/${orderId}`);
}

export async function getOrderBySession(sessionId: string): Promise<Order> {
  return request<Order>(`/checkout/orders/by-session/${sessionId}`);
}

export async function getOrderByJob(photoJobId: string): Promise<Order> {
  return request<Order>(`/checkout/orders/by-job/${photoJobId}`);
}

export function formatPrice(amountCents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountCents / 100);
}
