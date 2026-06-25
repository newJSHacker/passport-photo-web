"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CheckoutCancelPage() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("job_id");
  const checkoutHref = jobId ? `/checkout?job=${jobId}` : "/create";

  return (
    <div className="bg-page py-10 md:py-14">
      <div className="container-main max-w-lg text-center">
        <h1 className="typography-h2">Checkout cancelled</h1>
        <p className="mt-4 text-base text-grey">
          No charge was made. You can return to checkout when you are ready.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="h-[52px] min-w-[200px] bg-[#4e4bdc] hover:bg-[#3f3ac6]">
            <Link href={checkoutHref}>Try again</Link>
          </Button>
          <Button asChild variant="outline" className="h-[52px]">
            <Link href="/create">Back to create</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
