export async function onRequestGet() {
  const upstreamUrl = "https://mahmoodaldola.com/api/instagram";

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: {
        "Accept": "application/json, text/plain, */*",
        "User-Agent": "Cloudflare-Pages-Instagram-Proxy/1.0"
      }
    });

    const body = await upstream.text();

    return new Response(body, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") || "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=300"
      }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "instagram_proxy_failed",
        message: "Unable to load Instagram posts."
      }),
      {
        status: 502,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store"
        }
      }
    );
  }
}
