import "server-only";

import { Buffer } from "node:buffer";
import { getMpesaConfig } from "./config";

type CachedToken = {
  accessToken: string;
  expiresAt: number;
};

let cachedToken: CachedToken | null = null;
let tokenRequest: Promise<string> | null = null;

async function requestAccessToken(): Promise<string> {
  const config = getMpesaConfig();

  const credentials = Buffer.from(
    `${config.consumerKey}:${config.consumerSecret}`
  ).toString("base64");

  const response = await fetch(
    `${config.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    }
  );

  if (!response.ok) {
    throw new Error(`Daraja OAuth request failed (${response.status})`);
  }

  const data: unknown = await response.json();

  if (
    typeof data !== "object" ||
    data === null ||
    !("access_token" in data) ||
    typeof data.access_token !== "string" ||
    !("expires_in" in data)
  ) {
    throw new Error("Daraja returned an invalid OAuth response");
  }

  const expiresIn = Number(data.expires_in);

  if (!Number.isFinite(expiresIn) || expiresIn <= 60) {
    throw new Error("Daraja returned an invalid token expiry");
  }

  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + (expiresIn - 60) * 1000,
  };

  return cachedToken.accessToken;
}

export async function getMpesaAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.accessToken;
  }

  if (!tokenRequest) {
    tokenRequest = requestAccessToken();
  }

  try {
    return await tokenRequest;
  } finally {
    tokenRequest = null;
  }
}
