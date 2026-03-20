"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Tag, RefreshCw, Plus, Trash2, Edit2, X, Eye, EyeOff } from "lucide-react";

interface Promotion {
    id: string;
    title: string;
    description?: string;
    imageUrl?: string;
    videoUrl?: string;
    discountPercent?: number;
    discountAmount?: number;
    isActive: boolean;
    startDate?: string;
    endDate?: string;
    createdAt: string;
}

const emptyForm = { title: "", description: "", imageUrl: "", videoUrl: "", discountPercent: "", discountAmount: "", isActive: true, startDate: "", endDate: "" };

export default function PromotionsPage() {
    const [promos, setPromos] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState<any>(emptyForm);
    const [uploading, setUploading] = useState<{ image: boolean, video: boolean }>({ image: false, video: false });
    const [removeBg, setRemoveBg] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "imageUrl" | "videoUrl") => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(prev => ({ ...prev, [field === "imageUrl" ? "image" : "video"]: true }));
        const formData = new FormData();
        formData.append("file", file);
        if (field === "imageUrl" && removeBg) formData.append("removeBg", "true");
        try {
            const { data } = await api.post("/upload/image", formData, { headers: { "Content-Type": "multipart/form-data" } });
            setForm({ ...form, [field]: data.url });
        } catch (err: any) {
            alert("Error al subir archivo: " + (err.response?.data?.message || err.message));
        } finally {
            setUploading(prev => ({ ...prev, [field === "imageUrl" ? "image" : "video"]: false }));
        }
    };

    const fetchPromos = async () => {
        setLoading(true);
        try { const { data } = await api.get("/promotions"); setPromos(Array.isArray(data) ? data : []); }
        catch { setPromos([]); } finally { setLoading(false); }
    };
    useEffect(() => { fetchPromos(); }, []);

    const openCreate = () => { setEditId(null); setForm(emptyForm); setShowModal(true); };
    const openEdit = (p: Promotion) => {
        setEditId(p.id);
        setForm({
            title: p.title, description: p.description || "", imageUrl: p.imageUrl || "", videoUrl: p.videoUrl || "",
            discountPercent: p.discountPercent?.toString() || "", discountAmount: p.discountAmount?.toString() || "",
            isActive: p.isActive, startDate: p.startDate ? p.startDate.slice(0, 10) : "", endDate: p.endDate ? p.endDate.slice(0, 10) : "",
        });
        setShowModal(true);
    };

    const savePromo = async () => {
        const payload: any = { title: form.title, description: form.description || undefined, imageUrl: form.imageUrl || undefined, videoUrl: form.videoUrl || undefined, isActive: form.isActive };
        if (form.discountPercent) payload.discountPercent = Number(form.discountPercent);
        if (form.discountAmount) payload.discountAmount = Number(form.discountAmount);
        if (form.startDate) payload.startDate = form.startDate;
        if (form.endDate) payload.endDate = form.endDate;
        try {
            if (editId) { await api.patch(`/promotions/${editId}`, payload); }
            else { await api.post("/promotions", payload); }
            setShowModal(false); fetchPromos();
        } catch (e: any) { alert(e.response?.data?.message || "Error"); }
    };

    const toggleActive = async (p: Promotion) => {
        try { await api.patch(`/promotions/${p.id}`, { isActive: !p.isActive }); setPromos(prev => prev.map(x => x.id === p.id ? { ...x, isActive: !x.isActive } : x)); }
        catch { }
    };

    const deletePromo = async (id: string) => {
        if (!confirm("¿Eliminar esta promoción?")) return;
        try { await api.delete(`/promotions/${id}`); setPromos(prev => prev.filter(x => x.id !== id)); } catch { }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div><h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>Promociones</h1><p style={{ fontSize: 14, color: "#94a3b8", margin: 0, marginTop: 4 }}>Gestiona las promociones del restaurante</p></div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={fetchPromos} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px" }}><RefreshCw style={{ width: 14, height: 14 }} /></button>
                    <button onClick={openCreate} className="btn-purple" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px" }}><Plus style={{ width: 16, height: 16 }} /> Nueva Promoción</button>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
                <div className="stat-card"><div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 44, height: 44, borderRadius: 12, background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏷️</div><div><p style={{ fontSize: 24, fontWeight: 800, color: "#1e1b4b", margin: 0 }}>{promos.length}</p><p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Total</p></div></div></div>
                <div className="stat-card"><div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 44, height: 44, borderRadius: 12, background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>✅</div><div><p style={{ fontSize: 24, fontWeight: 800, color: "#1e1b4b", margin: 0 }}>{promos.filter(p => p.isActive).length}</p><p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Activas</p></div></div></div>
            </div>

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><div style={{ width: 32, height: 32, border: "3px solid #ede9fe", borderTopColor: "#7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /><style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style></div>
            ) : promos.length === 0 ? (
                <div className="card empty-state"><div className="empty-state-icon" style={{ background: "#fef3c7" }}><Tag style={{ width: 28, height: 28, color: "#f59e0b" }} /></div><p style={{ fontSize: 16, fontWeight: 600, color: "#1e1b4b" }}>Sin promociones</p></div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
                    {promos.map(p => (
                        <div key={p.id} className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12, opacity: p.isActive ? 1 : 0.6 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>{p.title}</h3>
                                <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: p.isActive ? "#d1fae5" : "#fee2e2", color: p.isActive ? "#059669" : "#dc2626" }}>{p.isActive ? "Activa" : "Inactiva"}</span>
                            </div>
                            {p.description && <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>{p.description}</p>}
                            {p.imageUrl && <img src={p.imageUrl} alt={p.title} style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 10, border: "1px solid #e8eaf0" }} />}
                            <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#64748b" }}>
                                {p.discountPercent && <span style={{ background: "#fef3c7", color: "#d97706", padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>-{p.discountPercent}%</span>}
                                {p.discountAmount && <span style={{ background: "#d1fae5", color: "#059669", padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>-S/ {Number(p.discountAmount).toFixed(2)}</span>}
                                {p.startDate && <span>Desde: {new Date(p.startDate).toLocaleDateString("es-PE")}</span>}
                                {p.endDate && <span>Hasta: {new Date(p.endDate).toLocaleDateString("es-PE")}</span>}
                            </div>
                            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                                <button onClick={() => toggleActive(p)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px", borderRadius: 10, border: "1px solid #e8eaf0", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#64748b" }}>
                                    {p.isActive ? <><EyeOff style={{ width: 14, height: 14 }} /> Desactivar</> : <><Eye style={{ width: 14, height: 14 }} /> Activar</>}
                                </button>
                                <button onClick={() => openEdit(p)} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 12px", borderRadius: 10, border: "1px solid #e8eaf0", background: "#fff", cursor: "pointer" }}>
                                    <Edit2 style={{ width: 14, height: 14, color: "#64748b" }} />
                                </button>
                                <button onClick={() => deletePromo(p.id)} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 12px", borderRadius: 10, border: "1px solid #fee2e2", background: "#fef2f2", cursor: "pointer" }}>
                                    <Trash2 style={{ width: 14, height: 14, color: "#ef4444" }} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()} style={{ width: 520, padding: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #e8eaf0" }}>
                            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>{editId ? "✏️ Editar Promoción" : "➕ Nueva Promoción"}</h3>
                            <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X style={{ width: 20, height: 20, color: "#94a3b8" }} /></button>
                        </div>
                        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14, maxHeight: "70vh", overflowY: "auto" }}>
                            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>TÍTULO *</label><input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Ej: 2x1 en almuerzos" /></div>
                            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>DESCRIPCIÓN</label><textarea className="input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Descripción de la promo" rows={2} style={{ resize: "vertical" }} /></div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>IMAGEN (URL O ARCHIVO)</label>
                                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                        <input className="input" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." style={{ flex: 1 }} />
                                        <label className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 4, padding: "0 10px", height: "100%", cursor: "pointer", opacity: uploading.image ? 0.6 : 1, margin: 0 }}>
                                            {uploading.image ? "..." : "📤"}
                                            <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleUpload(e, "imageUrl")} disabled={uploading.image} />
                                        </label>
                                    </div>
                                    <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                                        <input type="checkbox" id="removeBgPromo" checked={removeBg} onChange={(e) => setRemoveBg(e.target.checked)} />
                                        <label htmlFor="removeBgPromo" style={{ fontSize: 12, color: "#64748b", cursor: "pointer" }}>✨ Quitar fondo automático</label>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>VIDEO (URL O ARCHIVO)</label>
                                    <div style={{ display: "flex", gap: 6 }}>
                                        <input className="input" value={form.videoUrl} onChange={e => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://..." style={{ flex: 1 }} />
                                        <label className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 4, padding: "0 10px", cursor: "pointer", opacity: uploading.video ? 0.6 : 1, margin: 0 }}>
                                            {uploading.video ? "..." : "📤"}
                                            <input type="file" accept="video/*" style={{ display: "none" }} onChange={(e) => handleUpload(e, "videoUrl")} disabled={uploading.video} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>% DESCUENTO</label><input className="input" type="number" value={form.discountPercent} onChange={e => setForm({ ...form, discountPercent: e.target.value })} placeholder="Ej: 20" /></div>
                                <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>MONTO DESCUENTO (S/)</label><input className="input" type="number" step="0.01" value={form.discountAmount} onChange={e => setForm({ ...form, discountAmount: e.target.value })} placeholder="Ej: 5.00" /></div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>FECHA INICIO</label><input className="input" type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} /></div>
                                <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>FECHA FIN</label><input className="input" type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} /></div>
                            </div>
                            {form.imageUrl && <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>PREVIEW</label><img src={form.imageUrl} alt="preview" style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 10, border: "1px solid #e8eaf0", marginTop: 6 }} /></div>}
                            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                                <button onClick={() => setShowModal(false)} className="btn-secondary" style={{ flex: 1 }}>Cancelar</button>
                                <button onClick={savePromo} className="btn-purple" style={{ flex: 1 }}>{editId ? "Guardar Cambios" : "Crear Promoción"}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
