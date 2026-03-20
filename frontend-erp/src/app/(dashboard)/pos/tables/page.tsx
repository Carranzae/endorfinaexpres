"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Users, Plus, RefreshCw, Edit2, Trash2, X } from "lucide-react";

const TABLE_STATUS = [
    { value: "AVAILABLE", label: "Disponible", bg: "#d1fae5", color: "#059669" },
    { value: "OCCUPIED", label: "Ocupada", bg: "#fee2e2", color: "#dc2626" },
    { value: "RESERVED", label: "Reservada", bg: "#fef3c7", color: "#d97706" },
];

export default function TablesPage() {
    const [tables, setTables] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingTable, setEditingTable] = useState<any>(null);
    const [formData, setFormData] = useState({ number: "", capacity: "4" });

    const fetchTables = async () => {
        setLoading(true);
        try { const { data } = await api.get("/tables"); setTables(Array.isArray(data) ? data : []); }
        catch { setTables([]); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchTables(); }, []);

    const openCreate = () => { setEditingTable(null); setFormData({ number: String((tables.length > 0 ? Math.max(...tables.map(t => t.number)) : 0) + 1), capacity: "4" }); setShowForm(true); };
    const openEdit = (t: any) => { setEditingTable(t); setFormData({ number: String(t.number), capacity: String(t.capacity) }); setShowForm(true); };

    const saveTable = async () => {
        try {
            if (editingTable) {
                const { data } = await api.patch(`/tables/${editingTable.id}`, { number: Number(formData.number), capacity: Number(formData.capacity) });
                setTables(prev => prev.map(t => t.id === editingTable.id ? data : t));
            } else {
                const { data } = await api.post("/tables", { number: Number(formData.number), capacity: Number(formData.capacity) });
                setTables(prev => [...prev, data]);
            }
            setShowForm(false);
        } catch (e: any) { alert(e.response?.data?.message || "Error al guardar mesa"); }
    };

    const deleteTable = async (id: string) => {
        if (!confirm("¿Eliminar esta mesa?")) return;
        try { await api.delete(`/tables/${id}`); setTables(prev => prev.filter(t => t.id !== id)); }
        catch (e: any) { alert(e.response?.data?.message || "Error al eliminar"); }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const { data } = await api.patch(`/tables/${id}`, { status });
            setTables(prev => prev.map(t => t.id === id ? data : t));
        } catch (e) { console.error(e); }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>Gestión de Mesas</h1>
                    <p style={{ fontSize: 14, color: "#94a3b8", margin: 0, marginTop: 4 }}>Administra las mesas de tu restaurante</p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={fetchTables} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px" }}>
                        <RefreshCw style={{ width: 14, height: 14 }} /> Actualizar
                    </button>
                    <button onClick={openCreate} className="btn-purple" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px" }}>
                        <Plus style={{ width: 16, height: 16 }} /> Nueva Mesa
                    </button>
                </div>
            </div>

            {/* Tables Grid */}
            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
                    <div style={{ width: 36, height: 36, border: "3px solid #ede9fe", borderTopColor: "#7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : tables.length === 0 ? (
                <div className="card empty-state">
                    <div className="empty-state-icon" style={{ background: "#ede9fe" }}>
                        <Users style={{ width: 28, height: 28, color: "#7c3aed" }} />
                    </div>
                    <p style={{ fontSize: 16, fontWeight: 600, color: "#1e1b4b" }}>No hay mesas creadas</p>
                    <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>Crea tu primera mesa para comenzar</p>
                    <button onClick={openCreate} className="btn-purple" style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6 }}>
                        <Plus style={{ width: 16, height: 16 }} /> Crear Mesa
                    </button>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                    {tables.sort((a, b) => a.number - b.number).map(table => {
                        const st = TABLE_STATUS.find(s => s.value === table.status) || TABLE_STATUS[0];
                        return (
                            <div key={table.id} className="card" style={{ padding: 24 }}>
                                {/* Header */}
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                                    <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>Mesa {table.number}</h3>
                                    <div style={{ display: "flex", gap: 6 }}>
                                        <button onClick={() => openEdit(table)} style={{ background: "#f8f9fb", border: "1px solid #e8eaf0", borderRadius: 8, padding: "6px 8px", cursor: "pointer" }}>
                                            <Edit2 style={{ width: 14, height: 14, color: "#7c3aed" }} />
                                        </button>
                                        <button onClick={() => deleteTable(table.id)} style={{ background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: 8, padding: "6px 8px", cursor: "pointer" }}>
                                            <Trash2 style={{ width: 14, height: 14, color: "#ef4444" }} />
                                        </button>
                                    </div>
                                </div>

                                {/* Capacity */}
                                <p style={{ fontSize: 13, color: "#64748b", margin: 0, marginBottom: 12 }}>
                                    👥 {table.capacity} personas
                                </p>

                                {/* Status Badge */}
                                <div style={{ textAlign: "center", marginBottom: 16 }}>
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: st.bg, color: st.color }}>
                                        {st.label}
                                    </span>
                                </div>

                                {/* Status Buttons */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    {TABLE_STATUS.map(s => (
                                        <button key={s.value} onClick={() => updateStatus(table.id, s.value)}
                                            style={{
                                                padding: "8px 12px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer",
                                                border: table.status === s.value ? "none" : "1px solid #e8eaf0",
                                                background: table.status === s.value
                                                    ? `linear-gradient(135deg, ${s.color}, ${s.color}dd)`
                                                    : "#fff",
                                                color: table.status === s.value ? "#fff" : "#64748b",
                                                transition: "all 0.2s",
                                            }}>
                                            Marcar {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create/Edit Modal */}
            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()} style={{ width: 420, padding: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #e8eaf0" }}>
                            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>
                                {editingTable ? "✏️ Editar Mesa" : "➕ Nueva Mesa"}
                            </h3>
                            <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                                <X style={{ width: 20, height: 20, color: "#94a3b8" }} />
                            </button>
                        </div>
                        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                            <div>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
                                    Número de Mesa
                                </label>
                                <input className="input" type="number" value={formData.number} onChange={e => setFormData({ ...formData, number: e.target.value })} min={1} />
                            </div>
                            <div>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
                                    Capacidad (personas)
                                </label>
                                <input className="input" type="number" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })} min={1} max={20} />
                            </div>
                            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                                <button onClick={() => setShowForm(false)} className="btn-secondary" style={{ flex: 1 }}>Cancelar</button>
                                <button onClick={saveTable} className="btn-purple" style={{ flex: 1 }}>{editingTable ? "Guardar Cambios" : "Crear Mesa"}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
