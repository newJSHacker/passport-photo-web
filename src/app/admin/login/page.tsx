import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from "@/lib/admin-auth";

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (isValidAdminSession(sessionValue)) {
    redirect("/admin");
  }

  return (
    <div className="bg-page py-12 md:py-16">
      <div className="container-main max-w-md">
        <Link href="/" className="text-sm font-medium text-brand hover:underline">
          ← Back to home
        </Link>
        <section className="mt-6 rounded-xl border border-[#d5d5dc] bg-white p-6 md:p-8">
          <h1 className="typography-h2">Admin Login</h1>
          <p className="mt-3 text-sm leading-6 text-grey">
            Sign in to access the admin dashboard.
          </p>
          <div className="mt-6">
            <AdminLoginForm />
          </div>
        </section>
      </div>
    </div>
  );
}
