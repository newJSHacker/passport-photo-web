"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { detail?: string }
          | null;
        setError(payload?.detail ?? "Login failed");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Could not reach login endpoint");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={(event) => void onSubmit(event)}>
      <div className="space-y-1.5">
        <label htmlFor="admin-username" className="text-sm font-medium text-navy">
          Username
        </label>
        <input
          id="admin-username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="h-11 w-full rounded-md border border-[#d5d5dc] px-3 text-sm text-navy outline-none focus:border-brand"
          required
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="admin-password" className="text-sm font-medium text-navy">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-11 w-full rounded-md border border-[#d5d5dc] px-3 text-sm text-navy outline-none focus:border-brand"
          required
        />
      </div>
      {error ? (
        <div className="rounded-lg border border-[#ed5466] bg-[#ffe6e6] px-4 py-3 text-sm text-[#ed5466]">
          {error}
        </div>
      ) : null}
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
