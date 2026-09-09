import type { MinimogSectionProps, MinimogRegistry } from "./types"
import { MinimogHeader } from "./Header"
import { MinimogFooter } from "./Footer"
import { MinimogSlider } from "./Slider"

type HeaderSettings = {
  sticky_header?: boolean
  transparent_header?: boolean
  header_top?: string
}

type FooterSettings = {
  show_social?: boolean
  newsletter?: boolean
}

export function MinimogFallback({ id, settings, design }: MinimogSectionProps) {
  return (
    <section id={id} className="py-12 bg-gray-50 border-y border-gray-200">
      <div className="container mx-auto px-4">
        <p className="text-sm text-gray-500 mb-2">Section non encore convertie : <strong>{id}</strong></p>
        <p className="text-xs text-gray-400">design={design ?? "default"}</p>
        <pre className="text-xs mt-2 p-2 bg-white rounded overflow-auto">{JSON.stringify(settings, null, 2)}</pre>
      </div>
    </section>
  )
}

export function createRegistry(locale: string): MinimogRegistry {
  return {
    header: (props) => (
      <MinimogHeader
        id={props.id}
        settings={props.settings as HeaderSettings}
        locale={props.locale ?? locale}
      />
    ),
    footer: (props) => (
      <MinimogFooter
        id={props.id}
        settings={props.settings as FooterSettings}
      />
    ),
    slider: (props) => (
      <MinimogSlider
        id={props.id}
        settings={props.settings}
        blocks={props.blocks}
        blockOrder={props.blockOrder}
        design={props.design}
      />
    ),
    "scrolling-promotion": (props) => <MinimogFallback {...props} />,
    "featured-collection": (props) => <MinimogFallback {...props} />,
    "banner-with-slider": (props) => (
      <MinimogSlider
        id={props.id}
        settings={props.settings}
        blocks={props.blocks}
        blockOrder={props.blockOrder}
        design={props.design}
      />
    ),
    announcement: (props) => <MinimogFallback {...props} />,
    collection: (props) => <MinimogFallback {...props} />,
    product: (props) => <MinimogFallback {...props} />,
  }
}
