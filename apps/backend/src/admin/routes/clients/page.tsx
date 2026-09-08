import { useEffect, useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"

const Clients = () => {
  const [clients, setClients] = useState<string[]>([])
  const [current, setCurrent] = useState<string>("")
  const [newName, setNewName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [created, setCreated] = useState(false)

  const load = () => {
    fetch("/admin/clients")
      .then((res) => res.json())
      .then((data) => {
        setClients(data.clients ?? [])
        setCurrent(data.current ?? "")
      })
      .catch(() => setError("Impossible de charger les clients"))
  }

  useEffect(() => {
    load()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    setLoading(true)
    setError(null)
    setCreated(false)
    try {
      const res = await fetch("/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error ?? "Erreur lors de la création")
      }
      setCreated(true)
      setNewName("")
      load()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "700px" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Clients</h1>
      <p style={{ marginBottom: "1.5rem", color: "#666" }}>
        Chaque client a son propre dossier <code>clients/&lt;nom&gt;/</code> avec sa configuration et son contenu. Le client actif est défini par la variable d&apos;environnement <code>CLIENT_NAME</code>.
      </p>

      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Client actif</h2>
        <p style={{ padding: "0.75rem", background: "#f3f4f6", borderRadius: "6px" }}>
          {current || "default"}
        </p>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Clients existants</h2>
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
        <h2 style={{ fontSize: "1.1rem" }}>Créer un client</h2>
        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
            Nom du client
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
          {loading ? "Création..." : "Créer le client"}
        </button>
        {created && <span style={{ color: "#16a34a" }}>Client créé ! Redémarrez avec CLIENT_NAME=&lt;nom&gt;.</span>}
        {error && <span style={{ color: "#dc2626" }}>{error}</span>}
      </form>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Clients",
  rank: 9,
})

export default Clients
