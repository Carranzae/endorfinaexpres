"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { UtensilsCrossed, Plus, RefreshCw, Search, Edit2, Trash2, X, Grid, List, ArrowUp, ArrowDown, Image } from "lucide-react";

export default function MenuPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [catFilter, setCatFilter] = useState("ALL");
    const [sortBy, setSortBy] = useState("name");
    const [sortDir, setSortDir] = useState<"asc"|"desc">("asc");
    const [view, setView] = useState<"grid"|"list">("grid");
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [formData, setFormData] = useState({ name: "", description: "", price: "", categoryId: "", stockQuantity: "0", imageUrl: "" });
    const [uploading, setUploading] = useState(false);
    const [removeBg, setRemoveBg] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [p, c] = await Promise.all([api.get("/products"), api.get("/categories")]);
            setProducts(Array.isArray(p.data) ? p.data : []);
            setCategories(Array.isArray(c.data) ? c.data : []);
        } catch { }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const openCreate = () => {
        setEditingProduct(null);
        setFormData({ name: "", description: "", price: "", categoryId: categories[0]?.id || "", stockQuantity: "0", imageUrl: "" });
        setShowForm(true);
    };

    const openEdit = (p: any) => {
        setEditingProduct(p);
        setFormData({ name: p.name, description: p.description || "", price: String(p.price), categoryId: p.categoryId, stockQuantity: String(p.stockQuantity), imageUrl: p.imageUrl || "" });
        setShowForm(true);
    };

    const saveProduct = async () => {
        const body = { ...formData, price: Number(formData.price), stockQuantity: Number(formData.stockQuantity) };
        try {
            if (editingProduct) {
                const { data } = await api.patch(`/products/${editingProduct.id}`, body);
                setProducts(prev => prev.map(p => p.id === editingProduct.id ? data : p));
            } else {
                const { data } = await api.post("/products", body);
                setProducts(prev => [...prev, data]);
            }
            setShowForm(false);
        } catch (e: any) { alert(e.response?.data?.message || "Error"); }
    };

    const deleteProduct = async (id: string) => {
        if (!confirm("¿Eliminar este producto?")) return;
        try { await api.delete(`/products/${id}`); setProducts(prev => prev.filter(p => p.id !== id)); }
        catch (e:any) { alert(e.response?.data?.message || "Error"); }
    };

    const uploadImage = async (file: File) => {
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            if (removeBg) fd.append("removeBg", "true");
            const { data } = await api.post("/upload/image", fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (data.url) {
                setFormData(prev => ({ ...prev, imageUrl: data.url }));
            }
        } catch (e: any) {
            alert(e.response?.data?.message || "Error al subir imagen");
        } finally {
            setUploading(false);
        }
    };

    const filtered = products.filter(p => {
        const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase());
        const matchCat = catFilter === "ALL" || p.categoryId === catFilter;
        return matchSearch && matchCat;
    }).sort((a, b) => {
        let val = 0;
        if (sortBy === "name") val = a.name.localeCompare(b.name);
        else if (sortBy === "price") val = Number(a.price) - Number(b.price);
        return sortDir === "desc" ? -val : val;
    });

    const priceRange = products.length > 0 ? { min: Math.min(...products.map(p => Number(p.price))), max: Math.max(...products.map(p => Number(p.price))) } : { min: 0, max: 0 };
    const avgPrice = products.length > 0 ? products.reduce((s, p) => s + Number(p.price), 0) / products.length : 0;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>Carta Express</h1>
                    <p style={{ fontSize: 14, color: "#94a3b8", margin: 0, marginTop: 4 }}>
                        {products.length} productos disponibles &nbsp;·&nbsp; $ S/ {priceRange.min.toFixed(2)} - S/ {priceRange.max.toFixed(2)} &nbsp;·&nbsp; Promedio: S/ {avgPrice.toFixed(2)}
                    </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", border: "1px solid #e8eaf0" }}>
                        <button onClick={() => setView("grid")} style={{ padding: "8px 14px", background: view === "grid" ? "#7c3aed" : "#fff", color: view === "grid" ? "#fff" : "#64748b", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Vista Grid</button>
                        <button onClick={() => setView("list")} style={{ padding: "8px 14px", background: view === "list" ? "#7c3aed" : "#fff", color: view === "list" ? "#fff" : "#64748b", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Vista Lista</button>
                    </div>
                    <button onClick={openCreate} className="btn-purple" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px" }}>
                        <Plus style={{ width: 16, height: 16 }} /> Agregar
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ position: "relative", flex: "1 1 280px" }}>
                    <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#94a3b8" }} />
                    <input className="input" placeholder="Buscar productos..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38 }} />
                </div>
                <select className="select" value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ width: 200 }}>
                    <option value="ALL">Todas las categorías</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <div style={{ display: "flex", gap: 4 }}>
                    {[{ v:"price", l:"Precio ↑", d:"asc" }, { v:"price", l:"Precio ↓", d:"desc" }, { v:"name", l:"A-Z", d:"asc" }, { v:"name", l:"Z-A", d:"desc" }].map((s, i) => (
                        <button key={i} onClick={() => { setSortBy(s.v); setSortDir(s.d as "asc"|"desc"); }}
                            style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e8eaf0", cursor: "pointer", fontSize: 11, fontWeight: 600,
                            background: sortBy === s.v && sortDir === s.d ? "#7c3aed" : "#fff",
                            color: sortBy === s.v && sortDir === s.d ? "#fff" : "#64748b" }}>{s.l}</button>
                    ))}
                </div>
            </div>

            {/* Products */}
            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
                    <div style={{ width: 36, height: 36, border: "3px solid #ede9fe", borderTopColor: "#7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : filtered.length === 0 ? (
                <div className="card empty-state">
                    <div className="empty-state-icon" style={{ background: "#fff7ed" }}>
                        <UtensilsCrossed style={{ width: 28, height: 28, color: "#f97316" }} />
                    </div>
                    <p style={{ fontSize: 16, fontWeight: 600, color: "#1e1b4b" }}>No hay productos</p>
                    <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>Agrega tu primer producto al menú</p>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: view === "grid" ? "repeat(auto-fill, minmax(240px, 1fr))" : "1fr", gap: 16 }}>
                    {filtered.map(p => {
                        const cat = categories.find(c => c.id === p.categoryId);
                        const lowStock = p.stockQuantity <= p.minStock;
                        return (
                            <div key={p.id} className="card" style={{ overflow: "hidden" }}>
                                {/* Image */}
                                <div style={{ height: view === "grid" ? 160 : 80, background: "#f8f9fb", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                                    {p.imageUrl ? (
                                        <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : (
                                        <Image style={{ width: 40, height: 40, color: "#d4d4d8" }} />
                                    )}
                                    {/* Status badges */}
                                    <div style={{ position: "absolute", top: 8, left: 8, display: "flex", gap: 4 }}>
                                        <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: p.isActive ? "#d1fae5" : "#fee2e2", color: p.isActive ? "#059669" : "#dc2626" }}>
                                            {p.isActive ? "Activo" : "Inactivo"}
                                        </span>
                                        {lowStock && <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: "#fee2e2", color: "#dc2626" }}>Stock Bajo</span>}
                                    </div>
                                    {/* Price badge */}
                                    <div style={{ position: "absolute", bottom: 8, left: 8 }}>
                                        <span style={{ padding: "4px 10px", borderRadius: 8, fontSize: 13, fontWeight: 800, background: "#7c3aed", color: "#fff" }}>
                                            S/ {Number(p.price).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                {/* Info */}
                                <div style={{ padding: 16 }}>
                                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>{p.name}</h3>
                                    {p.description && <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, marginTop: 4, lineHeight: 1.4 }}>{p.description}</p>}
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                                        <span style={{ fontSize: 11, fontWeight: 600, color: "#7c3aed", background: "#ede9fe", padding: "2px 8px", borderRadius: 6 }}>{cat?.name || "Sin categoría"}</span>
                                        <span style={{ fontSize: 11, color: "#94a3b8" }}>📦 {p.stockQuantity}</span>
                                    </div>
                                    <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                                        <button onClick={() => openEdit(p)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "7px 10px", borderRadius: 8, border: "1px solid #e8eaf0", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#64748b" }}>
                                            <Edit2 style={{ width: 13, height: 13 }} /> Editar
                                        </button>
                                        <button onClick={() => deleteProduct(p.id)} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "7px 10px", borderRadius: 8, border: "1px solid #fee2e2", background: "#fef2f2", cursor: "pointer" }}>
                                            <Trash2 style={{ width: 13, height: 13, color: "#ef4444" }} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()} style={{ width: 500, padding: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #e8eaf0" }}>
                            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>{editingProduct ? "✏️ Editar Producto" : "➕ Nuevo Producto"}</h3>
                            <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X style={{ width: 20, height: 20, color: "#94a3b8" }} /></button>
                        </div>
                        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>NOMBRE</label><input className="input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Nombre del producto" /></div>
                            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>DESCRIPCIÓN</label><textarea className="input" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Descripción" style={{ minHeight: 70, resize: "vertical" }} /></div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>PRECIO (S/)</label><input className="input" type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="0.00" /></div>
                                <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>STOCK</label><input className="input" type="number" value={formData.stockQuantity} onChange={e => setFormData({ ...formData, stockQuantity: e.target.value })} /></div>
                            </div>
                            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>CATEGORÍA</label><select className="select" value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })}>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                            <div>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>IMAGEN DEL PRODUCTO</label>
                                {formData.imageUrl && (
                                    <div style={{ marginBottom: 10, position: "relative", display: "inline-block" }}>
                                        <img src={formData.imageUrl} alt="Preview" style={{ width: 120, height: 120, borderRadius: 10, objectFit: "cover", border: "2px solid #e8eaf0" }} />
                                        <button onClick={() => setFormData({ ...formData, imageUrl: "" })} style={{ position: "absolute", top: -6, right: -6, width: 22, height: 22, borderRadius: "50%", background: "#ef4444", color: "#fff", border: "none", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}><X style={{ width: 12, height: 12 }} /></button>
                                    </div>
                                )}
                                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                                    <label style={{ padding: "8px 16px", borderRadius: 8, background: uploading ? "#e8eaf0" : "#7c3aed", color: "#fff", fontSize: 12, fontWeight: 600, cursor: uploading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                                        <Image style={{ width: 14, height: 14 }} /> {uploading ? "Subiendo..." : "📷 Subir Imagen"}
                                        <input type="file" accept="image/*" hidden onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f); }} disabled={uploading} />
                                    </label>
                                    <label style={{ fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                                        <input type="checkbox" checked={removeBg} onChange={e => setRemoveBg(e.target.checked)} style={{ accentColor: "#7c3aed" }} />
                                        🤖 Quitar fondo con IA
                                    </label>
                                </div>
                                <input className="input" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="O pega una URL: https://..." style={{ fontSize: 11 }} />
                            </div>
                            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                                <button onClick={() => setShowForm(false)} className="btn-secondary" style={{ flex: 1 }}>Cancelar</button>
                                <button onClick={saveProduct} className="btn-purple" style={{ flex: 1 }}>{editingProduct ? "Guardar" : "Crear Producto"}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
