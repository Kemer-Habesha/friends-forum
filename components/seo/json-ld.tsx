/**
 * Inline JSON-LD structured data.
 *
 * Renders a `<script type="application/ld+json">` block from a plain JS object.
 * Google's rich results parser (and Bing/Yandex) read this server-rendered HTML
 * directly, so this works on any server component without extra hydration.
 *
 * Usage:
 *   <JsonLd schema={{ "@context": "https://schema.org", "@type": "Organization", ... }} />
 *
 * Multiple unrelated schemas can either be passed as separate <JsonLd /> elements
 * or combined into a single `@graph` array — both are valid per schema.org spec.
 */

type Schema = Record<string, unknown> | Array<Record<string, unknown>>

export function JsonLd({ schema, id }: { schema: Schema; id?: string }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify produces a clean string with no executable JS,
      // and React escapes it before injection — safe to use here.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      id={id}
    />
  )
}
