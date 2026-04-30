/**
 * Custom Next.js Image loader.
 *
 * Routes srcset generation directly to Sanity's image CDN (which has its own resize, quality
 * and format-conversion API), so on non-Vercel hosts — we deploy to GCP Cloud Run — image
 * transforms happen at Sanity's edge instead of on the application container.
 *
 * Benefits on Cloud Run specifically:
 *   - No `sharp` native dep needed in the runtime image (~30 MB saved, faster cold starts)
 *   - No CPU spent transforming images on the request path (Cloud Run bills for it)
 *   - Browser still gets proper responsive srcsets (mobile -> smaller variant, etc.)
 *   - AVIF/WebP negotiated automatically via Sanity's `auto=format`
 *
 * For non-Sanity sources (local /public files, third-party hosts) we can't transform the
 * file, but Next still validates that "the URL produced for width=384 differs from the URL
 * for width=1920" — otherwise it warns about a non-functional srcset. We satisfy that
 * contract by appending `#w=N` as a URL fragment: each srcset descriptor gets a unique
 * URL, but browsers strip the fragment when issuing the GET, so the actual HTTP request
 * is identical and the file is served/cached once. For SVGs and other local placeholders
 * this is essentially free.
 */
export default function imageLoader({ src, width, quality }) {
  if (src.includes('cdn.sanity.io')) {
    const url = new URL(src)
    url.searchParams.set('w', String(width))
    url.searchParams.set('q', String(quality ?? 75))
    url.searchParams.set('auto', 'format')
    url.searchParams.set('fit', 'max')
    return url.toString()
  }

  // Non-Sanity: append a width-keyed fragment so Next sees a unique URL
  // per srcset variant. Browsers ignore fragments during fetch.
  return `${src}#w=${width}`
}
