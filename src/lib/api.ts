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

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api/backend";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
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
  return `${API_BASE.replace("/api/backend", "")}${path.replace("/api/v1", "/api/backend")}`;
}
