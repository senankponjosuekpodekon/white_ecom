import type { MinimogSectionProps } from "./types"

type FooterSettings = {
  show_social?: boolean
  newsletter?: boolean
}

export function MinimogFooter({ id, settings }: MinimogSectionProps) {
  const rawSettings = settings as FooterSettings
  const { show_social = true, newsletter = true } = rawSettings ?? {}

  return (
    <footer id={id} className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold mb-4">Atlas Container</h4>
            <p className="text-sm text-gray-400">
              Container kaufen — Schnell, sicher und deutschlandweit geliefert.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Kundenservice</h4>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>Versand</li>
              <li>Rückgabe</li>
              <li>FAQ</li>
            </ul>
          </div>
          {newsletter && (
            <div>
              <h4 className="font-bold mb-4">Newsletter</h4>
              <p className="text-sm text-gray-400 mb-2">Abonnieren Sie unseren Newsletter.</p>
              <input
                type="email"
                placeholder="E-Mail"
                className="w-full px-3 py-2 rounded bg-gray-800 text-white text-sm"
              />
            </div>
          )}
        </div>
        {show_social && (
          <div className="mt-8 pt-8 border-t border-gray-800 flex items-center justify-between">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} Atlas Container Logistik GmbH</p>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>Facebook</span>
              <span>Instagram</span>
              <span>LinkedIn</span>
            </div>
          </div>
        )}
      </div>
    </footer>
  )
}
