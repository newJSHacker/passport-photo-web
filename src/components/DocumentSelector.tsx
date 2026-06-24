"use client";

import type { DocumentSpec } from "@/lib/api";

interface DocumentSelectorProps {
  documents: DocumentSpec[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function DocumentSelector({
  documents,
  selectedId,
  onSelect,
}: DocumentSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {documents.map((doc) => {
        const selected = doc.id === selectedId;
        return (
          <button
            key={doc.id}
            type="button"
            onClick={() => onSelect(doc.id)}
            className={`rounded-lg border p-4 text-left transition ${
              selected
                ? "border-brand bg-brand/5 ring-2 ring-brand"
                : "border-[#d5d5dc] bg-white hover:border-brand/40"
            }`}
          >
            <div className="font-semibold text-navy">{doc.name}</div>
            <div className="mt-1 text-sm text-grey">
              {doc.dimensions.width_px}×{doc.dimensions.height_px}px ·{" "}
              {doc.document_type}
            </div>
          </button>
        );
      })}
    </div>
  );
}
