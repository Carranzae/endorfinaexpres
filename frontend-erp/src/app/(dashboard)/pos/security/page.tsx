"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Shield, RefreshCw, Search } from "lucide-react";

export default function SecurityPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchLogs = async () => {
        setLoading(true);
        try { const { data } = await api.get("/security/audit-logs"); setLogs(Array.isArray(data) ? data : []); }
        catch { setLogs([]); } finally { setLoading(false); }
    };
    useEffect(() => { fetchLogs(); }, []);

    const filtered = logs.filter(l => !search || l.eventType?.toLowerCase().includes(search.toLowerCase()) || l.user?.fullName?.toLowerCase().includes(search.toLowerCase()));

    const severity = (s: string) => {
        const map: Record<string, { bg: string; color: string }> = { low: { bg: "#d1fae5", color: "#059669" }, medium: { bg: "#fef3c7", color: "#d97706" }, high: { bg: "#fee2e2", color: "#dc2626" }, critical: { bg: "#fce7f3", color: "#db2777" } };
        return map[s] || map.low;
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div><h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>Seguridad</h1><p style={{ fontSize: 14, color: "#94a3b8", margin: 0, marginTop: 4 }}>Logs de actividad y auditoría del sistema</p></div>
                <button onClick={fetchLogs} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px" }}><RefreshCw style={{ width: 14, height: 14 }} /> Actualizar</button>
            </div>
            <div style={{ position: "relative", maxWidth: 400 }}><Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#94a3b8" }} /><input className="input" placeholder="Buscar eventos..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38 }} /></div>
            <div className="card" style={{ padding: 0 }}>
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><div style={{ width: 32, height: 32, border: "3px solid #ede9fe", borderTopColor: "#7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /><style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style></div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state"><div className="empty-state-icon" style={{ background: "#fee2e2" }}><Shield style={{ width: 28, height: 28, color: "#ef4444" }} /></div><p style={{ fontSize: 16, fontWeight: 600, color: "#1e1b4b" }}>Sin eventos registrados</p></div>
                ) : (
                    <div style={{ overflowX: "auto" }}><table className="data-table"><thead><tr><th>Evento</th><th>Severidad</th><th>Usuario</th><th>IP</th><th>Fecha</th></tr></thead>
                    <tbody>{filtered.map(l => { const sv = severity(l.severity); return (
                        <tr key={l.id}>
                            <td style={{ fontWeight: 600, color: "#1e1b4b" }}>{l.eventType}</td>
                            <td><span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: sv.bg, color: sv.color }}>{l.severity}</span></td>
                            <td>{l.user?.fullName || "Sistema"}</td>
                            <td style={{ fontFamily: "monospace", fontSize: 12, color: "#64748b" }}>{l.ipAddress || "—"}</td>
                            <td style={{ fontSize: 12, color: "#64748b" }}>{l.createdAt ? new Date(l.createdAt).toLocaleString("es-PE") : ""}</td>
                        </tr>
                    ); })}</tbody></table></div>
                )}
            </div>
        </div>
    );
}
