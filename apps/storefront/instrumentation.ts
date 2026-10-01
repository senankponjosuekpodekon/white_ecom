export function register() {}

// Next.js 15: appelé pour toute erreur serveur (RSC, route handlers, SSR).
// Log structuré JSON -> docker logs / Render logs.
export async function onRequestError(
  err: { digest?: string } & Error,
  request: {
    path: string
    method: string
    headers: Headers
  },
  context: { routerKind?: string; routePath?: string; routeType?: string }
) {
  console.error(
    JSON.stringify({
      level: "error",
      type: "next.request_error",
      message: err.message,
      digest: err.digest,
      path: request.path,
      method: request.method,
      routePath: context.routePath,
      routeType: context.routeType,
      stack: err.stack,
    })
  )
}
