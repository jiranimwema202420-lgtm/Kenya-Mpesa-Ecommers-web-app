
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function safeNextPath(value: string | null): string {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return "/account";
  }

  try {
    const url = new URL(value, "https://internal.invalid");

    if (url.origin !== "https://internal.invalid") {
      return "/account";
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/account";
  }
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;

  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=confirmation", origin)
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL("/login?error=confirmation", origin)
    );
  }

  return NextResponse.redirect(new URL(next, origin));
}
