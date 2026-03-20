"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Mail, RefreshCw, Plus, Trash2, X, AlertTriangle, Shield } from "lucide-react";

const TABS = ["Suscriptores", "Auditoría de Canjes", "Anomalías"];
const SEV_STYLE: Record<string, { bg: string; color: string }> = { CRITICAL: { bg: "#fee2e2", color: "#dc2626" }, HIGH: { bg: "#fef3c7", color: "#d97706" }, MEDIUM: { bg: "#e0f2fe", color: "#0284c7" }, LOW: { bg: "#f0fdf4", color: "#16a34a" } };

export default function NewsletterPage() {
    const [tab, setTab] = useState(0);
    const [subs, setSubs] = useState<any[]>([]);
    const [audit, setAudit] = useState<any[]>([]);
    const [anomalies, setAnomalies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ email: "", firstName: "", phone: "" });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [s, a, an] = await Promise.all([
                api.get("/newsletter/subscribers").catch(() => ({ data: [] })),
                api.get("/rewards/audit").catch(() => ({ data: [] })),
                api.get("/rewards/anomalies").catch(() => ({ data: [] })),
            ]);
            setSubs(Array.isArray(s.data) ? s.data : []);
            setAudit(Array.isArray(a.data) ? a.data : []);
            setAnomalies(Array.isArray(an.data) ? an.data : []);
        } catch { } finally { setLoading(false); }
    };
    useEffect(() => { fetchData(); }, []);

    const addSub = async () => {
        try { const { data } = await api.post("/newsletter/subscribe", form); setSubs(prev => [...prev, data]); setShowAdd(false); setForm({ email: "", firstName: "", phone: "" }); }
        catch (e: any) { alert(e.response?.data?.message || "Error"); }
    };
    const deleteSub = async (id: string) => {
        if (!confirm("¿Eliminar este suscriptor?")) return;
        try { await api.delete(`/newsletter/subscribers/${id}`); setSubs(prev => prev.filter(s => s.id !== id)); } catch (e: any) { alert(e.response?.data?.message || "Error"); }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div><h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>Newsletter & Auditoría</h1><p style={{ fontSize: 14, color: "#94a3b8", margin: 0, marginTop: 4 }}>Suscriptores, auditoría de canjes y detección de fraude</p></div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={fetchData} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px" }}><RefreshCw style={{ width: 14, height: 14 }} /></button>
                    <button onClick={() => setShowAdd(true)} className="btn-purple" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px" }}><Plus style={{ width: 16, height: 16 }} /> Agregar</button>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
                <div className="stat-card"><div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 44, height: 44, borderRadius: 12, background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📬</div><div><p style={{ fontSize: 24, fontWeight: 800, color: "#1e1b4b", margin: 0 }}>{subs.length}</p><p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Suscriptores</p></div></div></div>
                <div className="stat-card"><div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 44, height: 44, borderRadius: 12, background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>✅</div><div><p style={{ fontSize: 24, fontWeight: 800, color: "#1e1b4b", margin: 0 }}>{subs.filter(s => s.isActive).length}</p><p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Activos</p></div></div></div>
                <div className="stat-card"><div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 44, height: 44, borderRadius: 12, background: anomalies.length > 0 ? "#ef4444" : "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🚨</div><div><p style={{ fontSize: 24, fontWeight: 800, color: "#1e1b4b", margin: 0 }}>{anomalies.length}</p><p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Anomalías</p></div></div></div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 4, background: "#f5f6fa", borderRadius: 10, padding: 4 }}>
                {TABS.map((t, i) => <button key={i} onClick={() => setTab(i)} style={{ flex: 1, padding: "10px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: tab === i ? "#fff" : "transparent", color: tab === i ? "#7c3aed" : "#64748b", boxShadow: tab === i ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}>{t}{i === 2 && anomalies.length > 0 ? ` (${anomalies.length})` : ""}</button>)}
            </div>

            {/* Tab: Suscriptores */}
            {tab === 0 && (
                <div className="card" style={{ padding: 0 }}>
                    {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><div style={{ width: 32, height: 32, border: "3px solid #ede9fe", borderTopColor: "#7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /><style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style></div>
                    : subs.length === 0 ? <div className="empty-state"><div className="empty-state-icon" style={{ background: "#e0f2fe" }}><Mail style={{ width: 28, height: 28, color: "#0ea5e9" }} /></div><p style={{ fontSize: 16, fontWeight: 600, color: "#1e1b4b" }}>Sin suscriptores</p></div>
                    : <div style={{ overflowX: "auto" }}><table className="data-table"><thead><tr><th>Email</th><th>Nombre</th><th>Teléfono</th><th>Estado</th><th>Registrado</th><th>Acción</th></tr></thead>
                    <tbody>{subs.map(s => (
                        <tr key={s.id}>
                            <td style={{ fontWeight: 600, color: "#1e1b4b" }}>{s.email}</td><td>{s.firstName || "—"}</td><td style={{ color: "#64748b" }}>{s.phone || "—"}</td>
                            <td><span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: s.isActive ? "#d1fae5" : "#fee2e2", color: s.isActive ? "#059669" : "#dc2626" }}>{s.isActive ? "Activo" : "Inactivo"}</span></td>
                            <td style={{ fontSize: 12, color: "#64748b" }}>{s.createdAt ? new Date(s.createdAt).toLocaleDateString("es-PE") : ""}</td>
                            <td><button onClick={() => deleteSub(s.id)} style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #fee2e2", background: "#fef2f2", cursor: "pointer" }}><Trash2 style={{ width: 13, height: 13, color: "#ef4444" }} /></button></td>
                        </tr>
                    ))}</tbody></table></div>}
                </div>
            )}

            {/* Tab: Auditoría de Canjes */}
            {tab === 1 && (
                <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid #e8eaf0" }}><h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>📋 Historial de Canjes de Recompensas</h3></div>
                    {audit.length === 0 ? <div className="empty-state"><p style={{ color: "#94a3b8" }}>Sin canjes registrados</p></div>
                    : <div style={{ overflowX: "auto" }}><table className="data-table"><thead><tr><th>Usuario</th><th>Email</th><th>Tipo</th><th>Puntos</th><th>Razón</th><th>Fecha</th></tr></thead>
                    <tbody>{audit.slice(0, 100).map((t: any, i: number) => (
                        <tr key={i}>
                            <td style={{ fontWeight: 600, color: "#1e1b4b" }}>{t.user?.fullName || "—"}</td>
                            <td style={{ color: "#64748b", fontSize: 12 }}>{t.user?.email || "—"}</td>
                            <td><span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: t.type === "EARNED" ? "#d1fae5" : t.type === "SPENT" ? "#fee2e2" : "#e0e7ff", color: t.type === "EARNED" ? "#059669" : t.type === "SPENT" ? "#dc2626" : "#4f46e5" }}>{t.type === "EARNED" ? "Ganado" : t.type === "SPENT" ? "Canjeado" : "Ajuste"}</span></td>
                            <td style={{ fontWeight: 700 }}>{t.points}</td>
                            <td style={{ color: "#64748b", fontSize: 12 }}>{t.reason || "—"}</td>
                            <td style={{ fontSize: 12, color: "#94a3b8" }}>{t.createdAt ? new Date(t.createdAt).toLocaleString("es-PE") : ""}</td>
                        </tr>
                    ))}</tbody></table></div>}
                </div>
            )}

            {/* Tab: Anomalías */}
            {tab === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {anomalies.length === 0 ? (
                        <div className="card" style={{ textAlign: "center", padding: 40 }}>
                            <Shield style={{ width: 48, height: 48, color: "#22c55e", margin: "0 auto 12px" }} />
                            <p style={{ fontSize: 16, fontWeight: 700, color: "#1e1b4b" }}>✓ Sin anomalías detectadas</p>
                            <p style={{ fontSize: 13, color: "#94a3b8" }}>El sistema no detectó patrones sospechosos</p>
                        </div>
                    ) : anomalies.map((a, i) => {
                        const sev = SEV_STYLE[a.severity] || SEV_STYLE.LOW;
                        return (
                            <div key={i} className="card" style={{ padding: 16, borderLeft: `4px solid ${sev.color}` }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <AlertTriangle style={{ width: 16, height: 16, color: sev.color }} />
                                        <span style={{ fontSize: 14, fontWeight: 700, color: "#1e1b4b" }}>{a.type.replace(/_/g, " ")}</span>
                                        <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: sev.bg, color: sev.color }}>{a.severity}</span>
                                    </div>
                                </div>
                                <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>👤 {a.userName || "Desconocido"} ({a.email || ""}) — {a.message}</p>
                            </div>
                        );
                    })}
                </div>
            )}

            {showAdd && (
                <div className="modal-overlay" onClick={() => setShowAdd(false)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()} style={{ width: 420, padding: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #e8eaf0" }}>
                            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>➕ Nuevo Suscriptor</h3>
                            <button onClick={() => setShowAdd(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X style={{ width: 20, height: 20, color: "#94a3b8" }} /></button>
                        </div>
                        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
                            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>EMAIL</label><input className="input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@ejemplo.com" /></div>
                            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>NOMBRE</label><input className="input" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} placeholder="Nombre (opcional)" /></div>
                            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>TELÉFONO</label><input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="999 999 999 (opcional)" /></div>
                            <div style={{ display: "flex", gap: 10, marginTop: 6 }}><button onClick={() => setShowAdd(false)} className="btn-secondary" style={{ flex: 1 }}>Cancelar</button><button onClick={addSub} className="btn-purple" style={{ flex: 1 }}>Agregar</button></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
