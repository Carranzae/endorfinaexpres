"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Tag, Plus, RefreshCw, Edit2, Trash2, X } from "lucide-react";

export default function CategoriesPage() {
    const [cats, setCats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [formData, setFormData] = useState({ name: "", description: "" });

    const fetchCats = async () => {
        setLoading(true);
        try { const { data } = await api.get("/categories"); setCats(Array.isArray(data) ? data : []); }
        catch { setCats([]); } finally { setLoading(false); }
    };
    useEffect(() => { fetchCats(); }, []);

    const openCreate = () => { setEditing(null); setFormData({ name: "", description: "" }); setShowForm(true); };
    const openEdit = (c: any) => { setEditing(c); setFormData({ name: c.name, description: c.description || "" }); setShowForm(true); };

    const save = async () => {
        try {
            if (editing) { const { data } = await api.patch(`/categories/${editing.id}`, formData); setCats(prev => prev.map(c => c.id === editing.id ? data : c)); }
            else { const { data } = await api.post("/categories", formData); setCats(prev => [...prev, data]); }
            setShowForm(false);
        } catch (e: any) { alert(e.response?.data?.message || "Error"); }
    };

    const deleteCat = async (id: string) => {
        if (!confirm("¿Eliminar esta categoría?")) return;
        try { await api.delete(`/categories/${id}`); setCats(prev => prev.filter(c => c.id !== id)); }
        catch (e: any) { alert(e.response?.data?.message || "Error al eliminar"); }
    };

    const COLORS = ["#7c3aed", "#f97316", "#22c55e", "#3b82f6", "#ec4899", "#14b8a6", "#f59e0b", "#6366f1"];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>Categorías</h1>
                    <p style={{ fontSize: 14, color: "#94a3b8", margin: 0, marginTop: 4 }}>Organiza los productos de tu menú</p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={fetchCats} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px" }}><RefreshCw style={{ width: 14, height: 14 }} /> Actualizar</button>
                    <button onClick={openCreate} className="btn-purple" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px" }}><Plus style={{ width: 16, height: 16 }} /> Nueva Categoría</button>
                </div>
            </div>

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><div style={{ width: 36, height: 36, border: "3px solid #ede9fe", borderTopColor: "#7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /><style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style></div>
            ) : cats.length === 0 ? (
                <div className="card empty-state">
                    <div className="empty-state-icon" style={{ background: "#ede9fe" }}><Tag style={{ width: 28, height: 28, color: "#7c3aed" }} /></div>
                    <p style={{ fontSize: 16, fontWeight: 600, color: "#1e1b4b" }}>No hay categorías</p>
                    <button onClick={openCreate} className="btn-purple" style={{ marginTop: 16 }}><Plus style={{ width: 16, height: 16 }} /> Crear Categoría</button>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                    {cats.map((cat, i) => {
                        const color = COLORS[i % COLORS.length];
                        return (
                            <div key={cat.id} className="card" style={{ padding: 24 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Tag style={{ width: 20, height: 20, color }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>{cat.name}</h3>
                                        {cat.description && <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, marginTop: 2 }}>{cat.description}</p>}
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #e8eaf0" }}>
                                    <span style={{ fontSize: 12, color: "#94a3b8" }}>📦 {cat._count?.products ?? cat.products?.length ?? 0} productos</span>
                                    <div style={{ display: "flex", gap: 6 }}>
                                        <button onClick={() => openEdit(cat)} style={{ background: "#f8f9fb", border: "1px solid #e8eaf0", borderRadius: 8, padding: "6px 8px", cursor: "pointer" }}><Edit2 style={{ width: 14, height: 14, color: "#7c3aed" }} /></button>
                                        <button onClick={() => deleteCat(cat.id)} style={{ background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: 8, padding: "6px 8px", cursor: "pointer" }}><Trash2 style={{ width: 14, height: 14, color: "#ef4444" }} /></button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()} style={{ width: 420, padding: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #e8eaf0" }}>
                            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>{editing ? "✏️ Editar" : "➕ Nueva"} Categoría</h3>
                            <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X style={{ width: 20, height: 20, color: "#94a3b8" }} /></button>
                        </div>
                        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>NOMBRE</label><input className="input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Nombre de categoría" /></div>
                            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>DESCRIPCIÓN</label><textarea className="input" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Descripción (opcional)" style={{ minHeight: 70, resize: "vertical" }} /></div>
                            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                                <button onClick={() => setShowForm(false)} className="btn-secondary" style={{ flex: 1 }}>Cancelar</button>
                                <button onClick={save} className="btn-purple" style={{ flex: 1 }}>{editing ? "Guardar" : "Crear"}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
