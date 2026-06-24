function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#00b67a]" aria-hidden>
      <path d="M12 1.5l2.9 6.1 6.8.6-5.1 4.5 1.5 6.6L12 16.9 5.9 19.3l1.5-6.6-5.1-4.5 6.8-.6L12 1.5z" />
    </svg>
  );
}

export function TrustpilotBadge() {
  return (
    <div className="flex flex-col items-center gap-3 lg:items-start">
      <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
        <span className="text-sm font-semibold text-navy">Excellent</span>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} />
          ))}
        </div>
      </div>
      <p className="text-sm text-grey">
        <span className="font-semibold text-navy">19,692</span> reviews on{" "}
        <span className="font-semibold text-[#00b67a]">Trustpilot</span>
      </p>
    </div>
  );
}
