import Medusa from "@medusajs/js-sdk";

// Runtime config injected by the server layout (window.__PUBLIC_CONFIG__).
// Lets the browser bundle use the per-deployment env even though
// NEXT_PUBLIC_* values are inlined at build time.
declare global {
  interface Window {
    __PUBLIC_CONFIG__?: {
      medusaBackendUrl?: string;
      medusaPublishableKey?: string;
    };
  }
}

function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return (
      window.__PUBLIC_CONFIG__?.medusaBackendUrl ??
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ??
      "http://localhost:9000"
    );
  }
  return (
    process.env.MEDUSA_BACKEND_URL ??
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ??
    "http://localhost:9000"
  );
}

function getPublishableKey(): string | undefined {
  if (typeof window !== "undefined") {
    return (
      window.__PUBLIC_CONFIG__?.medusaPublishableKey ??
      process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
    );
  }
  return process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
}

// Server + public catalog calls: no JWT storage (localStorage is browser-only).
export const medusaClient = new Medusa({
  baseUrl: getBaseUrl(),
  publishableKey: getPublishableKey(),
  debug: process.env.NODE_ENV === "development",
});

// Browser-only client for customer auth (login/register/account/orders):
// JWT in localStorage avoids cross-domain cookie issues (Vercel <-> Render).
export const medusaClientAuth = new Medusa({
  baseUrl: getBaseUrl(),
  publishableKey: getPublishableKey(),
  auth: {
    type: "jwt",
    jwtTokenStorageKey: "medusa_auth_token",
    jwtTokenStorageMethod: "local",
  },
});
