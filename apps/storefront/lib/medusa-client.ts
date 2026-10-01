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

// Server + public catalog calls: no JWT storage (localStorage is browser-only).
export const medusaClient = new Medusa({
  baseUrl: getBaseUrl(),
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  debug: process.env.NODE_ENV === "development",
});

// Browser-only client for customer auth (login/register/account/orders):
// JWT in localStorage avoids cross-domain cookie issues (Vercel <-> Render).
export const medusaClientAuth = new Medusa({
  baseUrl: getBaseUrl(),
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  auth: {
    type: "jwt",
    jwtTokenStorageKey: "medusa_auth_token",
    jwtTokenStorageMethod: "local",
  },
});
