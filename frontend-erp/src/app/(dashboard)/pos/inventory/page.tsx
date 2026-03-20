"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Package, RefreshCw, Plus, Search, ArrowUpDown, AlertTriangle, X } from "lucide-react";

export default function InventoryPage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [adjustModal, setAdjustModal] = useState<any>(null);
    const [adjustQty, setAdjustQty] = useState("0");
    const [adjustReason, setAdjustReason] = useState("");

    const fetchItems = async () => {
        setLoading(true);
        try { const { data } = await api.get("/inventory"); setItems(Array.isArray(data) ? data : []); }
        catch { try { const { data } = await api.get("/products"); setItems(Array.isArray(data) ? data : []); } catch { setItems([]); } }
        finally { setLoading(false); }
    };
    useEffect(() => { fetchItems(); }, []);

    const adjustStock = async () => {
        if (!adjustModal) return;
        try {
            await api.patch(`/inventory/${adjustModal.id}/adjust`, { quantity: Number(adjustQty), reason: adjustReason });
            fetchItems();
            setAdjustModal(null);
        } catch (e: any) {
            try { await api.patch(`/products/${adjustModal.id}`, { stockQuantity: (adjustModal.stockQuantity || 0) + Number(adjustQty) }); fetchItems(); setAdjustModal(null); }
            catch { alert("Error al ajustar stock"); }
        }
    };

    const filtered = items.filter(i => !search || i.name?.toLowerCase().includes(search.toLowerCase()));
    const lowStockItems = items.filter(i => i.stockQuantity <= (i.minStock || 5));

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>Inventario</h1>
                    <p style={{ fontSize: 14, color: "#94a3b8", margin: 0, marginTop: 4 }}>Control de stock de productos</p>
                </div>
                <button onClick={fetchItems} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px" }}>
                    <RefreshCw style={{ width: 14, height: 14 }} /> Actualizar
                </button>
            </div>

            {lowStockItems.length > 0 && (
                <div style={{ background: "#fef3c7", border: "1px solid #fcd34d", borderRadius: 14, padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "#92400e" }}>
                    <AlertTriangle style={{ width: 18, height: 18, color: "#f59e0b" }} />
                    <span><strong>{lowStockItems.length} productos</strong> con stock bajo requieren reposición</span>
                </div>
            )}

            <div style={{ position: "relative", maxWidth: 400 }}>
                <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#94a3b8" }} />
                <input className="input" placeholder="Buscar productos..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38 }} />
            </div>

            <div className="card" style={{ padding: 0 }}>
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><div style={{ width: 32, height: 32, border: "3px solid #ede9fe", borderTopColor: "#7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /><style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style></div>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table className="data-table">
                            <thead><tr><th>Producto</th><th>Categoría</th><th>Stock Actual</th><th>Stock Mín.</th><th>Estado</th><th>Precio</th><th>Acción</th></tr></thead>
                            <tbody>
                                {filtered.map(item => {
                                    const low = item.stockQuantity <= (item.minStock || 5);
                                    return (
                                        <tr key={item.id}>
                                            <td style={{ fontWeight: 600, color: "#1e1b4b" }}>{item.name}</td>
                                            <td><span style={{ background: "#ede9fe", color: "#7c3aed", padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 500 }}>{item.category?.name || "—"}</span></td>
                                            <td style={{ fontWeight: 700, color: low ? "#ef4444" : "#1e1b4b" }}>{item.stockQuantity}</td>
                                            <td style={{ color: "#94a3b8" }}>{item.minStock || 5}</td>
                                            <td>{low
                                                ? <span style={{ background: "#fee2e2", color: "#dc2626", padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>⚠ Bajo</span>
                                                : <span style={{ background: "#d1fae5", color: "#059669", padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>✓ OK</span>
                                            }</td>
                                            <td style={{ fontWeight: 600 }}>S/ {Number(item.price || 0).toFixed(2)}</td>
                                            <td>
                                                <button onClick={() => { setAdjustModal(item); setAdjustQty("0"); setAdjustReason(""); }}
                                                    style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #e8eaf0", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#7c3aed", display: "flex", alignItems: "center", gap: 4 }}>
                                                    <ArrowUpDown style={{ width: 13, height: 13 }} /> Ajustar
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {adjustModal && (
                <div className="modal-overlay" onClick={() => setAdjustModal(null)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()} style={{ width: 400, padding: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #e8eaf0" }}>
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>📦 Ajustar Stock: {adjustModal.name}</h3>
                            <button onClick={() => setAdjustModal(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X style={{ width: 20, height: 20, color: "#94a3b8" }} /></button>
                        </div>
                        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
                            <p style={{ fontSize: 13, color: "#64748b" }}>Stock actual: <strong>{adjustModal.stockQuantity}</strong></p>
                            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>CANTIDAD (+ agregar / - quitar)</label><input className="input" type="number" value={adjustQty} onChange={e => setAdjustQty(e.target.value)} /></div>
                            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>RAZÓN</label><input className="input" value={adjustReason} onChange={e => setAdjustReason(e.target.value)} placeholder="Motivo del ajuste" /></div>
                            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                                <button onClick={() => setAdjustModal(null)} className="btn-secondary" style={{ flex: 1 }}>Cancelar</button>
                                <button onClick={adjustStock} className="btn-purple" style={{ flex: 1 }}>Aplicar Ajuste</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
