const PURE_TEXT_ROUTE = /^\/pureText\/([^/]+)\/?$/i
const PURE_TEXT_EXTENSIONS = ['.txt', '.cfg'] as const

export function getPureTextFileName(pathname: string): string | null {
  const match = PURE_TEXT_ROUTE.exec(pathname)

  if (!match) {
    return null
  }

  try {
    return decodeURIComponent(match[1])
  } catch {
    return null
  }
}

export async function renderPureText(fileName: string): Promise<boolean> {
  const hasSupportedExtension = PURE_TEXT_EXTENSIONS.some((extension) =>
    fileName.toLowerCase().endsWith(extension),
  )
  const candidates = hasSupportedExtension
    ? [fileName]
    : PURE_TEXT_EXTENSIONS.map((extension) => `${fileName}${extension}`)

  for (const candidate of candidates) {
    try {
      const response = await fetch(
        `/pureTextFiles/${encodeURIComponent(candidate)}`,
      )
      const contentType = response.headers.get('content-type')?.toLowerCase()

      if (!response.ok || contentType?.startsWith('text/html')) {
        continue
      }

      const text = await response.text()
      document.documentElement.replaceChildren(document.createTextNode(text))
      document.documentElement.style.whiteSpace = 'pre-wrap'
      return true
    } catch {
      continue
    }
  }

  return false
}
