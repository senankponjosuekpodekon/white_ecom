import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.error(
      JSON.stringify({
        level: "error",
        type: "client.error",
        message: typeof body?.message === "string" ? body.message.slice(0, 500) : "",
        digest: typeof body?.digest === "string" ? body.digest : undefined,
        url: typeof body?.url === "string" ? body.url.slice(0, 300) : "",
        stack:
          typeof body?.stack === "string" ? body.stack.slice(0, 2000) : undefined,
        userAgent: req.headers.get("user-agent") ?? "",
      })
    )
  } catch {
    // never fail
  }
  return NextResponse.json({ ok: true })
}
