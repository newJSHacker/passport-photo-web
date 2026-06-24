import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  href?: string;
  showTagline?: boolean;
  className?: string;
}

export function Logo({ href = "/", showTagline = true, className = "" }: LogoProps) {
  const content = (
    <>
      <Image
        src="/aaaid-logo.png"
        alt="AAA ID"
        width={120}
        height={44}
        className="h-9 w-auto flex-shrink-0 sm:h-10"
        priority
      />
      {showTagline && (
        <span className="hidden min-w-0 truncate font-sans text-lg font-light text-[#666] sm:inline sm:text-xl lg:text-2xl">
          Digital Passport Photos
        </span>
      )}
    </>
  );

  const classes = `flex min-w-0 max-w-full items-center gap-3 sm:gap-4 ${className}`;

  if (href) {
    return (
      <Link href={href} className={`${classes} hover:opacity-90`} aria-label="Digital Passport Photos home">
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}
