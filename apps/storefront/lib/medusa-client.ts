import Medusa from "@medusajs/js-sdk";

// Server-side calls need an absolute URL (MEDUSA_BACKEND_URL inside Docker,
// localhost for local dev). In production, browser calls default to
// same-origin so they hit the reverse proxy (Traefik routes /store/* to the
// backend on the domain). In dev, the browser falls back to localhost:9000.
const baseUrl =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ??
  process.env.MEDUSA_BACKEND_URL ??
  (process.env.NODE_ENV === "production" && typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:9000");

export const medusaClient = new Medusa({
  baseUrl,
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  auth: {
    type: "session",
  },
  debug: process.env.NODE_ENV === "development",
});
