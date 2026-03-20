"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Image, RefreshCw, Plus, Trash2, Edit2, X, Eye, EyeOff, ArrowUp, ArrowDown } from "lucide-react";

interface Banner {
    id: string; title: string; imageUrl?: string; svgContent?: string;
    position: string; isActive: boolean; sortOrder: number; createdAt: string;
}

const POSITIONS = ["HERO", "CAROUSEL", "DECORATION"];
const POS_LABELS: Record<string, string> = { HERO: "Hero", CAROUSEL: "Carrusel", DECORATION: "Decoración" };
const POS_COLORS: Record<string, { bg: string; color: string }> = { HERO: { bg: "#ede9fe", color: "#7c3aed" }, CAROUSEL: { bg: "#dbeafe", color: "#2563eb" }, DECORATION: { bg: "#fef3c7", color: "#d97706" } };
const emptyForm = { title: "", imageUrl: "", svgContent: "", position: "HERO", isActive: true, sortOrder: 0 };

export default function BannersPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterPos, setFilterPos] = useState("ALL");
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState<any>(emptyForm);
    const [uploading, setUploading] = useState(false);
    const [removeBg, setRemoveBg] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        if (removeBg) formData.append("removeBg", "true");
        try {
            const { data } = await api.post("/upload/image", formData, { headers: { "Content-Type": "multipart/form-data" } });
            setForm({ ...form, imageUrl: data.url });
        } catch (err: any) {
            alert("Error al subir archivo: " + (err.response?.data?.message || err.message));
        } finally {
            setUploading(false);
        }
    };

    const fetchBanners = async () => {
        setLoading(true);
        try { const { data } = await api.get("/banners"); setBanners(Array.isArray(data) ? data : []); }
        catch { setBanners([]); } finally { setLoading(false); }
    };
    useEffect(() => { fetchBanners(); }, []);

    const openCreate = () => { setEditId(null); setForm(emptyForm); setShowModal(true); };
    const openEdit = (b: Banner) => {
        setEditId(b.id);
        setForm({ title: b.title, imageUrl: b.imageUrl || "", svgContent: b.svgContent || "", position: b.position, isActive: b.isActive, sortOrder: b.sortOrder });
        setShowModal(true);
    };

    const saveBanner = async () => {
        const payload: any = { title: form.title, imageUrl: form.imageUrl || undefined, svgContent: form.svgContent || undefined, position: form.position, isActive: form.isActive, sortOrder: Number(form.sortOrder) || 0 };
        try {
            if (editId) { await api.patch(`/banners/${editId}`, payload); }
            else { await api.post("/banners", payload); }
            setShowModal(false); fetchBanners();
        } catch (e: any) { alert(e.response?.data?.message || "Error"); }
    };

    const toggleActive = async (b: Banner) => {
        try { await api.patch(`/banners/${b.id}`, { isActive: !b.isActive }); setBanners(prev => prev.map(x => x.id === b.id ? { ...x, isActive: !x.isActive } : x)); } catch { }
    };

    const deleteBanner = async (id: string) => {
        if (!confirm("¿Eliminar este banner?")) return;
        try { await api.delete(`/banners/${id}`); setBanners(prev => prev.filter(x => x.id !== id)); } catch { }
    };

    const moveOrder = async (id: string, dir: number) => {
        const sorted = [...filtered].sort((a, b) => a.sortOrder - b.sortOrder);
        const idx = sorted.findIndex(b => b.id === id);
        const newIdx = idx + dir;
        if (newIdx < 0 || newIdx >= sorted.length) return;
        const newIds = sorted.map(b => b.id);
        [newIds[idx], newIds[newIdx]] = [newIds[newIdx], newIds[idx]];
        try { await api.post("/banners/reorder", { ids: newIds }); fetchBanners(); } catch { }
    };

    const filtered = banners.filter(b => filterPos === "ALL" || b.position === filterPos);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div><h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>Banners & SVG</h1><p style={{ fontSize: 14, color: "#94a3b8", margin: 0, marginTop: 4 }}>Gestiona banners del hero, carrusel y decoraciones</p></div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={fetchBanners} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px" }}><RefreshCw style={{ width: 14, height: 14 }} /></button>
                    <button onClick={openCreate} className="btn-purple" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px" }}><Plus style={{ width: 16, height: 16 }} /> Nuevo Banner</button>
                </div>
            </div>

            {/* Filter by position */}
            <div style={{ display: "flex", gap: 8 }}>
                {["ALL", ...POSITIONS].map(p => (
                    <button key={p} onClick={() => setFilterPos(p)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid", borderColor: filterPos === p ? "#7c3aed" : "#e8eaf0", background: filterPos === p ? "#ede9fe" : "#fff", color: filterPos === p ? "#7c3aed" : "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                        {p === "ALL" ? "Todos" : POS_LABELS[p]}
                    </button>
                ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
                <div className="stat-card"><div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 44, height: 44, borderRadius: 12, background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🖼️</div><div><p style={{ fontSize: 24, fontWeight: 800, color: "#1e1b4b", margin: 0 }}>{banners.length}</p><p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Total</p></div></div></div>
                <div className="stat-card"><div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 44, height: 44, borderRadius: 12, background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>✅</div><div><p style={{ fontSize: 24, fontWeight: 800, color: "#1e1b4b", margin: 0 }}>{banners.filter(b => b.isActive).length}</p><p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Activos</p></div></div></div>
            </div>

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><div style={{ width: 32, height: 32, border: "3px solid #ede9fe", borderTopColor: "#7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /><style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style></div>
            ) : filtered.length === 0 ? (
                <div className="card empty-state"><div className="empty-state-icon" style={{ background: "#e0f2fe" }}><Image style={{ width: 28, height: 28, color: "#0ea5e9" }} /></div><p style={{ fontSize: 16, fontWeight: 600, color: "#1e1b4b" }}>Sin banners</p></div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
                    {filtered.sort((a, b) => a.sortOrder - b.sortOrder).map(b => (
                        <div key={b.id} className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12, opacity: b.isActive ? 1 : 0.6 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 6, ...(POS_COLORS[b.position] || POS_COLORS.HERO) }}>{POS_LABELS[b.position] || b.position}</span>
                                    <span style={{ fontSize: 11, color: "#94a3b8" }}>#{b.sortOrder}</span>
                                </div>
                                <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: b.isActive ? "#d1fae5" : "#fee2e2", color: b.isActive ? "#059669" : "#dc2626" }}>{b.isActive ? "Activo" : "Inactivo"}</span>
                            </div>
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>{b.title}</h3>
                            {b.imageUrl && <img src={b.imageUrl} alt={b.title} style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 10, border: "1px solid #e8eaf0" }} />}
                            {b.svgContent && <div style={{ padding: 12, background: "#f8f9fb", borderRadius: 10, border: "1px solid #e8eaf0", maxHeight: 120, overflow: "hidden" }} dangerouslySetInnerHTML={{ __html: b.svgContent }} />}
                            <div style={{ display: "flex", gap: 6 }}>
                                <button onClick={() => moveOrder(b.id, -1)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e8eaf0", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ArrowUp style={{ width: 14, height: 14, color: "#64748b" }} /></button>
                                <button onClick={() => moveOrder(b.id, 1)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e8eaf0", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ArrowDown style={{ width: 14, height: 14, color: "#64748b" }} /></button>
                                <button onClick={() => toggleActive(b)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "6px", borderRadius: 8, border: "1px solid #e8eaf0", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#64748b" }}>
                                    {b.isActive ? <><EyeOff style={{ width: 13, height: 13 }} /></> : <><Eye style={{ width: 13, height: 13 }} /></>}
                                </button>
                                <button onClick={() => openEdit(b)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e8eaf0", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Edit2 style={{ width: 14, height: 14, color: "#64748b" }} /></button>
                                <button onClick={() => deleteBanner(b.id)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #fee2e2", background: "#fef2f2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Trash2 style={{ width: 14, height: 14, color: "#ef4444" }} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()} style={{ width: 520, padding: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #e8eaf0" }}>
                            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>{editId ? "✏️ Editar Banner" : "➕ Nuevo Banner"}</h3>
                            <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X style={{ width: 20, height: 20, color: "#94a3b8" }} /></button>
                        </div>
                        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14, maxHeight: "70vh", overflowY: "auto" }}>
                            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>TÍTULO *</label><input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Ej: Hero Principal" /></div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>POSICIÓN</label>
                                    <select className="select" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} style={{ width: "100%" }}>
                                        {POSITIONS.map(p => <option key={p} value={p}>{POS_LABELS[p]}</option>)}
                                    </select>
                                </div>
                                <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>ORDEN</label><input className="input" type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: e.target.value })} /></div>
                            </div>
                            <div>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>IMAGEN (URL O ARCHIVO LOCAL)</label>
                                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                    <input className="input" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." style={{ flex: 1 }} />
                                    <label className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 16px", height: "100%", cursor: "pointer", opacity: uploading ? 0.6 : 1, margin: 0 }}>
                                        {uploading ? "Subiendo..." : "📤 Subir"}
                                        <input type="file" accept="image/*,video/*" style={{ display: "none" }} onChange={handleUpload} disabled={uploading} />
                                    </label>
                                </div>
                                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                                    <input type="checkbox" id="removeBgBanner" checked={removeBg} onChange={(e) => setRemoveBg(e.target.checked)} />
                                    <label htmlFor="removeBgBanner" style={{ fontSize: 12, color: "#64748b", cursor: "pointer" }}>✨ Quitar fondo con IA automáticamente</label>
                                </div>
                            </div>
                            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>CONTENIDO SVG</label><textarea className="input" value={form.svgContent} onChange={e => setForm({ ...form, svgContent: e.target.value })} placeholder='<svg ...>...</svg>' rows={4} style={{ resize: "vertical", fontFamily: "monospace", fontSize: 12 }} /></div>
                            {/* Preview */}
                            {(form.imageUrl || form.svgContent) && (
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>PREVIEW</label>
                                    {form.imageUrl && <img src={form.imageUrl} alt="preview" style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 10, border: "1px solid #e8eaf0", marginTop: 6 }} />}
                                    {form.svgContent && <div style={{ padding: 12, background: "#f8f9fb", borderRadius: 10, border: "1px solid #e8eaf0", marginTop: 6, maxHeight: 120, overflow: "hidden" }} dangerouslySetInnerHTML={{ __html: form.svgContent }} />}
                                </div>
                            )}
                            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                                <button onClick={() => setShowModal(false)} className="btn-secondary" style={{ flex: 1 }}>Cancelar</button>
                                <button onClick={saveBanner} className="btn-purple" style={{ flex: 1 }}>{editId ? "Guardar" : "Crear Banner"}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
