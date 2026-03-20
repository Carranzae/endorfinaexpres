"use client";

import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import {
    ShoppingBag, Plus, Minus, Search, ArrowLeft, X,
    DollarSign, Printer, Send, Check, RefreshCw, Clock, MessageSquare, AlertTriangle,
} from "lucide-react";

type WaiterStep = "tables" | "menu" | "cart" | "my-orders";

interface CartItem { id: string; name: string; price: number; quantity: number; imageUrl?: string; notes?: string; }

export default function WaiterFlowPage() {
    const { profile } = useAuthStore();
    const [step, setStep] = useState<WaiterStep>("tables");
    const [tables, setTables] = useState<any[]>([]);
    const [selectedTable, setSelectedTable] = useState<any>(null);
    const [customerName, setCustomerName] = useState("");
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [activeCat, setActiveCat] = useState("all");
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [myOrders, setMyOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [orderSent, setOrderSent] = useState(false);
    const [showConfirmPay, setShowConfirmPay] = useState<string | null>(null);
    const refreshRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        Promise.all([
            api.get("/tables").catch(() => ({ data: [] })),
            api.get("/products").catch(() => ({ data: [] })),
            api.get("/categories").catch(() => ({ data: [] })),
        ]).then(([t, p, c]) => {
            setTables(Array.isArray(t.data) ? t.data : []);
            setProducts(Array.isArray(p.data) ? p.data : []);
            setCategories(Array.isArray(c.data) ? c.data : []);
        }).finally(() => setLoading(false));
    }, []);

    const fetchMyOrders = async () => {
        try { const { data } = await api.get("/orders"); setMyOrders(Array.isArray(data) ? data : []); }
        catch { setMyOrders([]); }
    };
    useEffect(() => { fetchMyOrders(); }, []);

    // Auto-refresh orders every 15 seconds when on the orders tab
    useEffect(() => {
        if (step === "my-orders") {
            refreshRef.current = setInterval(fetchMyOrders, 15000);
        }
        return () => { if (refreshRef.current) clearInterval(refreshRef.current); };
    }, [step]);

    const addToCart = (p: any) => setCart(prev => { const ex = prev.find(i => i.id === p.id); return ex ? prev.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i) : [...prev, { id: p.id, name: p.name, price: Number(p.price), quantity: 1, imageUrl: p.imageUrl }]; });
    const removeFromCart = (id: string) => setCart(prev => { const ex = prev.find(i => i.id === id); return ex && ex.quantity > 1 ? prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i) : prev.filter(i => i.id !== id); });
    const updateNotes = (id: string, notes: string) => setCart(prev => prev.map(i => i.id === id ? { ...i, notes } : i));
    const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
    const filtered = products.filter(p => (activeCat === "all" || p.categoryId === activeCat) && (!search || p.name?.toLowerCase().includes(search.toLowerCase())));

    const sendOrder = async () => {
        if (!selectedTable || cart.length === 0) return;
        setSending(true);
        try {
            await api.post("/orders", {
                tableId: selectedTable.id,
                customerName: customerName || "Cliente",
                type: "DINE_IN",
                items: cart.map(i => ({ productId: i.id, quantity: i.quantity, unitPrice: i.price, notes: i.notes })),
                total: cartTotal,
                waiterId: profile?.id,
            });
            setOrderSent(true);
            setCart([]);
            fetchMyOrders();
            setTimeout(() => { setOrderSent(false); setStep("my-orders"); }, 2000);
        } catch (e: any) { alert(e.response?.data?.message || "Error al enviar pedido"); }
        finally { setSending(false); }
    };

    const processPayment = async (orderId: string) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status: "DELIVERED" });
            fetchMyOrders();
            const order = myOrders.find(o => o.id === orderId);
            if (order) printTicket({ ...order, status: "DELIVERED" });
            setShowConfirmPay(null);
        } catch (e: any) { alert(e.response?.data?.message || "Error"); }
    };

    const printTicket = (order: any) => {
        const w = window.open("", "_blank", "width=320,height=600");
        if (!w) return;
        const items = (order.items || order.orderItems || []).map((i: any) => `<tr><td>${i.quantity || 1}x ${i.productName || i.product?.name || i.name || "Producto"}</td><td style="text-align:right">S/ ${(Number(i.unitPrice || i.price || 0) * (i.quantity || 1)).toFixed(2)}</td></tr>`).join("");
        w.document.write(`<html><head><title>Ticket</title><style>*{margin:0;padding:0;font-family:monospace;font-size:12px}body{padding:10px;width:280px}.center{text-align:center}.line{border-top:1px dashed #000;margin:8px 0}table{width:100%}td{padding:2px 0}.bold{font-weight:bold}.big{font-size:16px}.status{font-size:18px;font-weight:900;border:2px solid;padding:4px 12px;display:inline-block;margin:8px 0}</style></head><body>
        <div class="center"><p class="big bold">☕ ENDORFINA EXPRESS</p></div><div class="line"></div>
        <div class="center"><p class="status">✅ ENTREGADO</p></div><div class="line"></div>
        <p>N°: ${order.id?.slice(0, 8)?.toUpperCase()}</p>
        <p>Fecha: ${new Date().toLocaleString("es-PE")}</p>
        ${order.customerName ? `<p>Cliente: ${order.customerName}</p>` : ""}
        ${order.table?.number ? `<p>Mesa: ${order.table.number}</p>` : ""}
        <p>Mesero: ${profile?.fullName || "—"}</p>
        <div class="line"></div>
        <table><thead><tr><th style="text-align:left">Detalle</th><th style="text-align:right">Precio</th></tr></thead><tbody>${items}</tbody></table>
        <div class="line"></div>
        <table><tr><td class="bold big">TOTAL</td><td class="bold big" style="text-align:right">S/ ${Number(order.total || 0).toFixed(2)}</td></tr></table>
        <div class="line"></div>
        <div class="center"><p>¡Gracias por su preferencia!</p></div></body></html>`);
        w.document.close();
        setTimeout(() => w.print(), 500);
    };

    const getTimeSince = (dateStr: string) => {
        const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
        if (mins < 1) return "Ahora";
        if (mins < 60) return `${mins} min`;
        return `${Math.floor(mins / 60)}h ${mins % 60}m`;
    };

    // ═══════════════════════════════════════════
    //  ORDER SENT SUCCESS SCREEN
    // ═══════════════════════════════════════════
    if (orderSent) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center" }}>
                <div>
                    <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                        <Check style={{ width: 40, height: 40, color: "#fff" }} />
                    </div>
                    <h2 style={{ fontSize: 28, fontWeight: 800, color: "#22c55e", margin: "0 0 8px" }}>¡Pedido Enviado!</h2>
                    <p style={{ color: "#94a3b8", fontSize: 16 }}>El pedido ha sido enviado a cocina</p>
                </div>
            </div>
        );
    }

    // ═══════════════════════════════════════════
    //  MAIN UI
    // ═══════════════════════════════════════════
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1e1b4b", margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🍽️</span>
                        Panel de Mesero
                    </h1>
                    <p style={{ fontSize: 14, color: "#94a3b8", margin: "4px 0 0 54px" }}>Hola, <strong style={{ color: "#7c3aed" }}>{profile?.fullName || "Mesero"}</strong></p>
                </div>
                {selectedTable && (
                    <div style={{ padding: "8px 16px", borderRadius: 10, background: "#ede9fe", border: "1px solid #c4b5fd", display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#7c3aed" }}>🪑 Mesa {selectedTable.number}</span>
                        {customerName && <span style={{ fontSize: 12, color: "#64748b" }}>· {customerName}</span>}
                    </div>
                )}
            </div>

            {/* Tabs — Large for touch */}
            <div style={{ display: "flex", gap: 6, background: "#f5f6fa", borderRadius: 14, padding: 4 }}>
                {([
                    { id: "tables" as WaiterStep, label: "🪑 Mesas", count: 0 },
                    { id: "menu" as WaiterStep, label: "📋 Menú", count: 0 },
                    { id: "cart" as WaiterStep, label: "🛒 Carrito", count: cartCount },
                    { id: "my-orders" as WaiterStep, label: "📦 Pedidos", count: myOrders.length },
                ]).map(t => (
                    <button key={t.id} onClick={() => { if (t.id === "my-orders") fetchMyOrders(); setStep(t.id); }}
                        style={{
                            flex: 1, padding: "14px 12px", fontSize: 14, fontWeight: step === t.id ? 700 : 500,
                            color: step === t.id ? "#fff" : "#64748b",
                            background: step === t.id ? "linear-gradient(135deg, #7c3aed, #6d28d9)" : "transparent",
                            border: "none", borderRadius: 10, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                            boxShadow: step === t.id ? "0 4px 12px rgba(124,58,237,0.3)" : "none",
                            transition: "all 0.2s",
                        }}>
                        {t.label}
                        {t.count > 0 && <span style={{ background: step === t.id ? "rgba(255,255,255,0.3)" : "#7c3aed", color: "#fff", borderRadius: 8, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{t.count}</span>}
                    </button>
                ))}
            </div>

            {/* ═══════ STEP: Tables ═══════ */}
            {step === "tables" && (
                <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e1b4b", marginBottom: 16 }}>Seleccionar Mesa para el Pedido</h3>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>👤 NOMBRE DEL CLIENTE</label>
                        <input className="input" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Nombre del cliente (opcional)" style={{ maxWidth: 360, fontSize: 16, padding: "14px 16px" }} />
                    </div>
                    {loading ? <p style={{ color: "#94a3b8", textAlign: "center", padding: 40 }}>Cargando mesas...</p> : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 12 }}>
                            {tables.map(t => {
                                const isSelected = selectedTable?.id === t.id;
                                const statusColor = t.status === "AVAILABLE" ? "#22c55e" : t.status === "OCCUPIED" ? "#ef4444" : "#f59e0b";
                                const statusBg = t.status === "AVAILABLE" ? "#f0fdf4" : t.status === "OCCUPIED" ? "#fef2f2" : "#fef3c7";
                                return (
                                    <button key={t.id} onClick={() => { setSelectedTable(t); setStep("menu"); }}
                                        style={{
                                            padding: "24px 16px", borderRadius: 16,
                                            border: isSelected ? "3px solid #7c3aed" : "2px solid #e8eaf0",
                                            background: isSelected ? "#ede9fe" : statusBg,
                                            cursor: "pointer", textAlign: "center",
                                            boxShadow: isSelected ? "0 4px 16px rgba(124,58,237,0.2)" : "0 2px 4px rgba(0,0,0,0.05)",
                                            transition: "all 0.2s",
                                        }}>
                                        <p style={{ fontSize: 28, fontWeight: 800, color: "#1e1b4b", margin: 0 }}>{t.number}</p>
                                        <p style={{ fontSize: 11, color: "#94a3b8", margin: "4px 0" }}>{t.capacity} personas</p>
                                        <span style={{ fontSize: 10, fontWeight: 700, color: statusColor, textTransform: "uppercase", letterSpacing: 1 }}>
                                            {t.status === "AVAILABLE" ? "● Libre" : t.status === "OCCUPIED" ? "● Ocupada" : "● Reservada"}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* ═══════ STEP: Menu ═══════ */}
            {step === "menu" && (
                <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <button onClick={() => setStep("tables")} style={{ width: 40, height: 40, borderRadius: 10, background: "#f5f6fa", border: "1px solid #e8eaf0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ArrowLeft style={{ width: 18, height: 18, color: "#64748b" }} /></button>
                            <span style={{ fontSize: 16, fontWeight: 700, color: "#1e1b4b" }}>Mesa {selectedTable?.number || "?"} — {customerName || "Cliente"}</span>
                        </div>
                        {cartCount > 0 && (
                            <button onClick={() => setStep("cart")}
                                style={{ padding: "10px 20px", borderRadius: 12, background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 12px rgba(124,58,237,0.3)" }}>
                                <ShoppingBag style={{ width: 16, height: 16 }} /> Ver Carrito ({cartCount}) · S/ {cartTotal.toFixed(2)}
                            </button>
                        )}
                    </div>

                    {/* Search */}
                    <div style={{ position: "relative", marginBottom: 12 }}>
                        <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 18, height: 18, color: "#94a3b8" }} />
                        <input className="input" placeholder="Buscar platos..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 42, fontSize: 15, padding: "14px 14px 14px 42px" }} />
                    </div>

                    {/* Category pills */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
                        <button onClick={() => setActiveCat("all")} style={{ padding: "8px 18px", borderRadius: 20, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", background: activeCat === "all" ? "linear-gradient(135deg, #7c3aed, #6d28d9)" : "#f5f6fa", color: activeCat === "all" ? "#fff" : "#64748b", whiteSpace: "nowrap", boxShadow: activeCat === "all" ? "0 2px 8px rgba(124,58,237,0.3)" : "none" }}>Todos</button>
                        {categories.map((c: any) => <button key={c.id} onClick={() => setActiveCat(c.id)} style={{ padding: "8px 18px", borderRadius: 20, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", background: activeCat === c.id ? "linear-gradient(135deg, #7c3aed, #6d28d9)" : "#f5f6fa", color: activeCat === c.id ? "#fff" : "#64748b", whiteSpace: "nowrap", boxShadow: activeCat === c.id ? "0 2px 8px rgba(124,58,237,0.3)" : "none" }}>{c.name}</button>)}
                    </div>

                    {/* Products Grid — Bigger for tablet */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
                        {filtered.map(p => { const inCart = cart.find(i => i.id === p.id); return (
                            <div key={p.id} className="card" style={{ padding: 0, overflow: "hidden", borderRadius: 16, border: inCart ? "2px solid #7c3aed" : "1px solid #e8eaf0" }}>
                                <div style={{ height: 120, background: "#f8f9fb", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                                    {p.imageUrl ? <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 40 }}>🍽️</span>}
                                    <span style={{ position: "absolute", bottom: 8, left: 8, background: "#7c3aed", color: "#fff", padding: "4px 10px", borderRadius: 8, fontSize: 14, fontWeight: 700 }}>S/ {Number(p.price).toFixed(2)}</span>
                                    {inCart && <span style={{ position: "absolute", top: 8, right: 8, background: "#7c3aed", color: "#fff", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800 }}>{inCart.quantity}</span>}
                                </div>
                                <div style={{ padding: 12 }}>
                                    <p style={{ fontSize: 14, fontWeight: 700, color: "#1e1b4b", margin: "0 0 8px" }}>{p.name}</p>
                                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                        {inCart ? (
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <button onClick={() => removeFromCart(p.id)} style={{ width: 36, height: 36, borderRadius: 10, background: "#f5f6fa", border: "1px solid #e8eaf0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Minus style={{ width: 16, height: 16, color: "#64748b" }} /></button>
                                                <span style={{ fontSize: 16, fontWeight: 800, width: 20, textAlign: "center" }}>{inCart.quantity}</span>
                                                <button onClick={() => addToCart(p)} style={{ width: 36, height: 36, borderRadius: 10, background: "#7c3aed", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Plus style={{ width: 16, height: 16, color: "#fff" }} /></button>
                                            </div>
                                        ) : (
                                            <button onClick={() => addToCart(p)} style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #f97316, #ea580c)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(249,115,22,0.3)" }}><Plus style={{ width: 20, height: 20, color: "#fff" }} /></button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ); })}
                    </div>
                </div>
            )}

            {/* ═══════ STEP: Cart ═══════ */}
            {step === "cart" && (
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                        <button onClick={() => setStep("menu")} style={{ width: 40, height: 40, borderRadius: 10, background: "#f5f6fa", border: "1px solid #e8eaf0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ArrowLeft style={{ width: 18, height: 18, color: "#64748b" }} /></button>
                        <h3 style={{ fontSize: 22, fontWeight: 800, color: "#1e1b4b", margin: 0 }}>Resumen del Pedido</h3>
                    </div>

                    <div className="card" style={{ padding: 24, marginBottom: 20, borderRadius: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #f0f1f3" }}>
                            <span style={{ width: 40, height: 40, borderRadius: 10, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>👤</span>
                            <div>
                                <p style={{ fontSize: 15, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>{customerName || "Cliente"}</p>
                                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>🪑 Mesa {selectedTable?.number || "?"}</p>
                            </div>
                        </div>

                        {cart.length === 0 ? <p style={{ color: "#94a3b8", textAlign: "center", padding: 20 }}>Carrito vacío</p> : cart.map(item => (
                            <div key={item.id} style={{ padding: "12px 0", borderBottom: "1px solid #f0f1f3" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <span style={{ width: 32, height: 32, borderRadius: 8, background: "#ede9fe", color: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800 }}>{item.quantity}</span>
                                    <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: "#1e1b4b" }}>{item.name}</span>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <button onClick={() => removeFromCart(item.id)} style={{ width: 30, height: 30, borderRadius: 8, background: "#f5f6fa", border: "1px solid #e8eaf0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Minus style={{ width: 14, height: 14 }} /></button>
                                        <button onClick={() => addToCart(item)} style={{ width: 30, height: 30, borderRadius: 8, background: "#7c3aed", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Plus style={{ width: 14, height: 14, color: "#fff" }} /></button>
                                    </div>
                                    <span style={{ fontSize: 15, fontWeight: 700, color: "#1e1b4b", width: 80, textAlign: "right" }}>S/ {(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                                {/* Notes per item */}
                                <div style={{ marginTop: 6, marginLeft: 44, display: "flex", alignItems: "center", gap: 6 }}>
                                    <MessageSquare style={{ width: 12, height: 12, color: "#94a3b8" }} />
                                    <input
                                        placeholder="Nota: sin cebolla, extra picante..."
                                        value={item.notes || ""}
                                        onChange={e => updateNotes(item.id, e.target.value)}
                                        style={{ flex: 1, fontSize: 12, color: "#64748b", border: "none", borderBottom: "1px dashed #e8eaf0", outline: "none", padding: "4px 0", background: "transparent" }}
                                    />
                                </div>
                            </div>
                        ))}

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, paddingTop: 16, borderTop: "2px solid #1e1b4b" }}>
                            <span style={{ fontSize: 18, fontWeight: 800, color: "#1e1b4b" }}>TOTAL</span>
                            <span style={{ fontSize: 28, fontWeight: 800, color: "#7c3aed" }}>S/ {cartTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    <button onClick={sendOrder} disabled={sending || cart.length === 0}
                        style={{
                            width: "100%", padding: "18px", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", border: "none", borderRadius: 14, fontSize: 17, fontWeight: 700, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                            opacity: sending || cart.length === 0 ? 0.5 : 1,
                            boxShadow: "0 4px 16px rgba(34,197,94,0.3)",
                        }}>
                        <Send style={{ width: 20, height: 20 }} /> {sending ? "Enviando..." : "Enviar Pedido a Cocina"}
                    </button>
                </div>
            )}

            {/* ═══════ STEP: My Orders ═══════ */}
            {step === "my-orders" && (
                <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                        <h3 style={{ fontSize: 22, fontWeight: 800, color: "#1e1b4b", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>📦 Mis Pedidos</h3>
                        <button onClick={fetchMyOrders} style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid #e8eaf0", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#64748b" }}>
                            <RefreshCw style={{ width: 14, height: 14 }} /> Actualizar
                        </button>
                    </div>

                    <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 12 }}>🔄 Auto-actualización cada 15 segundos</p>

                    {myOrders.length === 0 ? <p style={{ color: "#94a3b8", textAlign: "center", padding: 40 }}>No tienes pedidos aún</p> : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            {myOrders.map(o => {
                                const isDelivered = o.status === "DELIVERED";
                                const isCancelled = o.status === "CANCELLED";
                                const statusColor = isDelivered ? "#22c55e" : isCancelled ? "#ef4444" : "#f97316";
                                return (
                                    <div key={o.id} className="card" style={{ padding: 20, borderRadius: 16, borderLeft: `5px solid ${statusColor}`, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                                                <span style={{ fontSize: 15, fontWeight: 800, color: "#1e1b4b" }}>#{o.id?.slice(0, 6)?.toUpperCase()}</span>
                                                {o.table?.number && <span style={{ background: "#ede9fe", color: "#7c3aed", padding: "3px 10px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>Mesa {o.table.number}</span>}
                                                <span style={{ padding: "3px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, background: isDelivered ? "#d1fae5" : isCancelled ? "#fee2e2" : "#fef3c7", color: isDelivered ? "#059669" : isCancelled ? "#dc2626" : "#d97706" }}>{isDelivered ? "✅ ENTREGADO" : isCancelled ? "❌ Anulado" : o.status}</span>
                                                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#94a3b8" }}><Clock style={{ width: 12, height: 12 }} /> {getTimeSince(o.createdAt)}</span>
                                            </div>
                                            <span style={{ fontSize: 22, fontWeight: 800, color: "#7c3aed" }}>S/ {Number(o.total || 0).toFixed(2)}</span>
                                        </div>

                                        {o.customerName && <p style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>👤 {o.customerName}</p>}
                                        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>
                                            {(o.items || o.orderItems || []).map((i: any, idx: number) => <span key={idx}>{idx > 0 ? " · " : ""}{i.quantity || 1}x {i.productName || i.product?.name || i.name || "—"}</span>)}
                                        </div>

                                        {!isDelivered && !isCancelled && (
                                            <div style={{ display: "flex", gap: 10 }}>
                                                <button onClick={() => setShowConfirmPay(o.id)}
                                                    style={{ flex: 1, padding: "12px", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 2px 8px rgba(34,197,94,0.3)" }}>
                                                    <DollarSign style={{ width: 16, height: 16 }} /> Cobrar y Entregar
                                                </button>
                                                <button onClick={() => printTicket(o)} style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid #e8eaf0", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#64748b" }}>
                                                    <Printer style={{ width: 16, height: 16 }} /> Ticket
                                                </button>
                                            </div>
                                        )}
                                        {isDelivered && <p style={{ fontSize: 12, color: "#22c55e", fontWeight: 700 }}>✅ Pagado y entregado</p>}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* ═══════ Confirmation Modal ═══════ */}
            {showConfirmPay && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setShowConfirmPay(null)}>
                    <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, padding: 32, maxWidth: 400, width: "90%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
                        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                            <AlertTriangle style={{ width: 30, height: 30, color: "#f59e0b" }} />
                        </div>
                        <h3 style={{ fontSize: 20, fontWeight: 800, color: "#1e1b4b", margin: "0 0 8px" }}>¿Confirmar cobro?</h3>
                        <p style={{ fontSize: 14, color: "#94a3b8", margin: "0 0 24px" }}>El pedido se marcará como entregado y se imprimirá el ticket.</p>
                        <div style={{ display: "flex", gap: 10 }}>
                            <button onClick={() => setShowConfirmPay(null)} style={{ flex: 1, padding: "14px", borderRadius: 12, border: "1px solid #e8eaf0", background: "#fff", cursor: "pointer", fontSize: 15, fontWeight: 600, color: "#64748b" }}>Cancelar</button>
                            <button onClick={() => processPayment(showConfirmPay)} style={{ flex: 1, padding: "14px", borderRadius: 12, background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700, boxShadow: "0 4px 12px rgba(34,197,94,0.3)" }}>✅ Confirmar Cobro</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
