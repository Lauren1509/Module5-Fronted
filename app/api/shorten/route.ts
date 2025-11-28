import { type NextRequest, NextResponse } from "next/server"

// Endpoint interno de Next que llama a tu API Gateway (módulo 1)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { longUrl } = body as { longUrl?: string }

    if (!longUrl) {
      return NextResponse.json({ error: "longUrl is required" }, { status: 400 })
    }

    // Validar formato de URL
    try {
      new URL(longUrl)
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format. Use http:// or https://..." },
        { status: 400 },
      )
    }

    // URL base del API Gateway (Lambda shorten)
    const apiGatewayUrl =
      process.env.NEXT_PUBLIC_API_GATEWAY_URL ??
      "https://4sxlb64vig.execute-api.us-east-1.amazonaws.com"

    const response = await fetch(`${apiGatewayUrl}/shorten`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ longUrl }),
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      return NextResponse.json(
        data ?? { error: "Failed to shorten URL" },
        { status: response.status },
      )
    }

    // Devolvemos lo que responde tu Lambda (code, shortUrl, longUrl, createdAt, etc.)
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error shortening URL:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
