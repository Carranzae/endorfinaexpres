"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { QrCode, Plus, RefreshCw, Eye, Trash2, Link2, Download, Gift, X } from "lucide-react";

export default function QRPage() {
    const [sessions, setSessions] = useState<any[]>([]);
    const [tables, setTables] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showGenModal, setShowGenModal] = useState<"independent"|"table"|null>(null);
    const [selTableId, setSelTableId] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const [s, t] = await Promise.all([api.get("/qr-sessions"), api.get("/tables")]);
            setSessions(Array.isArray(s.data) ? s.data : []);
            setTables(Array.isArray(t.data) ? t.data : []);
        } catch { } finally { setLoading(false); }
    };
    useEffect(() => { fetchData(); }, []);

    const generateQR = async (tableId?: string) => {
        try {
            const body = tableId ? { tableId } : {};
            const { data } = await api.post(`/qr-sessions/table/${tableId || "independent"}`, body);
            setSessions(prev => [data, ...prev]);
            setShowGenModal(null);
        } catch (e: any) { alert(e.response?.data?.message || "Error al generar QR"); }
    };

    const deleteSession = async (id: string) => {
        if (!confirm("¿Eliminar esta sesión QR?")) return;
        try { await api.patch(`/qr-sessions/${id}/close`); setSessions(prev => prev.filter(s => s.id !== id)); }
        catch (e: any) { alert(e.response?.data?.message || "Error"); }
    };

    const copyLink = (token: string) => {
        const url = `${window.location.origin}/qr/${token}`;
        navigator.clipboard.writeText(url);
        alert("Link copiado: " + url);
    };

    const isExpired = (s: any) => new Date(s.expiresAt) < new Date();

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>Gestión de Códigos QR</h1>
                    <p style={{ fontSize: 14, color: "#94a3b8", margin: 0, marginTop: 4 }}>Genera y gestiona códigos QR escaneables con sesiones múltiples (30 min c/u)</p>
                </div>
                <button onClick={fetchData} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px" }}>
                    <RefreshCw style={{ width: 14, height: 14 }} /> Actualizar
                </button>
            </div>

            {/* Action Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                <div className="card" style={{ padding: 24, textAlign: "center" }}>
                    <div style={{ width: 50, height: 50, borderRadius: 14, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                        <Gift style={{ width: 24, height: 24, color: "#f59e0b" }} />
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>Rewards</h3>
                    <p style={{ fontSize: 12, color: "#94a3b8", margin: "6px 0 14px" }}>Ver puntos de clientes</p>
                    <a href="/pos/rewards" className="btn-primary" style={{ display: "inline-block", textDecoration: "none", fontSize: 12, padding: "8px 20px" }}>Abrir Rewards</a>
                </div>
                <div className="card" style={{ padding: 24, textAlign: "center" }}>
                    <div style={{ width: 50, height: 50, borderRadius: 14, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                        <QrCode style={{ width: 24, height: 24, color: "#7c3aed" }} />
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>QR Independiente</h3>
                    <p style={{ fontSize: 12, color: "#94a3b8", margin: "6px 0 14px" }}>Sin vinculación a mesa</p>
                    <button onClick={() => generateQR()} className="btn-purple" style={{ fontSize: 12, padding: "8px 20px" }}>Generar QR</button>
                </div>
                <div className="card" style={{ padding: 24, textAlign: "center" }}>
                    <div style={{ width: 50, height: 50, borderRadius: 14, background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                        <Plus style={{ width: 24, height: 24, color: "#22c55e" }} />
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>QR por Mesa</h3>
                    <p style={{ fontSize: 12, color: "#94a3b8", margin: "6px 0 14px" }}>Vinculado a mesa específica</p>
                    <button onClick={() => setShowGenModal("table")} className="btn-success" style={{ fontSize: 12, padding: "8px 20px" }}>Generar QR</button>
                </div>
            </div>

            {/* Sessions Table */}
            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid #e8eaf0" }}>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>🔳 Sesiones QR Activas</h2>
                </div>
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><div style={{ width: 32, height: 32, border: "3px solid #ede9fe", borderTopColor: "#7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /><style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style></div>
                ) : sessions.length === 0 ? (
                    <div className="empty-state"><p style={{ color: "#94a3b8" }}>No hay sesiones QR activas</p></div>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table className="data-table">
                            <thead><tr><th>Mesa</th><th>Token</th><th>Tipo</th><th>Sesiones</th><th>Estado</th><th>Creado</th><th>Días restantes</th><th>Acciones</th></tr></thead>
                            <tbody>
                                {sessions.map(s => {
                                    const expired = isExpired(s);
                                    return (
                                        <tr key={s.id}>
                                            <td><span style={{ background: s.tableId ? "#ede9fe" : "#fef3c7", color: s.tableId ? "#7c3aed" : "#d97706", padding: "3px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600 }}>{s.tableId ? `Mesa ${s.table?.number || "?"}` : "🏠 Independiente"}</span></td>
                                            <td style={{ fontFamily: "monospace", fontSize: 11, color: "#64748b" }}>{s.sessionToken?.slice(0, 14)}...</td>
                                            <td><span style={{ fontSize: 11, color: "#94a3b8" }}>{s.isMultiSession ? "🔄 Multi-sesión" : "1️⃣ Única"}</span></td>
                                            <td><span style={{ background: "#ede9fe", color: "#7c3aed", padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>✓ {s.customerSessions?.length || 0} activas</span></td>
                                            <td><span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: s.status === "ACTIVE" ? "#d1fae5" : "#fee2e2", color: s.status === "ACTIVE" ? "#059669" : "#dc2626" }}>{s.status === "ACTIVE" ? "Activo" : s.status}</span></td>
                                            <td style={{ fontSize: 12, color: "#64748b" }}>{s.createdAt ? new Date(s.createdAt).toLocaleDateString("es-PE") : ""}</td>
                                            <td><span style={{ color: expired ? "#ef4444" : "#22c55e", fontSize: 12, fontWeight: 600 }}>{expired ? "Expirado" : "Vigente"}</span></td>
                                            <td>
                                                <div style={{ display: "flex", gap: 4 }}>
                                                    <button onClick={() => window.open(`${window.location.origin}/qr/${s.sessionToken}`, "_blank")} title="Ver" style={{ padding: "5px 7px", borderRadius: 6, border: "1px solid #e8eaf0", background: "#fff", cursor: "pointer" }}><Eye style={{ width: 13, height: 13, color: "#64748b" }} /></button>
                                                    <button title="Copiar link" onClick={() => copyLink(s.sessionToken)} style={{ padding: "5px 7px", borderRadius: 6, border: "1px solid #e8eaf0", background: "#fff", cursor: "pointer" }}><Link2 style={{ width: 13, height: 13, color: "#7c3aed" }} /></button>
                                                    <button title="Descargar" style={{ padding: "5px 7px", borderRadius: 6, border: "1px solid #e8eaf0", background: "#fff", cursor: "pointer" }}><Download style={{ width: 13, height: 13, color: "#64748b" }} /></button>
                                                    <button title="Eliminar" onClick={() => deleteSession(s.id)} style={{ padding: "5px 7px", borderRadius: 6, border: "1px solid #fee2e2", background: "#fef2f2", cursor: "pointer" }}><Trash2 style={{ width: 13, height: 13, color: "#ef4444" }} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Table Select Modal */}
            {showGenModal === "table" && (
                <div className="modal-overlay" onClick={() => setShowGenModal(null)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()} style={{ width: 400, padding: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #e8eaf0" }}>
                            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>Generar QR por Mesa</h3>
                            <button onClick={() => setShowGenModal(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X style={{ width: 20, height: 20, color: "#94a3b8" }} /></button>
                        </div>
                        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                            <select className="select" value={selTableId} onChange={e => setSelTableId(e.target.value)}>
                                <option value="">Seleccionar mesa...</option>
                                {tables.map(t => <option key={t.id} value={t.id}>Mesa {t.number} ({t.capacity} personas)</option>)}
                            </select>
                            <div style={{ display: "flex", gap: 10 }}>
                                <button onClick={() => setShowGenModal(null)} className="btn-secondary" style={{ flex: 1 }}>Cancelar</button>
                                <button onClick={() => selTableId && generateQR(selTableId)} className="btn-purple" style={{ flex: 1 }} disabled={!selTableId}>Generar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
