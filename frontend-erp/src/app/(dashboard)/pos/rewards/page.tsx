"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Gift, RefreshCw, Search, Star, Trophy, History, X, Plus, Minus } from "lucide-react";

const TABS = ["Clientes", "Top Consumers", "Historial"];

export default function RewardsPage() {
    const [tab, setTab] = useState(0);
    const [customers, setCustomers] = useState<any[]>([]);
    const [topConsumers, setTopConsumers] = useState<any[]>([]);
    const [audit, setAudit] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showGive, setShowGive] = useState(false);
    const [showAdjust, setShowAdjust] = useState(false);
    const [giveForm, setGiveForm] = useState({ userId: "", points: "", reason: "" });
    const [adjustForm, setAdjustForm] = useState({ userId: "", points: "", reason: "" });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [c, tc, a] = await Promise.all([
                api.get("/rewards/customers").catch(() => ({ data: [] })),
                api.get("/rewards/top-consumers").catch(() => ({ data: [] })),
                api.get("/rewards/audit").catch(() => ({ data: [] })),
            ]);
            setCustomers(Array.isArray(c.data) ? c.data : []);
            setTopConsumers(Array.isArray(tc.data) ? tc.data : []);
            setAudit(Array.isArray(a.data) ? a.data : []);
        } catch { } finally { setLoading(false); }
    };
    useEffect(() => { fetchData(); }, []);

    const filtered = customers.filter(c => !search || c.fullName?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()));

    const givePoints = async () => {
        try { await api.post("/rewards/give", { userId: giveForm.userId, points: Number(giveForm.points), reason: giveForm.reason || undefined }); setShowGive(false); setGiveForm({ userId: "", points: "", reason: "" }); fetchData(); alert("¡Puntos otorgados!"); } catch (e: any) { alert(e.response?.data?.message || "Error"); }
    };

    const giveWelcome = async (userId: string) => {
        try { await api.post(`/rewards/welcome/${userId}`); fetchData(); alert("¡50 puntos de bienvenida otorgados!"); } catch (e: any) { alert(e.response?.data?.message || "Error o ya recibió bienvenida"); }
    };

    const adjustPoints = async () => {
        try { await api.post("/rewards/adjust", { userId: adjustForm.userId, points: Number(adjustForm.points), reason: adjustForm.reason || undefined }); setShowAdjust(false); setAdjustForm({ userId: "", points: "", reason: "" }); fetchData(); alert("Puntos ajustados"); } catch (e: any) { alert(e.response?.data?.message || "Error"); }
    };

    const totalEarned = audit.filter(h => h.type === "EARNED").reduce((s: number, h: any) => s + h.points, 0);
    const totalSpent = audit.filter(h => h.type === "SPENT").reduce((s: number, h: any) => s + Math.abs(h.points), 0);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div><h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>Programa de Recompensas</h1><p style={{ fontSize: 14, color: "#94a3b8", margin: 0, marginTop: 4 }}>Gestiona puntos y fidelidad de clientes</p></div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={fetchData} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px" }}><RefreshCw style={{ width: 14, height: 14 }} /></button>
                    <button onClick={() => setShowGive(true)} className="btn-purple" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px" }}><Plus style={{ width: 16, height: 16 }} /> Dar Puntos</button>
                    <button onClick={() => setShowAdjust(true)} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px" }}><Minus style={{ width: 14, height: 14 }} /> Ajustar</button>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
                {[{ label: "Total Clientes", value: customers.length, bg: "#7c3aed", icon: "👥" }, { label: "Puntos Emitidos", value: totalEarned, bg: "#22c55e", icon: "⭐" }, { label: "Puntos Canjeados", value: totalSpent, bg: "#f97316", icon: "🎁" }].map((s, i) => (
                    <div key={i} className="stat-card"><div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.icon}</div><div><p style={{ fontSize: 24, fontWeight: 800, color: "#1e1b4b", margin: 0 }}>{s.value}</p><p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{s.label}</p></div></div></div>
                ))}
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 4, background: "#f5f6fa", borderRadius: 10, padding: 4 }}>
                {TABS.map((t, i) => <button key={i} onClick={() => setTab(i)} style={{ flex: 1, padding: "10px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: tab === i ? "#fff" : "transparent", color: tab === i ? "#7c3aed" : "#64748b", boxShadow: tab === i ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}>{t}</button>)}
            </div>

            {/* Tab: Clientes */}
            {tab === 0 && (<>
                <div style={{ position: "relative", maxWidth: 400 }}><Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#94a3b8" }} /><input className="input" placeholder="Buscar cliente..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38 }} /></div>
                <div className="card" style={{ padding: 0 }}>
                    {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><div style={{ width: 32, height: 32, border: "3px solid #ede9fe", borderTopColor: "#7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /><style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style></div>
                    : filtered.length === 0 ? <div className="empty-state"><div className="empty-state-icon" style={{ background: "#fef3c7" }}><Gift style={{ width: 28, height: 28, color: "#f59e0b" }} /></div><p style={{ fontSize: 16, fontWeight: 600, color: "#1e1b4b" }}>Sin clientes</p></div>
                    : <div style={{ overflowX: "auto" }}><table className="data-table"><thead><tr><th>Cliente</th><th>Email</th><th>Puntos</th><th>Nivel</th><th>Acciones</th></tr></thead>
                    <tbody>{filtered.map(c => (
                        <tr key={c.id}>
                            <td style={{ fontWeight: 600, color: "#1e1b4b" }}>{c.fullName}</td>
                            <td style={{ color: "#64748b" }}>{c.email}</td>
                            <td style={{ fontWeight: 700, color: "#7c3aed" }}>⭐ {c.points || 0}</td>
                            <td><span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: (c.points || 0) >= 100 ? "#fef3c7" : "#ede9fe", color: (c.points || 0) >= 100 ? "#d97706" : "#7c3aed" }}>{(c.points || 0) >= 100 ? "🥇 Gold" : "🥈 Silver"}</span></td>
                            <td><button onClick={() => giveWelcome(c.id)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #d1fae5", background: "#f0fdf4", cursor: "pointer", fontSize: 11, fontWeight: 600, color: "#059669" }}>🎉 Bienvenida</button></td>
                        </tr>
                    ))}</tbody></table></div>}
                </div>
            </>)}

            {/* Tab: Top Consumers */}
            {tab === 1 && (
                <div className="card" style={{ padding: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e1b4b", margin: "0 0 16px" }}>🏆 Top 10 Clientes por Consumo</h3>
                    {topConsumers.length === 0 ? <p style={{ color: "#94a3b8" }}>Sin datos</p> : topConsumers.map((c, i) => {
                        const totalSpent = (c.orders || []).reduce((s: number, o: any) => s + Number(o.total || 0), 0);
                        return (
                            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < topConsumers.length - 1 ? "1px solid #f0f1f3" : "none" }}>
                                <span style={{ width: 32, height: 32, borderRadius: 8, background: i === 0 ? "#fef3c7" : i === 1 ? "#e8eaf0" : i === 2 ? "#fed7aa" : "#f5f6fa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#1e1b4b" }}>{i + 1}</span>
                                <div style={{ flex: 1 }}><p style={{ fontSize: 14, fontWeight: 600, color: "#1e1b4b", margin: 0 }}>{c.fullName}</p><p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{c.email}</p></div>
                                <div style={{ textAlign: "right" }}><p style={{ fontSize: 14, fontWeight: 700, color: "#7c3aed", margin: 0 }}>⭐ {c.points} pts</p><p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>S/ {totalSpent.toFixed(2)} gastado</p></div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Tab: Historial */}
            {tab === 2 && (
                <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid #e8eaf0" }}><h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>📋 Historial de Transacciones</h3></div>
                    {audit.length === 0 ? <div className="empty-state"><p style={{ color: "#94a3b8" }}>Sin transacciones</p></div>
                    : <div style={{ overflowX: "auto" }}><table className="data-table"><thead><tr><th>Usuario</th><th>Tipo</th><th>Puntos</th><th>Razón</th><th>Fecha</th></tr></thead>
                    <tbody>{audit.slice(0, 50).map((t: any, i: number) => (
                        <tr key={i}>
                            <td style={{ fontWeight: 600, color: "#1e1b4b" }}>{t.user?.fullName || "—"}</td>
                            <td><span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: t.type === "EARNED" ? "#d1fae5" : t.type === "SPENT" ? "#fee2e2" : "#e0e7ff", color: t.type === "EARNED" ? "#059669" : t.type === "SPENT" ? "#dc2626" : "#4f46e5" }}>{t.type === "EARNED" ? "Ganado" : t.type === "SPENT" ? "Canjeado" : "Ajuste"}</span></td>
                            <td style={{ fontWeight: 700, color: t.type === "EARNED" ? "#059669" : t.type === "SPENT" ? "#dc2626" : "#4f46e5" }}>{t.type === "EARNED" ? "+" : t.type === "SPENT" ? "-" : ""}{t.points}</td>
                            <td style={{ color: "#64748b", fontSize: 12 }}>{t.reason || "—"}</td>
                            <td style={{ fontSize: 12, color: "#94a3b8" }}>{t.createdAt ? new Date(t.createdAt).toLocaleString("es-PE") : ""}</td>
                        </tr>
                    ))}</tbody></table></div>}
                </div>
            )}

            {/* Give Points Modal */}
            {showGive && (
                <div className="modal-overlay" onClick={() => setShowGive(false)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()} style={{ width: 420, padding: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #e8eaf0" }}><h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>⭐ Dar Puntos</h3><button onClick={() => setShowGive(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X style={{ width: 20, height: 20, color: "#94a3b8" }} /></button></div>
                        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
                            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>CLIENTE</label><select className="select" value={giveForm.userId} onChange={e => setGiveForm({ ...giveForm, userId: e.target.value })} style={{ width: "100%" }}><option value="">Seleccionar...</option>{customers.map(c => <option key={c.id} value={c.id}>{c.fullName} ({c.email})</option>)}</select></div>
                            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>PUNTOS</label><input className="input" type="number" value={giveForm.points} onChange={e => setGiveForm({ ...giveForm, points: e.target.value })} placeholder="Ej: 50" /></div>
                            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>RAZÓN</label><input className="input" value={giveForm.reason} onChange={e => setGiveForm({ ...giveForm, reason: e.target.value })} placeholder="Ej: Bono especial" /></div>
                            <div style={{ display: "flex", gap: 10 }}><button onClick={() => setShowGive(false)} className="btn-secondary" style={{ flex: 1 }}>Cancelar</button><button onClick={givePoints} className="btn-purple" style={{ flex: 1 }}>Otorgar Puntos</button></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Adjust Points Modal */}
            {showAdjust && (
                <div className="modal-overlay" onClick={() => setShowAdjust(false)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()} style={{ width: 420, padding: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #e8eaf0" }}><h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>⚖️ Ajustar Puntos</h3><button onClick={() => setShowAdjust(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X style={{ width: 20, height: 20, color: "#94a3b8" }} /></button></div>
                        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
                            <p style={{ fontSize: 12, color: "#f59e0b", fontWeight: 600, background: "#fffbeb", padding: 10, borderRadius: 8 }}>⚠️ Use números negativos para reducir puntos</p>
                            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>CLIENTE</label><select className="select" value={adjustForm.userId} onChange={e => setAdjustForm({ ...adjustForm, userId: e.target.value })} style={{ width: "100%" }}><option value="">Seleccionar...</option>{customers.map(c => <option key={c.id} value={c.id}>{c.fullName} ({c.points} pts)</option>)}</select></div>
                            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>PUNTOS (+/-)</label><input className="input" type="number" value={adjustForm.points} onChange={e => setAdjustForm({ ...adjustForm, points: e.target.value })} placeholder="Ej: -20" /></div>
                            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>RAZÓN</label><input className="input" value={adjustForm.reason} onChange={e => setAdjustForm({ ...adjustForm, reason: e.target.value })} placeholder="Ej: Corrección de balance" /></div>
                            <div style={{ display: "flex", gap: 10 }}><button onClick={() => setShowAdjust(false)} className="btn-secondary" style={{ flex: 1 }}>Cancelar</button><button onClick={adjustPoints} className="btn-purple" style={{ flex: 1 }}>Ajustar</button></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
