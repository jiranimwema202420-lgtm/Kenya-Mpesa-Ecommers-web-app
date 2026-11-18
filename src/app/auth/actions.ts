"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthActionResult = {
  error?: string;
  success?: string;
};

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function signUp(
  _previousState: AuthActionResult,
  formData: FormData
): Promise<AuthActionResult> {
  const email = readText(formData, "email").toLowerCase();
  const password = readText(formData, "password");

  if (!isValidEmail(email)) {
    return { error: "Enter a valid email address." };
  }

  if (password.length < 8 || password.length > 128) {
    return { error: "Password must be between 8 and 128 characters." };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_BASE_URL;

  if (!siteUrl) {
    return {
      error: "Signup is not configured yet. Please contact the site administrator.",
    };
  }

  let emailRedirectTo: string;

  try {
    const url = new URL(siteUrl);

    if (
      url.protocol !== "https:" &&
      url.hostname !== "localhost" &&
      url.hostname !== "127.0.0.1"
    ) {
      return { error: "The signup URL configuration is invalid." };
    }

    emailRedirectTo = new URL(
      "/auth/confirm?next=/account",
      url.origin
    ).toString();
  } catch {
    return { error: "The signup URL configuration is invalid." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo },
  });

  if (error) {
    return {
      error: "We couldn't create your account. Check your details and try again.",
    };
  }

  return {
    success:
      "If an account can be created with that email, a confirmation link will be sent. Please check your inbox.",
  };
}

export async function signIn(
  _previousState: AuthActionResult,
  formData: FormData
): Promise<AuthActionResult> {
  const email = readText(formData, "email").toLowerCase();
  const password = readText(formData, "password");

  if (!isValidEmail(email) || !password || password.length > 128) {
    return { error: "Enter a valid email address and password." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Email or password is incorrect." };
  }

  redirect("/account");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
