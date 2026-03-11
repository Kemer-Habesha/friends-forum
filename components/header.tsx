import { sanityFetch, siteSettingsQuery, urlFor } from "@/lib/sanity"
import HeaderNav from "@/components/header-nav"

export default async function Header() {
  const data = await sanityFetch<any>(siteSettingsQuery)

  const logoUrl = data?.logo ? urlFor(data.logo).url() : "/placeholder-logo.png"
  const siteTitle = data?.title || "FRIENDS Forum"
  const menuItems = data?.navigation?.menuItems || null

  return (
    <HeaderNav
      logoUrl={logoUrl}
      siteTitle={siteTitle}
      menuItems={menuItems}
    />
  )
}
