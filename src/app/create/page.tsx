"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrustpilotBadge } from "@/components/home/TrustpilotBadge";
import { OnlineCmsImage } from "@/components/OnlineCmsImage";
import {
  createPhotoJob,
  fetchDocument,
  fetchDocuments,
  photoFileUrl,
  processPhoto,
  uploadPhoto,
  type DocumentSpec,
  type DocumentSpecDetail,
  type PhotoJob,
} from "@/lib/api";
import {
  getCreateAfterImage,
  getCreateBeforeImage,
  getCreateProcessingImage,
  getCreateResultImage,
  getDocumentCoverImage,
} from "@/lib/create-images";

type Step = "document" | "processing" | "result";

const PROCESSING_STEPS = ["Cropping", "Background removing", "Resizing", "Analyzing"];
const STEP_DELAY_MS = 1500;

const INITIAL_CHECKS = [
  {
    label: "Face is recognized",
    codes: ["FACE_NOT_VISIBLE", "LOW_FACE_CONFIDENCE"],
  },
  {
    label: "Only one face is allowed",
    codes: ["MULTIPLE_FACES"],
  },
  {
    label: "Minimum dimension",
    codes: ["DIMENSIONS_MISMATCH"],
  },
  {
    label: "Correct photo proportions",
    codes: ["HEAD_TOO_SMALL", "HEAD_TOO_LARGE", "EYE_LINE_OFF"],
  },
] as const;

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function runProcessingAnimation(
  onStep: (step: number) => void,
): Promise<void> {
  for (let index = 0; index < PROCESSING_STEPS.length; index += 1) {
    onStep(index);
    await delay(STEP_DELAY_MS);
  }
}

export default function CreatePage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<DocumentSpec[]>([]);
  const [selectedDocumentDetail, setSelectedDocumentDetail] =
    useState<DocumentSpecDetail | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [job, setJob] = useState<PhotoJob | null>(null);
  const [step, setStep] = useState<Step>("document");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeProcessingStep, setActiveProcessingStep] = useState(0);

  useEffect(() => {
    fetchDocuments()
      .then((loadedDocuments) => {
        setDocuments(loadedDocuments);
        setSelectedDocumentId((current) => current ?? loadedDocuments[0]?.id ?? null);
      })
      .catch(() => setError("Could not load document types. Is the API running?"));
  }, []);

  useEffect(() => {
    if (!selectedDocumentId) {
      setSelectedDocumentDetail(null);
      return;
    }

    fetchDocument(selectedDocumentId)
      .then(setSelectedDocumentDetail)
      .catch(() => setSelectedDocumentDetail(null));
  }, [selectedDocumentId]);

  async function handleUpload(file: File) {
    if (!selectedDocumentId) return;
    setError(null);
    setActiveProcessingStep(0);
    setStep("processing");
    setJob(null);
    setLoading(true);
    try {
      const apiWork = (async () => {
        const created = await createPhotoJob(selectedDocumentId);
        setJob(created);
        const uploaded = await uploadPhoto(created.id, file);
        setJob(uploaded);
        return processPhoto(created.id);
      })();

      const [, processed] = await Promise.all([
        runProcessingAnimation(setActiveProcessingStep),
        apiWork,
      ]);

      setJob(processed);
      setActiveProcessingStep(PROCESSING_STEPS.length - 1);
      setStep("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Processing failed");
      setStep("document");
    } finally {
      setLoading(false);
    }
  }

  function handleRetake() {
    setJob(null);
    setActiveProcessingStep(0);
    setStep("document");
    setError(null);
    window.setTimeout(() => inputRef.current?.click(), 0);
  }

  const selectedDocument = documents.find((d) => d.id === selectedDocumentId);
  const activeDocument = selectedDocumentDetail ?? selectedDocument ?? null;
  const processedUrl = photoFileUrl(job?.processed_url ?? null);
  const beforeImage = getCreateBeforeImage(430);
  const afterImage = getCreateAfterImage(selectedDocumentId, 430);
  const processingImage = getCreateProcessingImage(750);
  const resultImage =
    processedUrl ?? getCreateResultImage(430);
  const documentCoverImage = getDocumentCoverImage(selectedDocumentId, 160);

  function sizeLabel() {
    if (!activeDocument) return "-";
    const inchesWidth = activeDocument.dimensions.width_px / activeDocument.dimensions.dpi;
    const inchesHeight = activeDocument.dimensions.height_px / activeDocument.dimensions.dpi;
    const width = Number(inchesWidth.toFixed(2));
    const height = Number(inchesHeight.toFixed(2));
    return `${width} x ${height} in`;
  }

  function backgroundLabel() {
    const value = selectedDocumentDetail?.background_color;
    if (!value) return "White";
    if (value.toUpperCase() === "#FFFFFF") return "White";
    return value;
  }

  const specTitle = `${activeDocument?.name ?? "Document"} Specifications`;
  const issueCodes = new Set(job?.validation?.issues.map((issue) => issue.code) ?? []);
  const allChecksPassed = job?.validation?.passed ?? false;

  function isCheckPassed(codes: readonly string[]) {
    if (codes.length === 0) {
      return true;
    }
    return !codes.some((code) => issueCodes.has(code));
  }

  function photoDimensions() {
    if (!activeDocument) {
      return { width: 2, height: 2, head: 1.23, aspectRatio: 1 };
    }
    const { width_px, height_px, dpi } = activeDocument.dimensions;
    const width = Number((width_px / dpi).toFixed(2));
    const height = Number((height_px / dpi).toFixed(2));
    const headPct =
      selectedDocumentDetail?.head_rules.target_head_height_pct ?? 62;
    const head = Number(((headPct / 100) * height).toFixed(2));
    return {
      width,
      height,
      head,
      aspectRatio: width_px / height_px,
    };
  }

  const dimensions = photoDimensions();
  const pageBackground =
    step === "result" ? "bg-white" : "bg-[#f5f6f7]";

  return (
    <div className={`${pageBackground} py-10 md:py-16`}>
      <div className="container-main max-w-[1220px]">
        <Link
          href="/"
          className="text-sm font-medium text-brand hover:underline"
        >
          ← Back to home
        </Link>

        {error && (
          <div className="mt-6 rounded-lg border border-[#ed5466] bg-[#ffe6e6] px-4 py-3 text-sm text-[#ed5466]">
            {error}
          </div>
        )}

        {step === "document" && (
          <div className="mt-6">
            <div className="grid gap-8 lg:grid-cols-2">
              <section>
                <h1 className="typography-h2 text-[clamp(2rem,4.2vw,3.15rem)]">
                  Choose a document
                </h1>

                <div className="mt-6 rounded-xl border border-[#d9dde2] bg-white p-5 shadow-sm">
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        void handleUpload(file);
                      }
                      event.currentTarget.value = "";
                    }}
                  />

                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-[#7a7f87]">
                      Document type
                    </label>
                    <select
                      value={selectedDocumentId ?? ""}
                      onChange={(event) => setSelectedDocumentId(event.target.value)}
                      className="h-12 w-full rounded-md border border-[#9ac8de] bg-white px-4 text-sm text-navy outline-none"
                    >
                      {documents.map((document) => (
                        <option key={document.id} value={document.id}>
                          {document.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-6 rounded-lg border border-[#e5e7eb] bg-[#f8f9fb] p-4">
                    <div className="flex gap-4">
                      <div className="h-28 w-20 shrink-0 overflow-hidden rounded-md border border-[#dce2e8] bg-white">
                        <OnlineCmsImage
                          src={documentCoverImage}
                          alt={activeDocument?.name ?? "Document preview"}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-[1.75rem] font-semibold leading-tight text-[#222a35]">
                          {activeDocument?.name ?? "Select a document"}
                        </h2>
                        <div className="mt-3 space-y-1.5 border-t border-[#dce2e8] pt-3 text-[1.45rem] text-[#4f5560] [font-size:clamp(14px,1.12vw,22px)]">
                          <p>
                            Size <span className="font-semibold text-[#2f3742]">{sizeLabel()}</span>
                          </p>
                          <p>
                            Resolution{" "}
                            <span className="font-semibold text-[#2f3742]">
                              {activeDocument?.dimensions.dpi ?? 300} dpi
                            </span>
                          </p>
                          <p>
                            Background{" "}
                            <span className="font-semibold text-[#2f3742]">
                              {backgroundLabel()}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    disabled={!selectedDocumentId || loading}
                    onClick={() => inputRef.current?.click()}
                    className="mt-5 h-12 w-full min-w-0 bg-[#4e4bdc] text-base hover:bg-[#3f3ac6]"
                  >
                    {loading ? "Preparing upload..." : "Upload photo"}
                  </Button>
                </div>
              </section>

              <section>
                <h2 className="mt-2 text-[2rem] font-semibold leading-tight text-[#222a35] [font-size:clamp(22px,1.7vw,34px)]">
                  {specTitle}
                </h2>

                <div className="mt-6 grid grid-cols-2 gap-5">
                  <div>
                    <span className="inline-block rounded bg-[#f0f3f6] px-2 py-1 text-xs font-medium text-[#68707d]">
                      Before
                    </span>
                    <div className="mt-2 overflow-hidden rounded-md border border-[#dce2e8] bg-white shadow-sm">
                      <OnlineCmsImage
                        src={beforeImage}
                        alt="Before passport photo sample"
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="inline-block rounded bg-[#f0f3f6] px-2 py-1 text-xs font-medium text-[#68707d]">
                      After
                    </span>
                    <div className="relative mt-2 px-6 pb-2 pt-7">
                      <div className="pointer-events-none absolute left-1/2 top-0 flex -translate-x-1/2 flex-col items-center">
                        <span className="rounded bg-[#4e7cff] px-2 py-0.5 text-xs font-semibold text-white">
                          {dimensions.width} in
                        </span>
                        <span className="mt-1 h-3 w-px bg-[#4e7cff]" />
                      </div>
                      <div className="pointer-events-none absolute right-0 top-1/2 flex -translate-y-1/2 items-center">
                        <span className="h-px w-3 bg-[#4e7cff]" />
                        <span className="rounded bg-[#4e7cff] px-2 py-0.5 text-xs font-semibold text-white">
                          {dimensions.height} in
                        </span>
                      </div>
                      <div className="overflow-hidden rounded-md border-2 border-dashed border-[#4e7cff] bg-white p-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                        <OnlineCmsImage
                          src={afterImage}
                          alt="After passport photo sample"
                          className="aspect-square w-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="mt-8 border-t border-[#e3e7ec] pt-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <TrustpilotBadge />
                <div className="flex items-center gap-2 text-sm text-[#68707d]">
                  <ShieldCheck className="h-5 w-5 text-brand" />
                  <span>
                    Photos taken with us comply with international ICAO standards.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="mt-8 overflow-hidden rounded-[30px] bg-[#f1f2f4] p-6 md:p-10">
            <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
              <section>
                <h1 className="text-[2.4rem] font-semibold leading-tight text-[#1d2340] [font-size:clamp(32px,3.2vw,52px)]">
                  Preparing your photo
                </h1>

                <ol className="mt-7 space-y-6">
                  {PROCESSING_STEPS.map((label, index) => {
                    const isActive = index === activeProcessingStep;
                    const isDone = index < activeProcessingStep;
                    const isPending = index > activeProcessingStep;
                    return (
                      <li key={label} className="flex items-center gap-4">
                        <div className="relative flex h-10 w-10 items-center justify-center">
                          <span
                            className={`absolute left-1/2 top-full h-7 w-px -translate-x-1/2 ${
                              index === PROCESSING_STEPS.length - 1
                                ? "hidden"
                                : "bg-[#d4d6de]"
                            }`}
                          />
                          <span
                            className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold ${
                              isActive
                                ? "border-[#5144dc] bg-[#5144dc] text-white shadow-[0_0_0_3px_rgba(81,68,220,0.15)]"
                                : isDone
                                  ? "border-[#adb3c0] bg-white text-[#9097aa]"
                                  : "border-[#d7dbe5] bg-white text-[#c6cbd7]"
                            }`}
                          >
                            {isActive ? (
                              index + 1
                            ) : (
                              <Check
                                className={`h-5 w-5 ${
                                  isPending ? "text-[#c6cbd7]" : "text-[#9097aa]"
                                }`}
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </div>
                        <span
                          className={`text-[1.75rem] leading-tight [font-size:clamp(24px,2vw,36px)] ${
                            isActive
                              ? "text-[#5144dc]"
                              : isDone
                                ? "text-[#9097aa]"
                                : "text-[#bac0cf]"
                          }`}
                        >
                          {label}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </section>

              <section className="flex justify-center lg:justify-end">
                <div className="relative w-full max-w-[560px] rounded-[34px] bg-[#ececef] p-4 shadow-[0_24px_50px_rgba(0,0,0,0.08)] sm:p-5">
                  <div className="relative overflow-hidden rounded-[24px] bg-white">
                    <OnlineCmsImage
                      src={processingImage}
                      alt="Uploaded photo preview"
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-x-0 top-1/2 h-[74px] -translate-y-1/2 bg-[linear-gradient(90deg,rgba(108,235,200,0),rgba(108,235,200,0.55),rgba(108,235,200,0))]" />
                    <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 border-t border-dashed border-[#28bb8f]/70" />
                  </div>
                  <div className="absolute right-7 top-7 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white/80">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff3c53] text-2xl leading-none text-white">
                      ×
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {step === "result" && job && (
          <div className="mt-8">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
              <section>
                <h1 className="font-serif text-[clamp(2rem,3.8vw,3.4rem)] font-bold leading-tight text-[#1d2340]">
                  {allChecksPassed ? "Initial check passed" : "Initial check needs review"}
                </h1>
                <p className="mt-4 max-w-xl text-[clamp(15px,1.1vw,18px)] leading-relaxed text-[#5d6472]">
                  After checkout, our expert will verify your photo to guarantee it
                  is 100% compliant.
                </p>

                <ul className="mt-8 divide-y divide-[#e3e7ec] border-y border-[#e3e7ec]">
                  {INITIAL_CHECKS.map((check) => {
                    const passed = isCheckPassed(check.codes);
                    return (
                      <li
                        key={check.label}
                        className="flex items-center justify-between gap-4 py-5"
                      >
                        <span className="text-[clamp(16px,1.2vw,22px)] text-[#2f3742]">
                          {check.label}
                        </span>
                        <span
                          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${
                            passed
                              ? "bg-[#e8f8ef] text-[#1f9d63]"
                              : "bg-[#fff3e8] text-[#d97706]"
                          }`}
                        >
                          <Check className="h-4 w-4" aria-hidden="true" />
                          {passed ? "Passed" : "Review"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section className="flex justify-center lg:justify-end">
                <div className="relative w-full max-w-[420px]">
                  {resultImage ? (
                    <div className="relative mx-auto w-[min(100%,320px)]">
                      <div className="absolute -left-10 top-1/2 -translate-y-1/2 text-sm font-medium text-[#2f3742]">
                        {dimensions.height} in
                      </div>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-medium text-[#2f3742]">
                        {dimensions.width} in
                      </div>

                      <div
                        className="relative overflow-hidden rounded-sm border border-[#d9dde2] bg-white shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
                        style={{ aspectRatio: dimensions.aspectRatio }}
                      >
                        <OnlineCmsImage
                          src={resultImage}
                          alt="Processed passport photo"
                          className="h-full w-full object-contain"
                        />
                        <div className="pointer-events-none absolute inset-3 border border-dashed border-white/90" />
                        <div
                          className="pointer-events-none absolute inset-x-3 border-t border-dashed border-[#28bb8f]"
                          style={{ top: "28%" }}
                        />
                        <div className="pointer-events-none absolute right-[-4.5rem] top-[28%] -translate-y-1/2 text-sm font-medium text-[#28bb8f]">
                          {dimensions.head} in
                        </div>
                        <div className="absolute inset-x-0 bottom-0 bg-[#6d6d6d]/75 py-2 text-center text-sm text-white">
                          Passport-Photo.online
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </section>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button
                type="button"
                className="h-[52px] min-w-[240px] flex-1 bg-[#4e4bdc] text-base hover:bg-[#3f3ac6] sm:flex-none"
              >
                Proceed to checkout
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleRetake}
                className="h-[52px] min-w-[200px] flex-1 border-2 border-[#2f3742] bg-white text-base text-[#2f3742] hover:bg-[#f5f6f7] sm:flex-none"
              >
                Retake photo
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
