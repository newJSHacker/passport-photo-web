"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  createDocumentSpec,
  deleteDocumentSpec,
  fetchDocument,
  fetchDocuments,
  fetchPhotoJobs,
  photoFileUrl,
  updateDocumentSpec,
  type DocumentSpec,
  type DocumentSpecDetail,
  type JobStatus,
  type PhotoJob,
} from "@/lib/api";

const statusOptions: Array<{ value: "all" | JobStatus; label: string }> = [
  { value: "all", label: "All statuses" },
  { value: "created", label: "Created" },
  { value: "uploaded", label: "Uploaded" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
];

type DocumentEditorMode = "create" | "edit";

interface DocumentFormState {
  id: string;
  name: string;
  country: string;
  document_type: string;
  width_px: string;
  height_px: string;
  dpi: string;
  background_color: string;
  min_head_height_pct: string;
  max_head_height_pct: string;
  target_head_height_pct: string;
  eye_line_from_bottom_pct: string;
  eye_line_tolerance_pct: string;
  description: string;
  rules_text: string;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function statusBadgeClass(status: JobStatus) {
  switch (status) {
    case "completed":
      return "bg-brand/15 text-brand-dark";
    case "failed":
      return "bg-[#ffe6e6] text-[#ed5466]";
    case "processing":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-section text-navy";
  }
}

function emptyDocumentForm(): DocumentFormState {
  return {
    id: "",
    name: "",
    country: "US",
    document_type: "passport",
    width_px: "600",
    height_px: "600",
    dpi: "300",
    background_color: "#FFFFFF",
    min_head_height_pct: "50",
    max_head_height_pct: "69",
    target_head_height_pct: "60",
    eye_line_from_bottom_pct: "62",
    eye_line_tolerance_pct: "6",
    description: "",
    rules_text: "",
  };
}

function detailToForm(detail: DocumentSpecDetail): DocumentFormState {
  return {
    id: detail.id,
    name: detail.name,
    country: detail.country,
    document_type: detail.document_type,
    width_px: String(detail.dimensions.width_px),
    height_px: String(detail.dimensions.height_px),
    dpi: String(detail.dimensions.dpi),
    background_color: detail.background_color,
    min_head_height_pct: String(detail.head_rules.min_head_height_pct),
    max_head_height_pct: String(detail.head_rules.max_head_height_pct),
    target_head_height_pct: String(detail.head_rules.target_head_height_pct),
    eye_line_from_bottom_pct: String(detail.head_rules.eye_line_from_bottom_pct),
    eye_line_tolerance_pct: String(detail.head_rules.eye_line_tolerance_pct),
    description: detail.description,
    rules_text: detail.rules.join("\n"),
  };
}

function formToDetail(form: DocumentFormState): DocumentSpecDetail {
  const width = Number(form.width_px);
  const height = Number(form.height_px);
  const dpi = Number(form.dpi);
  const minHead = Number(form.min_head_height_pct);
  const maxHead = Number(form.max_head_height_pct);
  const targetHead = Number(form.target_head_height_pct);
  const eyeLine = Number(form.eye_line_from_bottom_pct);
  const eyeTolerance = Number(form.eye_line_tolerance_pct);

  const numericValues = [
    width,
    height,
    dpi,
    minHead,
    maxHead,
    targetHead,
    eyeLine,
    eyeTolerance,
  ];
  if (numericValues.some((value) => Number.isNaN(value))) {
    throw new Error("All numeric fields must be valid numbers");
  }

  const rules = form.rules_text
    .split("\n")
    .map((rule) => rule.trim())
    .filter(Boolean);

  return {
    id: form.id.trim(),
    name: form.name.trim(),
    country: form.country.trim(),
    document_type: form.document_type.trim(),
    dimensions: {
      width_px: width,
      height_px: height,
      dpi,
    },
    background_color: form.background_color.trim() || "#FFFFFF",
    head_rules: {
      min_head_height_pct: minHead,
      max_head_height_pct: maxHead,
      target_head_height_pct: targetHead,
      eye_line_from_bottom_pct: eyeLine,
      eye_line_tolerance_pct: eyeTolerance,
    },
    description: form.description.trim(),
    rules,
  };
}

export function AdminDashboard() {
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentSpec[]>([]);
  const [jobs, setJobs] = useState<PhotoJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | JobStatus>("all");
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [documentEditorMode, setDocumentEditorMode] =
    useState<DocumentEditorMode>("edit");
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [documentForm, setDocumentForm] = useState<DocumentFormState>(() =>
    emptyDocumentForm(),
  );
  const [documentDetailLoading, setDocumentDetailLoading] = useState(false);
  const [documentSaving, setDocumentSaving] = useState(false);
  const [documentError, setDocumentError] = useState<string | null>(null);

  const documentNameById = useMemo(
    () =>
      new Map(
        documents.map((document) => [document.id, document.name] as const),
      ),
    [documents],
  );

  const selectedJob =
    jobs.find((job) => job.id === selectedJobId) ?? jobs[0] ?? null;

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [nextDocuments, nextJobs] = await Promise.all([
        fetchDocuments(),
        fetchPhotoJobs({
          status: statusFilter === "all" ? undefined : statusFilter,
          limit: 200,
        }),
      ]);

      setDocuments(nextDocuments);
      setJobs(nextJobs);

      setSelectedJobId((current) => {
        if (current && nextJobs.some((job) => job.id === current)) return current;
        return nextJobs[0]?.id ?? null;
      });

      setSelectedDocumentId((current) => {
        if (current && nextDocuments.some((document) => document.id === current)) {
          return current;
        }
        return nextDocuments[0]?.id ?? null;
      });
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Failed to load admin data",
      );
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  function updateDocumentFormField<K extends keyof DocumentFormState>(
    field: K,
    value: DocumentFormState[K],
  ) {
    setDocumentForm((current) => ({ ...current, [field]: value }));
  }

  function startCreateDocument() {
    setDocumentEditorMode("create");
    setSelectedDocumentId(null);
    setDocumentError(null);
    setDocumentForm(emptyDocumentForm());
  }

  function selectDocument(documentId: string) {
    setDocumentEditorMode("edit");
    setSelectedDocumentId(documentId);
    setDocumentError(null);
  }

  async function saveDocument(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDocumentSaving(true);
    setDocumentError(null);

    try {
      const payload = formToDetail(documentForm);
      if (!payload.id || !payload.name || !payload.description) {
        throw new Error("ID, name, and description are required");
      }

      if (documentEditorMode === "create") {
        const created = await createDocumentSpec(payload);
        await loadData();
        setDocumentEditorMode("edit");
        setSelectedDocumentId(created.id);
      } else {
        const documentId = selectedDocumentId ?? payload.id;
        const updated = await updateDocumentSpec(documentId, payload);
        await loadData();
        setSelectedDocumentId(updated.id);
      }
    } catch (saveError) {
      setDocumentError(
        saveError instanceof Error ? saveError.message : "Failed to save document",
      );
    } finally {
      setDocumentSaving(false);
    }
  }

  async function removeDocument() {
    if (!selectedDocumentId || documentEditorMode === "create") return;
    const confirmed = window.confirm(
      `Delete document spec "${selectedDocumentId}"?`,
    );
    if (!confirmed) return;

    setDocumentSaving(true);
    setDocumentError(null);
    try {
      await deleteDocumentSpec(selectedDocumentId);
      await loadData();
      setDocumentEditorMode("edit");
    } catch (deleteError) {
      setDocumentError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete document",
      );
    } finally {
      setDocumentSaving(false);
    }
  }

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  useEffect(() => {
    async function loadSelectedDocumentDetail() {
      if (documentEditorMode === "create") return;
      if (!selectedDocumentId) return;

      setDocumentDetailLoading(true);
      setDocumentError(null);
      try {
        const detail = await fetchDocument(selectedDocumentId);
        setDocumentForm(detailToForm(detail));
      } catch (detailError) {
        setDocumentError(
          detailError instanceof Error
            ? detailError.message
            : "Failed to load document detail",
        );
      } finally {
        setDocumentDetailLoading(false);
      }
    }

    void loadSelectedDocumentDetail();
  }, [documentEditorMode, selectedDocumentId]);

  return (
    <div className="bg-page py-10 md:py-14">
      <div className="container-main">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/" className="text-sm font-medium text-brand hover:underline">
              {"<-"} Back to home
            </Link>
            <h1 className="typography-h2 mt-3">Admin Panel</h1>
            <p className="mt-3 text-base leading-7 text-grey">
              Monitor photo jobs and manage document specifications dynamically.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-navy" htmlFor="status-filter">
              Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as "all" | JobStatus)
              }
              className="h-10 rounded-md border border-[#d5d5dc] bg-white px-3 text-sm text-navy"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Button type="button" variant="outline" onClick={() => void loadData()}>
              Refresh
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => void logout()}
              disabled={loggingOut}
            >
              {loggingOut ? "Signing out..." : "Logout"}
            </Button>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-lg border border-[#ed5466] bg-[#ffe6e6] px-4 py-3 text-sm text-[#ed5466]">
            {error}
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-xl border border-[#d5d5dc] bg-white">
            <div className="border-b border-[#e5e5e5] px-5 py-4">
              <h2 className="text-lg font-semibold text-navy">Photo Jobs</h2>
            </div>

            {loading ? (
              <p className="px-5 py-6 text-sm text-grey">Loading jobs...</p>
            ) : jobs.length === 0 ? (
              <p className="px-5 py-6 text-sm text-grey">No jobs found.</p>
            ) : (
              <ul className="max-h-[620px] overflow-y-auto">
                {jobs.map((job) => (
                  <li key={job.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedJobId(job.id)}
                      className={`w-full border-b border-[#f0f0f0] px-5 py-4 text-left transition hover:bg-section ${
                        selectedJob?.id === job.id ? "bg-brand/5" : "bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-navy">{job.id}</p>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(job.status)}`}
                        >
                          {job.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-grey">
                        {documentNameById.get(job.document_id) ?? job.document_id}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        Created: {formatDate(job.created_at)}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-xl border border-[#d5d5dc] bg-white">
            <div className="border-b border-[#e5e5e5] px-5 py-4">
              <h2 className="text-lg font-semibold text-navy">Job Details</h2>
            </div>

            {!selectedJob ? (
              <p className="px-5 py-6 text-sm text-grey">
                Select a job to inspect details.
              </p>
            ) : (
              <div className="space-y-5 px-5 py-5">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-muted">Job ID</p>
                  <p className="text-sm font-medium text-navy">{selectedJob.id}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-muted">Document</p>
                    <p className="text-sm text-navy">
                      {documentNameById.get(selectedJob.document_id) ??
                        selectedJob.document_id}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-muted">Status</p>
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(selectedJob.status)}`}
                    >
                      {selectedJob.status}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-muted">Created At</p>
                  <p className="text-sm text-navy">{formatDate(selectedJob.created_at)}</p>
                </div>

                {selectedJob.validation ? (
                  <div className="rounded-lg bg-section px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-muted">Validation</p>
                    <p className="mt-1 text-sm font-medium text-navy">
                      Score: {selectedJob.validation.score} ·{" "}
                      {selectedJob.validation.passed ? "Passed" : "Needs fixes"}
                    </p>
                    {selectedJob.validation.issues.length ? (
                      <ul className="mt-3 space-y-2">
                        {selectedJob.validation.issues.map((issue) => (
                          <li
                            key={`${selectedJob.id}-${issue.code}`}
                            className={`rounded px-3 py-2 text-sm ${
                              issue.severity === "error"
                                ? "bg-[#ffe6e6] text-[#ed5466]"
                                : "bg-amber-50 text-amber-900"
                            }`}
                          >
                            <span className="font-semibold capitalize">
                              {issue.severity}:
                            </span>{" "}
                            {issue.message}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ) : null}

                {selectedJob.error ? (
                  <div className="rounded-lg bg-[#ffe6e6] px-4 py-3 text-sm text-[#ed5466]">
                    {selectedJob.error}
                  </div>
                ) : null}

                <div className="grid gap-2 text-sm">
                  {selectedJob.original_url ? (
                    <a
                      href={photoFileUrl(selectedJob.original_url) ?? "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand hover:underline"
                    >
                      Open original image
                    </a>
                  ) : null}
                  {selectedJob.preview_url ? (
                    <a
                      href={photoFileUrl(selectedJob.preview_url) ?? "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand hover:underline"
                    >
                      Open preview image
                    </a>
                  ) : null}
                  {selectedJob.processed_url ? (
                    <a
                      href={photoFileUrl(selectedJob.processed_url) ?? "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand hover:underline"
                    >
                      Open processed image
                    </a>
                  ) : null}
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="rounded-xl border border-[#d5d5dc] bg-white">
            <div className="flex items-center justify-between border-b border-[#e5e5e5] px-5 py-4">
              <h2 className="text-lg font-semibold text-navy">Document Specs</h2>
              <Button type="button" variant="outline" onClick={startCreateDocument}>
                New
              </Button>
            </div>

            {loading ? (
              <p className="px-5 py-6 text-sm text-grey">Loading documents...</p>
            ) : documents.length === 0 ? (
              <p className="px-5 py-6 text-sm text-grey">No document specs found.</p>
            ) : (
              <ul className="max-h-[560px] overflow-y-auto">
                {documents.map((document) => (
                  <li key={document.id}>
                    <button
                      type="button"
                      onClick={() => selectDocument(document.id)}
                      className={`w-full border-b border-[#f0f0f0] px-5 py-4 text-left transition hover:bg-section ${
                        documentEditorMode === "edit" &&
                        selectedDocumentId === document.id
                          ? "bg-brand/5"
                          : "bg-white"
                      }`}
                    >
                      <p className="text-sm font-semibold text-navy">{document.name}</p>
                      <p className="mt-1 text-xs text-muted">
                        {document.id} · {document.country} · {document.document_type}
                      </p>
                      <p className="mt-1 text-xs text-grey">
                        {document.dimensions.width_px}x{document.dimensions.height_px} @{" "}
                        {document.dimensions.dpi}dpi
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-xl border border-[#d5d5dc] bg-white">
            <div className="border-b border-[#e5e5e5] px-5 py-4">
              <h2 className="text-lg font-semibold text-navy">
                {documentEditorMode === "create"
                  ? "Create Document Spec"
                  : "Edit Document Spec"}
              </h2>
            </div>

            <form className="space-y-5 px-5 py-5" onSubmit={(event) => void saveDocument(event)}>
              {documentError ? (
                <div className="rounded-lg border border-[#ed5466] bg-[#ffe6e6] px-4 py-3 text-sm text-[#ed5466]">
                  {documentError}
                </div>
              ) : null}

              {documentDetailLoading ? (
                <p className="text-sm text-grey">Loading document detail...</p>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wide text-muted">ID</label>
                  <input
                    value={documentForm.id}
                    onChange={(event) =>
                      updateDocumentFormField("id", event.target.value)
                    }
                    disabled={documentEditorMode === "edit"}
                    className="h-10 w-full rounded-md border border-[#d5d5dc] px-3 text-sm text-navy disabled:bg-section"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wide text-muted">Name</label>
                  <input
                    value={documentForm.name}
                    onChange={(event) =>
                      updateDocumentFormField("name", event.target.value)
                    }
                    className="h-10 w-full rounded-md border border-[#d5d5dc] px-3 text-sm text-navy"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wide text-muted">Country</label>
                  <input
                    value={documentForm.country}
                    onChange={(event) =>
                      updateDocumentFormField("country", event.target.value)
                    }
                    className="h-10 w-full rounded-md border border-[#d5d5dc] px-3 text-sm text-navy"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wide text-muted">
                    Document Type
                  </label>
                  <input
                    value={documentForm.document_type}
                    onChange={(event) =>
                      updateDocumentFormField("document_type", event.target.value)
                    }
                    className="h-10 w-full rounded-md border border-[#d5d5dc] px-3 text-sm text-navy"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wide text-muted">Width px</label>
                  <input
                    value={documentForm.width_px}
                    onChange={(event) =>
                      updateDocumentFormField("width_px", event.target.value)
                    }
                    className="h-10 w-full rounded-md border border-[#d5d5dc] px-3 text-sm text-navy"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wide text-muted">
                    Height px
                  </label>
                  <input
                    value={documentForm.height_px}
                    onChange={(event) =>
                      updateDocumentFormField("height_px", event.target.value)
                    }
                    className="h-10 w-full rounded-md border border-[#d5d5dc] px-3 text-sm text-navy"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wide text-muted">DPI</label>
                  <input
                    value={documentForm.dpi}
                    onChange={(event) =>
                      updateDocumentFormField("dpi", event.target.value)
                    }
                    className="h-10 w-full rounded-md border border-[#d5d5dc] px-3 text-sm text-navy"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wide text-muted">
                  Background Color
                </label>
                <input
                  value={documentForm.background_color}
                  onChange={(event) =>
                    updateDocumentFormField("background_color", event.target.value)
                  }
                  className="h-10 w-full rounded-md border border-[#d5d5dc] px-3 text-sm text-navy"
                  placeholder="#FFFFFF"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wide text-muted">
                    Min head %
                  </label>
                  <input
                    value={documentForm.min_head_height_pct}
                    onChange={(event) =>
                      updateDocumentFormField("min_head_height_pct", event.target.value)
                    }
                    className="h-10 w-full rounded-md border border-[#d5d5dc] px-3 text-sm text-navy"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wide text-muted">
                    Max head %
                  </label>
                  <input
                    value={documentForm.max_head_height_pct}
                    onChange={(event) =>
                      updateDocumentFormField("max_head_height_pct", event.target.value)
                    }
                    className="h-10 w-full rounded-md border border-[#d5d5dc] px-3 text-sm text-navy"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wide text-muted">
                    Target head %
                  </label>
                  <input
                    value={documentForm.target_head_height_pct}
                    onChange={(event) =>
                      updateDocumentFormField(
                        "target_head_height_pct",
                        event.target.value,
                      )
                    }
                    className="h-10 w-full rounded-md border border-[#d5d5dc] px-3 text-sm text-navy"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wide text-muted">
                    Eye line from bottom %
                  </label>
                  <input
                    value={documentForm.eye_line_from_bottom_pct}
                    onChange={(event) =>
                      updateDocumentFormField(
                        "eye_line_from_bottom_pct",
                        event.target.value,
                      )
                    }
                    className="h-10 w-full rounded-md border border-[#d5d5dc] px-3 text-sm text-navy"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wide text-muted">
                    Eye tolerance %
                  </label>
                  <input
                    value={documentForm.eye_line_tolerance_pct}
                    onChange={(event) =>
                      updateDocumentFormField(
                        "eye_line_tolerance_pct",
                        event.target.value,
                      )
                    }
                    className="h-10 w-full rounded-md border border-[#d5d5dc] px-3 text-sm text-navy"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wide text-muted">
                  Description
                </label>
                <textarea
                  value={documentForm.description}
                  onChange={(event) =>
                    updateDocumentFormField("description", event.target.value)
                  }
                  rows={3}
                  className="w-full rounded-md border border-[#d5d5dc] px-3 py-2 text-sm text-navy"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wide text-muted">
                  Rules (one per line)
                </label>
                <textarea
                  value={documentForm.rules_text}
                  onChange={(event) =>
                    updateDocumentFormField("rules_text", event.target.value)
                  }
                  rows={4}
                  className="w-full rounded-md border border-[#d5d5dc] px-3 py-2 text-sm text-navy"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={documentSaving}>
                  {documentSaving ? "Saving..." : "Save Document Spec"}
                </Button>
                {documentEditorMode === "edit" ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void removeDocument()}
                    disabled={documentSaving || !selectedDocumentId}
                  >
                    Delete
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDocumentForm(emptyDocumentForm());
                      setDocumentError(null);
                    }}
                    disabled={documentSaving}
                  >
                    Reset
                  </Button>
                )}
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
