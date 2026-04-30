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
 * For non-Sanity sources (local /public files, third-party hosts) the loader passes the src
 * through unchanged — Next/Image then renders it as a plain <img> with that single URL.
 */
export default function imageLoader({ src, width, quality }) {
  if (!src.includes('cdn.sanity.io')) {
    return src
  }
  const url = new URL(src)
  url.searchParams.set('w', String(width))
  url.searchParams.set('q', String(quality ?? 75))
  url.searchParams.set('auto', 'format')
  url.searchParams.set('fit', 'max')
  return url.toString()
}
