import { NextRequest, NextResponse } from "next/server";

function buildProxyHealthUrl() {
  const domain = process.env.GHZ_AI_API_DOMAIN?.trim();
  if (!domain) return null;
  const baseUrl = domain.startsWith("http") ? domain : `https://${domain}`;
  return `${baseUrl}/api/v2/ai`;
}

export async function GET(_request: NextRequest) {
  const url = buildProxyHealthUrl();
  const apiKey = process.env.GHZ_AI_API_KEY?.trim();

  if (!url || !apiKey) {
    return NextResponse.json(
      { ok: false, message: "Proxy not configured. Set GHZ_AI_API_DOMAIN and GHZ_AI_API_KEY." },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
      },
      cache: "no-store",
    });

    const limit = res.headers.get("x-ratelimit-limit") || undefined;
    const remaining = res.headers.get("x-ratelimit-remaining") || undefined;
    const reset = res.headers.get("x-ratelimit-reset") || undefined;

    const body = await res.json().catch(() => ({}));

    return NextResponse.json(
      {
        ok: res.ok,
        status: res.status,
        rateLimit: { limit, remaining, reset },
        upstream: body,
      },
      { status: res.ok ? 200 : res.status }
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Failed to reach AI proxy", error: (error as Error).message },
      { status: 502 }
    );
  }
}



