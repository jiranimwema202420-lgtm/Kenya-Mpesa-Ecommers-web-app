
"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn } from "@/app/auth/actions";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, {});

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#eae7e1] bg-white p-8 shadow-sm">
        <Link
          href="/"
          className="text-sm font-semibold text-[#ed6a32] hover:underline"
        >
          ← Mtaa Market
        </Link>

        <h1 className="mt-6 text-3xl font-bold tracking-tight">
          Welcome back
        </h1>

        <p className="mt-2 text-sm text-[#77746e]">
          Sign in to continue shopping.
        </p>

        <form action={formAction} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-[#eae7e1] px-4 py-3 outline-none transition focus:border-[#ed6a32] focus:ring-2 focus:ring-[#ed6a32]/20"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              maxLength={128}
              placeholder="Your password"
              className="w-full rounded-lg border border-[#eae7e1] px-4 py-3 outline-none transition focus:border-[#ed6a32] focus:ring-2 focus:ring-[#ed6a32]/20"
            />
          </div>

          {state.error && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-[#ed6a32] px-4 py-3 font-semibold text-white transition hover:bg-[#d95722] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#77746e]">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#ed6a32] hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
