
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/login");
  }

  const email =
    typeof data.claims.email === "string"
      ? data.claims.email
      : "Your account";

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-[#eae7e1] bg-white p-8 shadow-sm">
        <Link
          href="/"
          className="text-sm font-semibold text-[#ed6a32] hover:underline"
        >
          ← Mtaa Market
        </Link>

        <h1 className="mt-6 text-3xl font-bold tracking-tight">
          My account
        </h1>

        <p className="mt-2 text-sm text-[#77746e]">
          Welcome to your Mtaa Market account.
        </p>

        <div className="mt-8 rounded-xl bg-[#faf9f6] p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#77746e]">
            Signed in as
          </p>
          <p className="mt-2 break-all font-medium">{email}</p>
        </div>

        <form action={signOut} className="mt-6">
          <button
            type="submit"
            className="w-full rounded-lg bg-[#ed6a32] px-4 py-3 font-semibold text-white transition hover:bg-[#d95722]"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
