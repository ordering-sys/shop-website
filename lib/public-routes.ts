export type PublicSearchParams = Record<string, string | string[] | undefined>

/** Legacy routes forward to a configured owner app, never a query-string URL. */
export function ownerPageHref(path: string[], params: PublicSearchParams, ownerSiteUrl?: string, serviceSiteUrl?: string): string | null {
  const simple = path.length === 1 && ['order', 'about', 'contact', 'map'].includes(path[0])
  const tracking = path.length === 2 && path[0] === 'tracking' && /^[a-zA-Z0-9-]+$/.test(path[1])
  if (!simple && !tracking) return null
  let destination: URL
  try {
    destination = new URL(ownerSiteUrl ?? '')
    if (!['http:', 'https:'].includes(destination.protocol) || destination.username || destination.password) return null
    if (serviceSiteUrl && destination.origin === new URL(serviceSiteUrl).origin) return null
  } catch { return null }
  destination.pathname = '/' + path.map(encodeURIComponent).join('/')
  destination.search = ''
  destination.hash = ''
  for (const key of ['table', 'token'] as const) {
    const value = params[key]
    if (value !== undefined) destination.searchParams.set(key, Array.isArray(value) ? value[0] ?? '' : value)
  }
  return destination.href
}

export function isLegacyShopPath(path: string[]): boolean {
  return (path.length === 1 && ['order', 'about', 'contact', 'map'].includes(path[0])) ||
    (path.length === 2 && path[0] === 'tracking' && /^[a-zA-Z0-9-]+$/.test(path[1]))
}
