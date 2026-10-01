import { useEffect, useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"

const Clients = () => {
  const [clients, setClients] = useState<string[]>([])
  const [current, setCurrent] = useState<string>("")
  const [newName, setNewName] = useState("")
  const [newDomain, setNewDomain] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [provision, setProvision] = useState<string | null>(null)

  const load = () => {
    fetch("/admin/clients")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
          return
        }
        setClients(data.clients ?? [])
        setCurrent(data.current ?? "")
      })
      .catch(() => setError("Impossible de charger les boutiques"))
  }

  useEffect(() => {
    load()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    setLoading(true)
    setError(null)
    setProvision(null)
    try {
      const res = await fetch("/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          domain: newDomain.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error ?? "Erreur lors de la création")
      }
      setProvision(data.provision ?? `./scripts/provision-client.sh ${newName.trim()}`)
      setNewName("")
      setNewDomain("")
      load()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "700px" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Boutiques</h1>
      <p style={{ marginBottom: "1.5rem", color: "#666" }}>
        Chaque boutique white-label a son propre dossier <code>clients/&lt;nom&gt;/</code> avec sa configuration et son contenu. La boutique active est définie par la variable d&apos;environnement <code>CLIENT_NAME</code>.
      </p>
      <p style={{ marginBottom: "1.5rem", color: "#666" }}>
        Accès réservé au <strong>super-admin</strong> (<code>SUPER_ADMIN_EMAIL</code>).
      </p>

      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Client actif</h2>
        <p style={{ padding: "0.75rem", background: "#f3f4f6", borderRadius: "6px" }}>
          {current || "default"}
        </p>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Boutiques existantes</h2>
        {clients.length === 0 ? (
          <p>Aucun client pour le moment.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {clients.map((client) => (
              <li
                key={client}
                style={{
                  padding: "0.75rem",
                  borderBottom: "1px solid #e5e7eb",
                  background: client === current ? "#e0f2fe" : "white",
                  borderRadius: "6px",
                  marginBottom: "0.5rem",
                }}
              >
                {client} {client === current && "(actif)"}
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h2 style={{ fontSize: "1.1rem" }}>Créer une boutique</h2>
        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
            Nom de la boutique
          </label>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="mon-client"
            style={{
              width: "100%",
              padding: "0.5rem",
              fontSize: "14px",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
            }}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
            Domaine (optionnel)
          </label>
          <input
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            placeholder="boutique-exemple.com"
            style={{
              width: "100%",
              padding: "0.5rem",
              fontSize: "14px",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.5rem 1.5rem",
            background: "#111827",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Création..." : "Créer la boutique"}
        </button>
        {error && <span style={{ color: "#dc2626" }}>{error}</span>}
      </form>

      {provision && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "6px",
          }}
        >
          <p style={{ marginBottom: "0.5rem", fontWeight: 600 }}>
            Boutique créée. Pour la provisionner (base, migrations, seed, clés,
            storefront), lancez sur le serveur :
          </p>
          <code
            style={{
              display: "block",
              padding: "0.75rem",
              background: "#111827",
              color: "#e5e7eb",
              borderRadius: "6px",
              fontSize: "13px",
              userSelect: "all",
            }}
          >
            {provision}
          </code>
          <p style={{ marginTop: "0.5rem", fontSize: "13px", color: "#666" }}>
            Le script attend que la base soit prête, applique les migrations et
            le seed, récupère la clé publishable et l'injecte dans{" "}
            <code>clients/&lt;nom&gt;/.env.storefront</code>.
          </p>
        </div>
      )}
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Boutiques",
  rank: 9,
})

export default Clients
