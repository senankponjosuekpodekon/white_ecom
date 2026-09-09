import { locales, defaultLocale, type Locale } from "@/i18n"
import { MinimogSectionRenderer } from "@/components/minimog/SectionRenderer"
import { createRegistry } from "@/components/minimog/registry"

export const dynamic = "force-dynamic"

export default async function MinimogHome({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale

  const sections = [
    {
      id: "minimog-header",
      type: "header",
      enabled: true,
      settings: { sticky_header: true },
    },
    {
      id: "sf-home__slideshow",
      type: "slider",
      enabled: true,
      design: "default",
      settings: {
        container: "w-full",
        slideshow_height: "large",
        show_overlay: true,
        dots_position: "right",
        dots_color: "light",
        show_dots: true,
        show_arrows: false,
        autorotate: false,
        autorotate_speed: 6,
        use_content_above: true,
        custom_class: "sf-home__slideshow",
        animations: "fade-in",
      },
      blocks: {
        "slide-0": {
          type: "slider_item",
          settings: {
            background: "https://images.unsplash.com/photo-1591533985794-4b172c7b0b87?q=80&w=1920&auto=format&fit=crop",
            content_in_container: false,
            content_position: "left middle",
            text_alignment: "left",
            text_size: "medium",
            text_color: "white",
            subheading: "Willkommen bei",
            title: "Container kaufen",
            description: "<p>Schnell, sicher und deutschlandweit geliefert.</p>",
            image_link: "",
            button_text: "Container entdecken",
            button_link: `/${locale}/collections`,
            button_style: "m-button--white",
            button_size: "",
            second_button_text: "",
            second_button_link: "",
            second_button_style: "m-button--primary",
            second_button_size: "",
            show_footer: false,
            footer_alignment: "end",
            footer_text: "",
            footer_button: "",
            footer_link: "",
            enable_preload_image: false,
          },
        },
      },
      block_order: ["slide-0"],
    },
    {
      id: "minimog-featured-collection",
      type: "featured-collection",
      enabled: true,
      settings: { title: "Beliebte Container" },
    },
    {
      id: "minimog-footer",
      type: "footer",
      enabled: true,
      settings: { show_social: true, newsletter: true },
    },
  ]

  const registry = createRegistry(locale)

  return (
    <MinimogSectionRenderer sections={sections} registry={registry} />
  )
}
