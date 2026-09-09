import Medusa from "@medusajs/js-sdk";

function getBaseUrl(): string {
  if (typeof window === "undefined") {
    return (
      process.env.MEDUSA_BACKEND_URL ??
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ??
      "http://localhost:9000"
    );
  }
  return (
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000"
  );
}

export const medusaClient = new Medusa({
  baseUrl: getBaseUrl(),
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  auth: {
    type: "session",
  },
  debug: process.env.NODE_ENV === "development",
});
