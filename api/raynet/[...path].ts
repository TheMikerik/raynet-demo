import type { VercelRequest, VercelResponse } from '@vercel/node'

// Server-side proxy for the Raynet CRM REST API.

const RAYNET_BASE_URL = process.env.RAYNET_BASE_URL ?? 'https://app.raynet.cz/api/v2'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res
      .status(405)
      .json({ error: 'Method not allowed — this proxy only forwards read (GET) requests.' })
    return
  }

  const { RAYNET_API_USER, RAYNET_API_KEY, RAYNET_INSTANCE_NAME } = process.env
  if (!RAYNET_API_USER || !RAYNET_API_KEY || !RAYNET_INSTANCE_NAME) {
    res.status(500).json({
      error:
        'Server misconfigured: missing RAYNET_API_USER / RAYNET_API_KEY / RAYNET_INSTANCE_NAME.',
    })
    return
  }

  // vercel dev's local emulation delivers the catch-all segment as `...path`, while
  // production Vercel delivers it as `path` — accept either.
  const { path, '...path': dotsPath, ...queryParams } = req.query
  const rawPath = path ?? dotsPath
  const pathSegments = Array.isArray(rawPath) ? rawPath : [rawPath].filter(Boolean)

  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(queryParams)) {
    for (const v of Array.isArray(value) ? value : [value]) {
      if (v !== undefined) search.append(key, v)
    }
  }
  const queryString = search.toString()
  const targetUrl = `${RAYNET_BASE_URL}/${pathSegments.join('/')}/${queryString ? `?${queryString}` : ''}`

  const basicAuth = Buffer.from(`${RAYNET_API_USER}:${RAYNET_API_KEY}`).toString('base64')

  let upstream: Response
  try {
    upstream = await fetch(targetUrl, {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'X-Instance-Name': RAYNET_INSTANCE_NAME,
        Accept: 'application/json',
      },
    })
  } catch {
    res.status(502).json({ error: 'Could not reach the Raynet API.' })
    return
  }

  const body = await upstream.text()
  res.status(upstream.status)
  res.setHeader('Content-Type', upstream.headers.get('content-type') ?? 'application/json')
  res.send(body)
}
