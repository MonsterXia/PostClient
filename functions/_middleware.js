const PURE_TEXT_ROUTE = /^\/pureText\/([^/]+)\/?$/i
const PURE_TEXT_EXTENSIONS = ['.txt', '.cfg']

function getCandidates(fileName) {
  const hasSupportedExtension = PURE_TEXT_EXTENSIONS.some((extension) =>
    fileName.toLowerCase().endsWith(extension),
  )

  return hasSupportedExtension
    ? [fileName]
    : PURE_TEXT_EXTENSIONS.map((extension) => `${fileName}${extension}`)
}

export async function onRequest(context) {
  if (context.request.method !== 'GET') {
    return context.next()
  }

  const requestUrl = new URL(context.request.url)
  const match = PURE_TEXT_ROUTE.exec(requestUrl.pathname)

  if (!match) {
    return context.next()
  }

  let fileName
  try {
    fileName = decodeURIComponent(match[1])
  } catch {
    return context.next()
  }

  for (const candidate of getCandidates(fileName)) {
    const assetUrl = new URL(
      `/pureTextFiles/${encodeURIComponent(candidate)}`,
      requestUrl,
    )
    const assetResponse = await context.env.ASSETS.fetch(assetUrl)
    const contentType = assetResponse.headers
      .get('Content-Type')
      ?.toLowerCase()

    if (!assetResponse.ok || contentType?.startsWith('text/html')) {
      continue
    }

    const headers = new Headers(assetResponse.headers)
    headers.set('Content-Type', 'text/plain; charset=utf-8')
    headers.set('Content-Disposition', 'inline')

    return new Response(assetResponse.body, {
      status: assetResponse.status,
      headers,
    })
  }

  return context.next()
}
