import { type NextRequest, NextResponse } from "next/server"

// Endpoint interno de Next que llama al módulo 3 (stats) vía API Gateway
export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } },
) {
  try {
    const { code } = params

    if (!code) {
      return NextResponse.json({ error: "URL code is required" }, { status: 400 })
    }

    // URL base del API Gateway (Lambda stats)
    const apiGatewayUrl =
      process.env.NEXT_PUBLIC_API_GATEWAY_URL ??
      "https://4sxlb64vig.execute-api.us-east-1.amazonaws.com"

    const response = await fetch(`${apiGatewayUrl}/stats/${code}`, {
      method: "GET",
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      return NextResponse.json(
        data ?? { error: "Failed to fetch stats" },
        { status: response.status },
      )
    }

    // Devolvemos las estadísticas tal cual vienen del backend
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
