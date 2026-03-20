"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";import ThermalPrinterService from '@/lib/thermalPrinter';import { FileText, RefreshCw, Printer, Search, X, CheckCircle, DollarSign, Coins } from "lucide-react";

export default function BillingPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("ALL");
    const [printOrder, setPrintOrder] = useState<any>(null);

    const fetchOrders = async () => {
        setLoading(true);
        try { const { data } = await api.get("/orders"); setOrders(Array.isArray(data) ? data : []); }
        catch { setOrders([]); } finally { setLoading(false); }
    };
    useEffect(() => { fetchOrders(); }, []);

    const markAsPaid = async (orderId: string) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status: "DELIVERED" });
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "DELIVERED", paidAt: new Date().toISOString() } : o));
            const order = orders.find(o => o.id === orderId);
            if (order) setPrintOrder({ ...order, status: "DELIVERED", paidAt: new Date().toISOString() });
        } catch (e: any) { alert(e.response?.data?.message || "Error al cobrar"); }
    };

    const filtered = orders.filter(o => {
        if (filter === "PENDING") return !["DELIVERED", "CANCELLED"].includes(o.status);
        if (filter === "PAID") return o.status === "DELIVERED";
        if (filter === "CANCELLED") return o.status === "CANCELLED";
        return true;
    }).filter(o => !search || o.customerName?.toLowerCase().includes(search.toLowerCase()) || o.id?.includes(search));

    const pendingTotal = orders.filter(o => !["DELIVERED", "CANCELLED"].includes(o.status)).reduce((s, o) => s + Number(o.total || 0), 0);
    const paidTotal = orders.filter(o => o.status === "DELIVERED").reduce((s, o) => s + Number(o.total || 0), 0);

    const printTicket = async (order: any) => {
        try {
            // Send directly to thermal printer - no dialogs
            const success = await ThermalPrinterService.printInvoice({
                orderId: order.id,
                customerName: order.customerName,
                table: order.table?.number,
                items: order.items || order.orderItems || [],
                total: Number(order.total || 0),
                paidAt: order.paidAt,
                createdAt: order.createdAt,
                status: order.status,
                type: order.type,
            });

            if (success) {
                // Show success notification
                setPrintOrder({
                    ...order,
                    printSuccess: true,
                    printMessage: "✅ Factura impresa correctamente",
                });
                setTimeout(() => setPrintOrder(null), 2500);
            }
        } catch (error: any) {
            // Show error notification
            setPrintOrder({
                ...order,
                printSuccess: false,
                printMessage: error.message || "❌ Error al imprimir",
            });
            setTimeout(() => setPrintOrder(null), 3000);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div><h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>Facturación</h1><p style={{ fontSize: 14, color: "#94a3b8", margin: 0, marginTop: 4 }}>Notas de pedido y cobranza</p></div>
                <button onClick={fetchOrders} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px" }}><RefreshCw style={{ width: 14, height: 14 }} /> Actualizar</button>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
                <div className="stat-card" style={{ borderLeft: "4px solid #f97316" }}>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>💰 Pendiente de Cobro</p>
                    <p style={{ fontSize: 26, fontWeight: 800, color: "#f97316", margin: 0 }}>S/ {pendingTotal.toFixed(2)}</p>
                </div>
                <div className="stat-card" style={{ borderLeft: "4px solid #22c55e" }}>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>✅ Total Cobrado</p>
                    <p style={{ fontSize: 26, fontWeight: 800, color: "#22c55e", margin: 0 }}>S/ {paidTotal.toFixed(2)}</p>
                </div>
                <div className="stat-card" style={{ borderLeft: "4px solid #7c3aed" }}>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>📋 Total Pedidos</p>
                    <p style={{ fontSize: 26, fontWeight: 800, color: "#7c3aed", margin: 0 }}>{orders.length}</p>
                </div>
            </div>

            {/* Filter + Search */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 6 }}>
                    {[{ v: "ALL", l: "Todos" }, { v: "PENDING", l: "💰 Por cobrar" }, { v: "PAID", l: "✅ Cobrados" }, { v: "CANCELLED", l: "❌ Anulados" }].map(f => (
                        <button key={f.v} onClick={() => setFilter(f.v)} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, border: "1px solid", cursor: "pointer", background: filter === f.v ? "#ede9fe" : "#fff", borderColor: filter === f.v ? "#7c3aed" : "#e8eaf0", color: filter === f.v ? "#7c3aed" : "#64748b" }}>{f.l}</button>
                    ))}
                </div>
                <div style={{ position: "relative", flex: 1, minWidth: 200 }}><Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#94a3b8" }} /><input className="input" placeholder="Buscar por cliente o N° pedido..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38 }} /></div>
            </div>

            {/* Orders Table */}
            <div className="card" style={{ padding: 0 }}>
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><div style={{ width: 32, height: 32, border: "3px solid #ede9fe", borderTopColor: "#7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /><style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style></div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state"><div className="empty-state-icon" style={{ background: "#f0fdf4" }}><FileText style={{ width: 28, height: 28, color: "#22c55e" }} /></div><p style={{ fontSize: 16, fontWeight: 600, color: "#1e1b4b" }}>Sin pedidos</p></div>
                ) : (
                    <div style={{ overflowX: "auto" }}><table className="data-table"><thead><tr><th>N° Pedido</th><th>Cliente</th><th>Mesa</th><th>Items</th><th>Total</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr></thead>
                    <tbody>{filtered.map(o => {
                        const isPaid = o.status === "DELIVERED";
                        const isCancelled = o.status === "CANCELLED";
                        const isPending = !isPaid && !isCancelled;
                        return (
                            <tr key={o.id}>
                                <td style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 600, color: "#1e1b4b" }}>#{o.id?.slice(0, 8)?.toUpperCase()}</td>
                                <td>{o.customerName || "—"}</td>
                                <td>{o.table?.number ? <span style={{ background: "#ede9fe", color: "#7c3aed", padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>Mesa {o.table.number}</span> : "—"}</td>
                                <td style={{ fontSize: 12, color: "#64748b" }}>{(o.items || o.orderItems || []).length} items</td>
                                <td style={{ fontWeight: 700, fontSize: 14, color: "#1e1b4b" }}>S/ {Number(o.total || 0).toFixed(2)}</td>
                                <td><span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: isPaid ? "#d1fae5" : isCancelled ? "#fee2e2" : "#fef3c7", color: isPaid ? "#059669" : isCancelled ? "#dc2626" : "#d97706" }}>{isPaid ? "✅ Cancelado" : isCancelled ? "❌ Anulado" : "💰 Por cobrar"}</span></td>
                                <td style={{ fontSize: 12, color: "#64748b" }}>{o.createdAt ? new Date(o.createdAt).toLocaleString("es-PE") : ""}</td>
                                <td>
                                    <div style={{ display: "flex", gap: 4 }}>
                                        {isPending && <button onClick={() => markAsPaid(o.id)} title="Cobrar" style={{ padding: "6px 12px", borderRadius: 8, border: "none", background: "#22c55e", color: "#fff", cursor: "pointer", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><Coins style={{ width: 13, height: 13 }} /> Cobrar</button>}
                                        <button onClick={() => printTicket(o)} title="Imprimir" style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #e8eaf0", background: "#fff", cursor: "pointer" }}><Printer style={{ width: 13, height: 13, color: "#64748b" }} /></button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}</tbody></table></div>
                )}
            </div>

            {/* Print Preview Modal */}
            {printOrder && (
                <div className="modal-overlay" onClick={() => setPrintOrder(null)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()} style={{ width: 380, padding: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #e8eaf0" }}>
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>🧾 Nota de Pedido</h3>
                            <button onClick={() => setPrintOrder(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X style={{ width: 18, height: 18, color: "#94a3b8" }} /></button>
                        </div>
                        <div style={{ padding: 20, textAlign: "center" }}>
                            <CheckCircle style={{ width: 48, height: 48, color: "#22c55e", margin: "0 auto 12px" }} />
                            <p style={{ fontSize: 18, fontWeight: 800, color: "#22c55e" }}>CANCELADO</p>
                            <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>Pedido cobrado exitosamente</p>
                            <div style={{ textAlign: "left", background: "#f8f9fb", borderRadius: 12, padding: 16, fontSize: 13, color: "#1e1b4b" }}>
                                <p><strong>N°:</strong> #{printOrder.id?.slice(0, 8)?.toUpperCase()}</p>
                                {printOrder.customerName && <p><strong>Cliente:</strong> {printOrder.customerName}</p>}
                                {printOrder.table?.number && <p><strong>Mesa:</strong> {printOrder.table.number}</p>}
                                <div style={{ borderTop: "1px dashed #e8eaf0", margin: "10px 0", paddingTop: 10 }}>
                                    {(printOrder.items || printOrder.orderItems || []).map((i: any, idx: number) => (
                                        <p key={idx}>{i.quantity || 1}x {i.productName || i.product?.name || i.name || "Producto"} — S/ {(Number(i.unitPrice || i.price || 0) * (i.quantity || 1)).toFixed(2)}</p>
                                    ))}
                                </div>
                                <div style={{ borderTop: "2px solid #1e1b4b", marginTop: 10, paddingTop: 10 }}>
                                    <p style={{ fontSize: 18, fontWeight: 800 }}>TOTAL: S/ {Number(printOrder.total || 0).toFixed(2)}</p>
                                </div>
                            </div>
                            <button onClick={() => { printTicket(printOrder); setPrintOrder(null); }} className="btn-purple" style={{ marginTop: 16, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><Printer style={{ width: 16, height: 16 }} /> Imprimir Ticket</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
