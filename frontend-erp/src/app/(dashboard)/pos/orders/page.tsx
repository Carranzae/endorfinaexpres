"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { api } from "@/lib/axios";
import { useSocket } from "@/hooks/useSocket";
import { ShoppingCart, Plus, RefreshCw, Search, Eye, Trash2, X, Printer, ChevronDown, Volume2 } from "lucide-react";

const STATUS_OPTIONS = [
    { value: "PENDING", label: "Pendiente", bg: "#fef3c7", color: "#d97706" },
    { value: "PREPARING", label: "Preparando", bg: "#e0e7ff", color: "#4f46e5" },
    { value: "READY", label: "Listo", bg: "#d1fae5", color: "#059669" },
    { value: "DELIVERED", label: "Entregado", bg: "#dbeafe", color: "#2563eb" },
    { value: "CANCELLED", label: "Cancelado", bg: "#fee2e2", color: "#dc2626" },
];

const ORDER_TYPE_LABELS: Record<string, string> = { DINE_IN: "En local", TAKEAWAY: "Para llevar", DELIVERY: "Delivery" };

function playNewOrderSound() {
    try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const playBeep = (freq: number, startTime: number, dur: number) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = "square";
            osc.frequency.setValueAtTime(freq, startTime);
            gain.gain.setValueAtTime(0.6, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + dur);
            osc.start(startTime);
            osc.stop(startTime + dur);
        };
        // Strong triple-beep pattern
        playBeep(880, ctx.currentTime, 0.15);
        playBeep(1100, ctx.currentTime + 0.2, 0.15);
        playBeep(1320, ctx.currentTime + 0.4, 0.25);
    } catch { }
}

export default function OrdersPage() {
    const { on } = useSocket();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [newOrderFlash, setNewOrderFlash] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await api.get("/orders");
            setOrders(Array.isArray(data) ? data : []);
        } catch { setOrders([]); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchOrders(); }, []);

    // Socket.IO: listen for new orders
    useEffect(() => {
        const unsub = on("pos:newOrder", (data: any) => {
            playNewOrderSound();
            setNewOrderFlash(true);
            setTimeout(() => setNewOrderFlash(false), 2000);
            // Add the new order to the list or refresh
            if (data?.order) {
                setOrders(prev => [data.order, ...prev]);
            } else {
                fetchOrders();
            }
        });
        return unsub;
    }, [on]);

    const updateStatus = async (id: string, status: string) => {
        try {
            await api.patch(`/orders/${id}/status`, { status });
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
            if (selectedOrder?.id === id) setSelectedOrder({ ...selectedOrder, status });
        } catch (e) { console.error(e); }
    };

    const deleteOrder = async (id: string) => {
        if (!confirm("¿Eliminar este pedido?")) return;
        try {
            await api.delete(`/orders/${id}`);
            setOrders(prev => prev.filter(o => o.id !== id));
            if (selectedOrder?.id === id) setSelectedOrder(null);
        } catch (e) { console.error(e); }
    };

    const filtered = orders.filter(o => {
        const matchSearch = !search || o.customerName?.toLowerCase().includes(search.toLowerCase()) || o.id?.includes(search);
        const matchStatus = filterStatus === "ALL" || o.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const getStatus = (status: string) => {
        const s = STATUS_OPTIONS.find(o => o.value === status) || STATUS_OPTIONS[0];
        return <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.color }} />{s.label}
        </span>;
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* New order flash */}
            {newOrderFlash && <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #22c55e, #86efac, #22c55e)", zIndex: 9999, animation: "flash-bar 0.5s ease-in-out 3" }} />
            }
            <style>{`@keyframes flash-bar { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>Gestión de Pedidos</h1>
                    <p style={{ fontSize: 14, color: "#94a3b8", margin: 0, marginTop: 4 }}>Administra todos los pedidos del restaurante</p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={fetchOrders} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px" }}>
                        <RefreshCw style={{ width: 14, height: 14 }} /> Actualizar
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ position: "relative", flex: "1 1 300px" }}>
                    <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#94a3b8" }} />
                    <input className="input" placeholder="Buscar por cliente o ID de pedido..." value={search} onChange={e => setSearch(e.target.value)}
                        style={{ paddingLeft: 38 }} />
                </div>
                <select className="select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: 200 }}>
                    <option value="ALL">Todos los estados</option>
                    {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
            </div>

            {/* Orders Grid */}
            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
                    <div style={{ width: 36, height: 36, border: "3px solid #ede9fe", borderTopColor: "#7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : filtered.length === 0 ? (
                <div className="card empty-state">
                    <div className="empty-state-icon" style={{ background: "#ede9fe" }}>
                        <ShoppingCart style={{ width: 28, height: 28, color: "#7c3aed" }} />
                    </div>
                    <p style={{ fontSize: 16, fontWeight: 600, color: "#1e1b4b" }}>No hay pedidos</p>
                    <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>Los pedidos de clientes aparecerán aquí</p>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
                    {filtered.map(order => (
                        <div key={order.id} className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
                            {/* Card Header */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#7c3aed" }}>
                                        {order.customerName?.charAt(0) || "?"}
                                    </div>
                                    <div>
                                        <p style={{ fontSize: 14, fontWeight: 600, color: "#1e1b4b", margin: 0 }}>{order.customerName || "Cliente"}</p>
                                        <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>Pedido #{order.id?.slice(0, 8)}</p>
                                    </div>
                                </div>
                                {getStatus(order.status)}
                            </div>

                            {/* Type & Date */}
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748b" }}>
                                <span>📍 {ORDER_TYPE_LABELS[order.orderType] || order.orderType}</span>
                                <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString("es-PE", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : ""}</span>
                            </div>

                            {/* Items */}
                            {order.items?.length > 0 && (
                                <div style={{ background: "#f8f9fb", borderRadius: 10, padding: 12 }}>
                                    <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>Productos ({order.items.length}):</p>
                                    {order.items.slice(0, 3).map((item: any, i: number) => (
                                        <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#1e1b4b", padding: "3px 0" }}>
                                            <span>{item.quantity}x {item.product?.name || "Producto"}</span>
                                            <span style={{ fontWeight: 600 }}>S/ {Number(item.totalPrice || 0).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Total */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: "1px solid #e8eaf0" }}>
                                <span style={{ fontSize: 20, fontWeight: 800, color: "#1e1b4b" }}>S/ {Number(order.total || 0).toFixed(2)}</span>
                            </div>

                            {/* Actions */}
                            <div style={{ display: "flex", gap: 8 }}>
                                <button onClick={() => setSelectedOrder(order)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px", borderRadius: 10, border: "1px solid #e8eaf0", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#64748b" }}>
                                    <Eye style={{ width: 14, height: 14 }} /> Ver
                                </button>
                                <button style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "8px", borderRadius: 10, border: "1px solid #e8eaf0", background: "#fff", cursor: "pointer" }}>
                                    <Printer style={{ width: 14, height: 14, color: "#64748b" }} />
                                </button>
                                <button onClick={() => deleteOrder(order.id)} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "8px", borderRadius: 10, border: "1px solid #fee2e2", background: "#fef2f2", cursor: "pointer" }}>
                                    <Trash2 style={{ width: 14, height: 14, color: "#ef4444" }} />
                                </button>
                                {/* Status dropdown */}
                                <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)}
                                    style={{ padding: "8px 28px 8px 10px", borderRadius: 10, border: "1px solid #e8eaf0", fontSize: 12, fontWeight: 500, cursor: "pointer", background: "#f8f9fb", color: "#1e1b4b", outline: "none", appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2364748b'%3E%3Cpath d='M3 4.5l3 3 3-3'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}>
                                    {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            {selectedOrder && (
                <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()} style={{ width: 600, padding: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #e8eaf0" }}>
                            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>🛒 Pedido #{selectedOrder.id?.slice(0, 8)}</h3>
                            <button onClick={() => setSelectedOrder(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                                <X style={{ width: 20, height: 20, color: "#94a3b8" }} />
                            </button>
                        </div>
                        <div style={{ padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                            <div>
                                <h4 style={{ fontSize: 14, fontWeight: 700, color: "#1e1b4b", marginBottom: 16 }}>📋 Información del Pedido</h4>
                                <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13 }}>
                                    <div><span style={{ color: "#94a3b8" }}>Cliente</span><p style={{ fontWeight: 600, color: "#1e1b4b", margin: 0 }}>{selectedOrder.customerName}</p></div>
                                    <div><span style={{ color: "#94a3b8" }}>Tipo de Pedido</span><p style={{ fontWeight: 500, color: "#1e1b4b", margin: 0 }}>📍 {ORDER_TYPE_LABELS[selectedOrder.orderType] || selectedOrder.orderType}</p></div>
                                    <div><span style={{ color: "#94a3b8" }}>Estado del Pedido</span><div style={{ marginTop: 4 }}>{getStatus(selectedOrder.status)}</div>
                                        <select value={selectedOrder.status} onChange={e => updateStatus(selectedOrder.id, e.target.value)} className="select" style={{ marginTop: 8 }}>
                                            {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                        </select>
                                    </div>
                                    <div><span style={{ color: "#94a3b8" }}>Fecha y Hora</span><p style={{ fontWeight: 500, color: "#1e1b4b", margin: 0 }}>{selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString("es-PE") : "N/A"}</p></div>
                                </div>
                            </div>
                            <div>
                                <h4 style={{ fontSize: 14, fontWeight: 700, color: "#1e1b4b", marginBottom: 16 }}>💰 Resumen de Pago</h4>
                                <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#94a3b8" }}>Subtotal:</span><span style={{ fontWeight: 500 }}>S/ {Number(selectedOrder.subtotal || selectedOrder.total || 0).toFixed(2)}</span></div>
                                    <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: "2px solid #e8eaf0" }}>
                                        <span style={{ fontWeight: 700, fontSize: 15, color: "#1e1b4b" }}>Total:</span>
                                        <span style={{ fontWeight: 800, fontSize: 18, color: "#7c3aed" }}>S/ {Number(selectedOrder.total || 0).toFixed(2)}</span>
                                    </div>
                                </div>
                                <div style={{ marginTop: 20, padding: 12, background: "#f8f9fb", borderRadius: 10 }}>
                                    <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Estado del pedido:</p>
                                    <p style={{ fontSize: 13, fontWeight: 600, color: "#1e1b4b", margin: 0, marginTop: 4 }}>{STATUS_OPTIONS.find(s=>s.value === selectedOrder.status)?.label || "Pendiente"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
