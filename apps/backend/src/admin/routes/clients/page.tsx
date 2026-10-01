import { useEffect, useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"

type ClientRow = {
  id: string
  slug: string
  name: string
  contact_email?: string | null
  status: string
  domains?: string[] | null
  publishable_key?: string | null
  storefront_url?: string | null
  error?: string | null
  created_at?: string
}

const statusColors: Record<string, string> = {
  pending: "#b45309",
  provisioning: "#1d4ed8",
  active: "#15803d",
  suspended: "#6b7280",
  rejected: "#6b7280",
  failed: "#b91c1c",
}

const statusLabel: Record<string, string> = {
  pending: "En attente",
  provisioning: "Provisioning…",
  active: "Actif",
  suspended: "Suspendu",
  rejected: "Rejeté",
  failed: "Échec",
}

const btn = (primary = false): React.CSSProperties => ({
  padding: "0.25rem 0.75rem",
  fontSize: "13px",
  background: primary ? "#111827" : "white",
  color: primary ? "white" : "#111827",
  border: primary ? "none" : "1px solid #d1d5db",
  borderRadius: "6px",
  cursor: "pointer",
})

const Clients = () => {
  const [clients, setClients] = useState<ClientRow[]>([])
  const [fileClients, setFileClients] = useState<string[]>([])
  const [current, setCurrent] = useState<string>("")
  const [newName, setNewName] = useState("")
  const [newDomain, setNewDomain] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = () => {
    fetch("/admin/clients")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
          return
        }
        setClients(data.clients ?? [])
        setFileClients(data.fileClients ?? [])
        setCurrent(data.current ?? "")
      })
      .catch(() => setError("Impossible de charger les boutiques"))
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 15000)
    return () => clearInterval(interval)
  }, [])

  const call = async (
    client: ClientRow,
    action: () => Promise<Response>,
    doneMessage: string
  ) => {
    setBusyId(client.id)
    setError(null)
    setNotice(null)
    try {
      const res = await action()
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error ?? "Action impossible")
      }
      setNotice(doneMessage)
      load()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusyId(null)
    }
  }

  const provision = (client: ClientRow) =>
    call(
      client,
      () =>
        fetch("/admin/clients/provision", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: client.slug,
            name: client.name,
            contact_email: client.contact_email ?? undefined,
            domain: client.domains?.[0],
          }),
        }),
      `${client.slug} provisionné : canal + clé publishable créés${client.status === "pending" ? ", demande approuvée" : ""}.`
    )

  const setStatus = (client: ClientRow, status: string, label: string) =>
    call(
      client,
      () =>
        fetch(`/admin/clients/${client.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }),
      `${client.slug} : ${label}.`
    )

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    setLoading(true)
    setError(null)
    setNotice(null)
    try {
      const res = await fetch("/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          domain: newDomain.trim() || undefined,
          contact_email: newEmail.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error ?? "Erreur lors de la création")
      }
      const c = data.client
      setNotice(
        `Boutique "${c.slug}" provisionnée — storefront : ${c.storefront_url ?? "à déployer"}, clé : ${c.publishable_key ?? "n/a"}`
      )
      setNewName("")
      setNewDomain("")
      setNewEmail("")
      load()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const pending = clients.filter((c) => c.status === "pending")
  const others = clients.filter((c) => c.status !== "pending")

  return (
    <div style={{ padding: "2rem", maxWidth: "860px" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Boutiques</h1>
      <p style={{ marginBottom: "1.5rem", color: "#666" }}>
        Multi-clients mutualisé : chaque boutique a son sales channel et sa clé
        publishable. Le storefront est déployé sur Vercel quand{" "}
        <code>VERCEL_TOKEN</code>/<code>VERCEL_GIT_REPO</code> sont configurés.
        Boutique locale active : <code>{current || "default"}</code>.
      </p>

      {pending.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
            Demandes en attente ({pending.length})
          </h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {pending.map((client) => (
              <li
                key={client.id}
                style={{
                  padding: "0.75rem",
                  border: "1px solid #fbbf24",
                  background: "#fffbeb",
                  borderRadius: "6px",
                  marginBottom: "0.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>
                  <strong>{client.name}</strong> ({client.slug}) —{" "}
                  {client.contact_email ?? "pas d'email"}
                  {client.domains?.length ? ` — ${client.domains.join(", ")}` : ""}
                </span>
                <span style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    style={btn(true)}
                    disabled={busyId === client.id}
                    onClick={() => provision(client)}
                  >
                    Approuver + provisionner
                  </button>
                  <button
                    style={btn()}
                    disabled={busyId === client.id}
                    onClick={() => setStatus(client, "rejected", "rejetée")}
                  >
                    Rejeter
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
          Clients ({others.length})
        </h2>
        {others.length === 0 ? (
          <p>Aucun client provisionné.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>
                <th style={{ padding: "0.5rem" }}>Boutique</th>
                <th style={{ padding: "0.5rem" }}>Statut</th>
                <th style={{ padding: "0.5rem" }}>Storefront</th>
                <th style={{ padding: "0.5rem" }}>Clé publishable</th>
                <th style={{ padding: "0.5rem" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {others.map((client) => (
                <tr key={client.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "0.5rem" }}>
                    <strong>{client.name}</strong>
                    <br />
                    <span style={{ color: "#6b7280", fontSize: "12px" }}>
                      {client.slug}
                      {client.domains?.length ? ` · ${client.domains.join(", ")}` : ""}
                    </span>
                    {client.error && (
                      <div style={{ color: "#b91c1c", fontSize: "12px" }}>
                        {client.error}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "0.5rem" }}>
                    <span
                      style={{
                        padding: "0.15rem 0.5rem",
                        borderRadius: "999px",
                        fontSize: "12px",
                        color: "white",
                        background: statusColors[client.status] ?? "#6b7280",
                      }}
                    >
                      {statusLabel[client.status] ?? client.status}
                    </span>
                  </td>
                  <td style={{ padding: "0.5rem" }}>
                    {client.storefront_url ? (
                      <a href={client.storefront_url} target="_blank" rel="noreferrer">
                        {client.storefront_url}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td style={{ padding: "0.5rem", fontFamily: "monospace", fontSize: "12px" }}>
                    {client.publishable_key ?? "—"}
                  </td>
                  <td style={{ padding: "0.5rem" }}>
                    <span style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                      {(client.status === "active" ||
                        client.status === "failed" ||
                        client.status === "suspended") && (
                        <button
                          style={btn()}
                          disabled={busyId === client.id}
                          onClick={() => provision(client)}
                        >
                          Reprovisionner
                        </button>
                      )}
                      {client.status === "active" && (
                        <button
                          style={btn()}
                          disabled={busyId === client.id}
                          onClick={() => setStatus(client, "suspended", "suspendu")}
                        >
                          Suspendre
                        </button>
                      )}
                      {client.status === "suspended" && (
                        <button
                          style={btn()}
                          disabled={busyId === client.id}
                          onClick={() => setStatus(client, "active", "réactivé")}
                        >
                          Réactiver
                        </button>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {fileClients.length > 0 && (
          <p style={{ marginTop: "0.75rem", fontSize: "12px", color: "#6b7280" }}>
            Dossiers legacy <code>clients/</code> : {fileClients.join(", ")}
          </p>
        )}
      </div>

      <form
        onSubmit={handleCreate}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <h2 style={{ fontSize: "1.1rem" }}>Créer + provisionner une boutique</h2>
        <div>
          <label
            htmlFor="new-client-name"
            style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}
          >
            Slug de la boutique
          </label>
          <input
            id="new-client-name"
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
          <label
            htmlFor="new-client-email"
            style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}
          >
            Email de contact (optionnel)
          </label>
          <input
            id="new-client-email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="merchant@example.com"
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
          <label
            htmlFor="new-client-domain"
            style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}
          >
            Domaine (optionnel)
          </label>
          <input
            id="new-client-domain"
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
        <button type="submit" disabled={loading} style={{ ...btn(true), padding: "0.5rem 1.5rem" }}>
          {loading ? "Provisioning…" : "Créer la boutique"}
        </button>
        {error && <span style={{ color: "#dc2626" }}>{error}</span>}
        {notice && <span style={{ color: "#16a34a" }}>{notice}</span>}
      </form>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Boutiques",
  rank: 9,
})

export default Clients
