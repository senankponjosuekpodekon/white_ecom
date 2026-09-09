import type { MinimogSection, MinimogRegistry, MinimogSectionProps } from "./types"

export type MinimogSectionRendererProps = {
  sections: MinimogSection[]
  registry: MinimogRegistry
}

export function MinimogSectionRenderer({ sections, registry }: MinimogSectionRendererProps) {
  return (
    <>
      {sections
        .filter((s) => s.enabled !== false)
        .map((section) => {
          const Component = registry[section.type]
          if (!Component) {
            return (
              <section key={section.id} id={section.id} className="py-8 border-y border-dashed border-gray-300">
                <div className="container mx-auto px-4">
                  <p className="text-sm text-red-500">Type inconnu : {section.type}</p>
                </div>
              </section>
            )
          }
          const props: MinimogSectionProps = {
            id: section.id,
            settings: section.settings ?? {},
            blocks: section.blocks,
            blockOrder: section.block_order,
            design: section.design,
          }
          return <Component key={section.id} {...props} />
        })}
    </>
  )
}
