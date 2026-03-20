"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { api } from "@/lib/axios";
import { useSocket } from "@/hooks/useSocket";
import { ChefHat, Volume2, VolumeX, Clock, CheckCircle2, BellRing, RefreshCw } from "lucide-react";

interface KDSOrder {
    id: string;
    tableId?: string;
    status: string;
    type: string;
    items: any[];
    createdAt: string;
    customerName?: string;
    table?: { number: number };
}

export default function KitchenDisplaySystem() {
    const [orders, setOrders] = useState<KDSOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [flash, setFlash] = useState(false);
    const [now, setNow] = useState(Date.now());
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { on } = useSocket();

    // Update timer every 30s
    useEffect(() => { const t = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(t); }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try { const { data } = await api.get("/orders?status=PENDING,PREPARING"); setOrders(Array.isArray(data) ? data : []); }
        catch { setOrders([]); } finally { setLoading(false); }
    };
    useEffect(() => { fetchOrders(); }, []);

    // Socket.IO real-time
    useEffect(() => {
        const unsubNew = on("pos:newOrder", (order: KDSOrder) => {
            setOrders(prev => prev.find(o => o.id === order.id) ? prev : [order, ...prev]);
            setFlash(true); setTimeout(() => setFlash(false), 2000);
            if (soundEnabled) playNotificationSound();
        });
        const unsubStatus = on("pos:orderStatusChange", ({ orderId, status }: any) => {
            if (["READY", "DELIVERED", "CANCELLED"].includes(status)) setOrders(prev => prev.filter(o => o.id !== orderId));
            else setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
        });
        return () => { unsubNew(); unsubStatus(); };
    }, [on, soundEnabled]);

    const playNotificationSound = useCallback(() => {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const playPulse = (freq: number, startTime: number, dur: number, vol: number) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = "square";
                osc.frequency.setValueAtTime(freq, startTime);
                gain.gain.setValueAtTime(vol, startTime);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + dur);
                osc.start(startTime);
                osc.stop(startTime + dur);
            };
            const t = ctx.currentTime;
            // Triple-pulse loud alarm (3 repeats, higher gain)
            // Pulse 1
            playPulse(880, t, 0.18, 0.8);
            playPulse(1100, t + 0.22, 0.18, 0.8);
            // Pulse 2
            playPulse(880, t + 0.55, 0.18, 0.85);
            playPulse(1100, t + 0.77, 0.18, 0.85);
            // Pulse 3 (loudest, higher pitch)
            playPulse(1100, t + 1.1, 0.18, 0.9);
            playPulse(1320, t + 1.32, 0.25, 0.9);
        } catch { }
    }, []);

    const markAsPreparing = async (id: string) => {
        try { await api.patch(`/orders/${id}/status`, { status: "PREPARING" }); setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "PREPARING" } : o)); } catch { }
    };
    const markAsReady = async (id: string) => {
        try { await api.patch(`/orders/${id}/status`, { status: "READY" }); setOrders(prev => prev.filter(o => o.id !== id)); } catch { }
    };

    const getMinutes = (createdAt: string) => Math.floor((now - new Date(createdAt).getTime()) / 60000);

    const pendingOrders = orders.filter(o => o.status === "PENDING");
    const preparingOrders = orders.filter(o => o.status === "PREPARING");

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Full-screen flash overlay */}
            {flash && <div style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none", background: "rgba(249,115,22,0.15)", animation: "kds-flash 0.4s ease-in-out 4" }} />}
            <style jsx>{`@keyframes kds-flash { 0%,100% { opacity: 0; } 50% { opacity: 1; } }`}</style>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: flash ? "16px 20px" : "0", background: flash ? "#fef3c780" : "transparent", borderRadius: 16, transition: "all 0.5s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(249,115,22,0.3)" }}>
                        <ChefHat style={{ width: 24, height: 24, color: "#fff" }} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1e1b4b", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                            Cocina — KDS {flash && <BellRing style={{ width: 20, height: 20, color: "#f59e0b", animation: "pulse 0.5s ease infinite" }} />}
                        </h1>
                        <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
                            {orders.length} pedidos pendientes · <span style={{ color: "#22c55e", fontWeight: 600 }}>Socket.IO conectado ✓</span>
                        </p>
                    </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={fetchOrders} style={{ width: 40, height: 40, borderRadius: 10, background: "#f8f9fb", border: "1px solid #e8eaf0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <RefreshCw style={{ width: 16, height: 16, color: "#64748b" }} />
                    </button>
                    <button onClick={() => setSoundEnabled(!soundEnabled)} style={{ width: 40, height: 40, borderRadius: 10, background: soundEnabled ? "#d1fae5" : "#f5f6fa", border: `1px solid ${soundEnabled ? "#bbf7d0" : "#e8eaf0"}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {soundEnabled ? <Volume2 style={{ width: 16, height: 16, color: "#22c55e" }} /> : <VolumeX style={{ width: 16, height: 16, color: "#94a3b8" }} />}
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
                <div className="stat-card" style={{ borderLeft: "4px solid #3b82f6" }}>
                    <p style={{ fontSize: 28, fontWeight: 800, color: "#3b82f6", margin: 0 }}>{pendingOrders.length}</p>
                    <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>🔵 Nuevos</p>
                </div>
                <div className="stat-card" style={{ borderLeft: "4px solid #f97316" }}>
                    <p style={{ fontSize: 28, fontWeight: 800, color: "#f97316", margin: 0 }}>{preparingOrders.length}</p>
                    <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>🟠 En Preparación</p>
                </div>
                <div className="stat-card" style={{ borderLeft: "4px solid #22c55e" }}>
                    <p style={{ fontSize: 28, fontWeight: 800, color: "#22c55e", margin: 0 }}>{orders.length}</p>
                    <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>📋 Total Activos</p>
                </div>
            </div>

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
                    <div style={{ width: 40, height: 40, border: "3px solid #fef3c7", borderTopColor: "#f97316", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : orders.length === 0 ? (
                <div style={{ textAlign: "center", padding: 80 }}>
                    <CheckCircle2 style={{ width: 64, height: 64, color: "#bbf7d0", margin: "0 auto 16px" }} />
                    <p style={{ fontSize: 20, fontWeight: 700, color: "#1e1b4b" }}>¡Todo al día!</p>
                    <p style={{ fontSize: 14, color: "#94a3b8", marginTop: 4 }}>Los nuevos pedidos aparecerán automáticamente</p>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                    {orders.map(order => {
                        const mins = getMinutes(order.createdAt);
                        const isUrgent = mins > 15;
                        const isSlow = mins > 10;
                        const isPending = order.status === "PENDING";
                        const borderColor = isUrgent ? "#ef4444" : isSlow ? "#f59e0b" : isPending ? "#3b82f6" : "#7c3aed";

                        return (
                            <div key={order.id} className="card" style={{ padding: 0, borderLeft: `4px solid ${borderColor}`, overflow: "hidden" }}>
                                {/* Order Header */}
                                <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: isUrgent ? "#fef2f2" : isSlow ? "#fffbeb" : isPending ? "#eff6ff" : "#f5f3ff" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ fontSize: 14, fontWeight: 700, color: "#1e1b4b" }}>
                                            {order.table?.number ? `MESA ${order.table.number}` : order.type === "TAKEAWAY" ? "🛍️ PARA LLEVAR" : order.type === "DELIVERY" ? "🛵 DELIVERY" : "📍 LOCAL"}
                                        </span>
                                        <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: isPending ? "#dbeafe" : "#f3e8ff", color: isPending ? "#2563eb" : "#7c3aed" }}>
                                            {isPending ? "NUEVO" : "PREPARANDO"}
                                        </span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: isUrgent ? "#ef4444" : isSlow ? "#f59e0b" : "#64748b" }}>
                                        <Clock style={{ width: 13, height: 13 }} /> {mins} min
                                    </div>
                                </div>

                                {/* Customer */}
                                {order.customerName && (
                                    <div style={{ padding: "6px 16px", background: "#f8f9fb", fontSize: 12, color: "#64748b" }}>👤 {order.customerName}</div>
                                )}

                                {/* Items */}
                                <div style={{ padding: 16 }}>
                                    {(order.items || []).length > 0 ? order.items.map((item: any, idx: number) => (
                                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: idx < order.items.length - 1 ? "1px solid #f0f1f3" : "none" }}>
                                            <span style={{ width: 26, height: 26, borderRadius: 6, background: "#ede9fe", color: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{item.quantity || 1}</span>
                                            <span style={{ fontSize: 13, fontWeight: 500, color: "#1e1b4b" }}>{item.productName || item.name || item.product?.name || "Producto"}</span>
                                        </div>
                                    )) : <p style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>Sin detalles</p>}
                                </div>

                                {/* Actions */}
                                <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                                    {isPending && (
                                        <button onClick={() => markAsPreparing(order.id)} style={{ width: "100%", padding: "10px", background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(59,130,246,0.3)" }}>
                                            🍳 EMPEZAR A PREPARAR
                                        </button>
                                    )}
                                    <button onClick={() => markAsReady(order.id)} style={{ width: "100%", padding: "10px", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(34,197,94,0.3)" }}>
                                        ✓ LISTO PARA SERVIR
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
