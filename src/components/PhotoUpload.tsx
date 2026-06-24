"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface PhotoUploadProps {
  disabled?: boolean;
  onUpload: (file: File) => Promise<void>;
}

export function PhotoUpload({ disabled, onUpload }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setPreview(URL.createObjectURL(file));
    setLoading(true);
    try {
      await onUpload(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-dashed border-[#d5d5dc] bg-white p-6">
      {preview ? (
        <div className="mb-4 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Upload preview"
            className="max-h-64 rounded-lg object-contain shadow-photo"
          />
        </div>
      ) : (
        <div className="mb-4 rounded-lg bg-section py-12 text-center text-grey">
          Upload a selfie or portrait photo (JPG or PNG)
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled || loading}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />

      <Button
        type="button"
        disabled={disabled || loading}
        onClick={() => inputRef.current?.click()}
        className="w-full"
      >
        {loading ? "Uploading..." : "Choose photo"}
      </Button>

      {error && <p className="mt-3 text-sm text-[#ed5466]">{error}</p>}
    </div>
  );
}
