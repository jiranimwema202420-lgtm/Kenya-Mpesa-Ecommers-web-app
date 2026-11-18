import "server-only";

type MpesaEnvironment = "sandbox" | "production";

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getMpesaConfig() {
  const environment = requiredEnv("MPESA_ENVIRONMENT");

  if (environment !== "sandbox" && environment !== "production") {
    throw new Error("MPESA_ENVIRONMENT must be sandbox or production");
  }

  const callbackToken = requiredEnv("MPESA_CALLBACK_TOKEN");

  if (!/^[a-f0-9]{64}$/i.test(callbackToken)) {
    throw new Error("MPESA_CALLBACK_TOKEN must be a 64-character hex token");
  }

  const shortcode = requiredEnv("MPESA_SHORTCODE");

  if (!/^\d+$/.test(shortcode)) {
    throw new Error("MPESA_SHORTCODE must contain digits only");
  }

  const config = {
    environment: environment as MpesaEnvironment,
    baseUrl:
      environment === "sandbox"
        ? "https://sandbox.safaricom.co.ke"
        : "https://api.safaricom.co.ke",
    consumerKey: requiredEnv("MPESA_CONSUMER_KEY"),
    consumerSecret: requiredEnv("MPESA_CONSUMER_SECRET"),
    shortcode,
    passkey: requiredEnv("MPESA_PASSKEY"),
    callbackToken,
  };

  return Object.freeze(config);
}
