"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import {
    ShoppingCart, DollarSign, Users, Activity,
    RefreshCw, TrendingUp, AlertTriangle, Award, Package,
} from "lucide-react";

interface Stats {
    dailySales: { date: string; orders: number; revenue: number }[];
    salesByWaiter: { name: string; orders: number; revenue: number }[];
    revenue: { today: { total: number; orders: number }; week: { total: number; orders: number }; month: { total: number; orders: number } };
    topProducts: { name: string; sold: number; revenue: number }[];
    orderTypeDistribution: { type: string; count: number }[];
    alerts: { pendingOver15min: number; lowStock: { name: string; stockQuantity: number; minStock: number }[] };
}

/* ── SVG Bar Chart ── */
function BarChart({ data, width = 500, height = 200 }: { data: { label: string; value: number }[]; width?: number; height?: number }) {
    if (data.length === 0) return <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", padding: 20 }}>Sin datos</p>;
    const max = Math.max(...data.map(d => d.value), 1);
    const barW = Math.min(40, (width - 60) / data.length - 8);
    const chartH = height - 40;
    return (
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto" }}>
            {data.map((d, i) => {
                const barH = (d.value / max) * chartH;
                const x = 40 + i * ((width - 60) / data.length) + ((width - 60) / data.length - barW) / 2;
                const y = chartH - barH + 10;
                return (
                    <g key={i}>
                        <rect x={x} y={y} width={barW} height={barH} rx={4} fill="#7c3aed" opacity={0.85} />
                        <text x={x + barW / 2} y={height - 4} textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="600">{d.label}</text>
                        <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize="9" fill="#1e1b4b" fontWeight="700">{d.value}</text>
                    </g>
                );
            })}
        </svg>
    );
}

/* ── SVG Pie Chart ── */
function PieChart({ data }: { data: { label: string; value: number; color: string }[] }) {
    const total = data.reduce((s, d) => s + d.value, 0);
    if (total === 0) return <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", padding: 20 }}>Sin datos</p>;
    let cum = 0;
    const arcs = data.map(d => {
        const start = cum; cum += d.value; const end = cum;
        const startAngle = (start / total) * 2 * Math.PI - Math.PI / 2;
        const endAngle = (end / total) * 2 * Math.PI - Math.PI / 2;
        const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
        const x1 = 80 + 70 * Math.cos(startAngle), y1 = 80 + 70 * Math.sin(startAngle);
        const x2 = 80 + 70 * Math.cos(endAngle), y2 = 80 + 70 * Math.sin(endAngle);
        return { ...d, path: `M 80 80 L ${x1} ${y1} A 70 70 0 ${largeArc} 1 ${x2} ${y2} Z` };
    });
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <svg viewBox="0 0 160 160" style={{ width: 140, height: 140, flexShrink: 0 }}>
                {arcs.map((a, i) => <path key={i} d={a.path} fill={a.color} stroke="#fff" strokeWidth="2" />)}
            </svg>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {data.map((d, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color, flexShrink: 0 }} />
                        <span style={{ color: "#1e1b4b", fontWeight: 600 }}>{d.label}</span>
                        <span style={{ color: "#94a3b8" }}>({d.value})</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ── SVG Line Chart ── */
function LineChart({ data, width = 500, height = 180 }: { data: { label: string; value: number }[]; width?: number; height?: number }) {
    if (data.length < 2) return <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", padding: 20 }}>Sin datos suficientes</p>;
    const max = Math.max(...data.map(d => d.value), 1);
    const pad = { top: 15, right: 20, bottom: 30, left: 50 };
    const cW = width - pad.left - pad.right, cH = height - pad.top - pad.bottom;
    const points = data.map((d, i) => ({ x: pad.left + (i / (data.length - 1)) * cW, y: pad.top + cH - (d.value / max) * cH }));
    const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const area = `${line} L ${points[points.length - 1].x} ${pad.top + cH} L ${points[0].x} ${pad.top + cH} Z`;
    return (
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto" }}>
            <defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2" /><stop offset="100%" stopColor="#7c3aed" stopOpacity="0" /></linearGradient></defs>
            {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                <g key={i}><line x1={pad.left} y1={pad.top + cH * (1 - p)} x2={width - pad.right} y2={pad.top + cH * (1 - p)} stroke="#e8eaf0" strokeDasharray="4" />
                    <text x={pad.left - 6} y={pad.top + cH * (1 - p) + 4} textAnchor="end" fontSize="9" fill="#94a3b8">{Math.round(max * p)}</text></g>
            ))}
            <path d={area} fill="url(#areaGrad)" />
            <path d={line} fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill="#7c3aed" stroke="#fff" strokeWidth="1.5" />)}
            {data.filter((_, i) => i % Math.ceil(data.length / 7) === 0 || i === data.length - 1).map((d, _i) => {
                const idx = data.indexOf(d);
                return <text key={idx} x={points[idx].x} y={height - 6} textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="500">{d.label}</text>;
            })}
        </svg>
    );
}

const TYPE_LABELS: Record<string, string> = { DINE_IN: "En local", TAKEAWAY: "Para llevar", DELIVERY: "Delivery" };
const TYPE_COLORS: Record<string, string> = { DINE_IN: "#7c3aed", TAKEAWAY: "#f97316", DELIVERY: "#3b82f6" };

export default function POSDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, ordersRes] = await Promise.all([
                api.get("/orders/stats").catch(() => ({ data: null })),
                api.get("/orders?limit=10").catch(() => ({ data: [] })),
            ]);
            if (statsRes.data) setStats(statsRes.data);
            setRecentOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
        } catch (e) { console.error("Dashboard fetch error", e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const rev = stats?.revenue || { today: { total: 0, orders: 0 }, week: { total: 0, orders: 0 }, month: { total: 0, orders: 0 } };
    const alertCount = (stats?.alerts?.pendingOver15min || 0) + (stats?.alerts?.lowStock?.length || 0);

    const statCards = [
        { title: "Pedidos Hoy", value: rev.today.orders, icon: ShoppingCart, bg: "#7c3aed", change: `${rev.week.orders} esta sem.` },
        { title: "Ingresos Hoy", value: `S/ ${rev.today.total.toFixed(2)}`, icon: DollarSign, bg: "#22c55e", change: `S/ ${rev.month.total.toFixed(0)} este mes` },
        { title: "Meseros Activos", value: stats?.salesByWaiter?.length || 0, icon: Users, bg: "#3b82f6", change: "con ventas" },
        { title: "Alertas", value: alertCount, icon: AlertTriangle, bg: alertCount > 0 ? "#ef4444" : "#22c55e", change: alertCount > 0 ? "requieren atención" : "todo bien" },
    ];

    const barData = (stats?.dailySales || []).slice(-7).map(d => ({ label: new Date(d.date).toLocaleDateString("es-PE", { day: "2-digit", month: "short" }), value: d.orders }));
    const lineData = (stats?.dailySales || []).map(d => ({ label: new Date(d.date).toLocaleDateString("es-PE", { day: "2-digit", month: "short" }), value: Math.round(d.revenue) }));
    const pieData = (stats?.orderTypeDistribution || []).map(d => ({ label: TYPE_LABELS[d.type] || d.type, value: d.count, color: TYPE_COLORS[d.type] || "#94a3b8" }));

    const getStatusBadge = (status: string) => {
        const map: Record<string, { bg: string; color: string; label: string }> = {
            PENDING: { bg: "#fef3c7", color: "#d97706", label: "Pendiente" }, PREPARING: { bg: "#e0e7ff", color: "#4f46e5", label: "Preparando" },
            READY: { bg: "#d1fae5", color: "#059669", label: "Listo" }, DELIVERED: { bg: "#dbeafe", color: "#2563eb", label: "Entregado" },
            CANCELLED: { bg: "#fee2e2", color: "#dc2626", label: "Cancelado" },
        };
        const s = map[status] || map.PENDING;
        return <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: s.color }} />{s.label}</span>;
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div><h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>Dashboard</h1><p style={{ fontSize: 14, color: "#94a3b8", margin: 0, marginTop: 4 }}>Resumen operativo en tiempo real</p></div>
                <button onClick={fetchData} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 12, background: "#fff", border: "1px solid #e8eaf0", fontSize: 13, fontWeight: 600, color: "#64748b", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                    <RefreshCw style={{ width: 15, height: 15 }} /> Actualizar
                </button>
            </div>

            {/* Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
                {statCards.map((card, i) => (
                    <div key={i} className="stat-card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ width: 44, height: 44, borderRadius: 12, background: card.bg, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 12px ${card.bg}40` }}>
                                <card.icon style={{ width: 20, height: 20, color: "#fff" }} />
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", background: "#f5f6fa", padding: "3px 8px", borderRadius: 8 }}>{card.change}</div>
                        </div>
                        <div><p style={{ fontSize: 28, fontWeight: 800, color: "#1e1b4b", margin: 0, lineHeight: 1.1 }}>{card.value}</p><p style={{ fontSize: 13, color: "#94a3b8", margin: 0, marginTop: 4 }}>{card.title}</p></div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="card" style={{ padding: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}><div style={{ width: 32, height: 32, borderRadius: 8, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center" }}><TrendingUp style={{ width: 16, height: 16, color: "#7c3aed" }} /></div><h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>Pedidos Diarios (7 días)</h3></div>
                    <BarChart data={barData} />
                </div>
                <div className="card" style={{ padding: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}><div style={{ width: 32, height: 32, borderRadius: 8, background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center" }}><Activity style={{ width: 16, height: 16, color: "#0ea5e9" }} /></div><h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>Tipo de Pedidos</h3></div>
                    <PieChart data={pieData} />
                </div>
            </div>

            {/* Line Chart */}
            <div className="card" style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}><div style={{ width: 32, height: 32, borderRadius: 8, background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center" }}><DollarSign style={{ width: 16, height: 16, color: "#22c55e" }} /></div><h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>Tendencia de Ingresos (30 días)</h3></div>
                <LineChart data={lineData} />
            </div>

            {/* Bottom: Top Waiters, Products, Alerts */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <div className="card" style={{ padding: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}><div style={{ width: 32, height: 32, borderRadius: 8, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center" }}><Award style={{ width: 16, height: 16, color: "#7c3aed" }} /></div><h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>Top 5 Meseros</h3></div>
                    {(stats?.salesByWaiter || []).slice(0, 5).map((w, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 4 ? "1px solid #f0f1f3" : "none" }}>
                            <span style={{ width: 24, height: 24, borderRadius: 6, background: i === 0 ? "#fef3c7" : "#f5f6fa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
                            <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#1e1b4b" }}>{w.name}</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: "#7c3aed" }}>S/ {w.revenue.toFixed(0)}</span>
                        </div>
                    ))}
                    {(!stats?.salesByWaiter?.length) && <p style={{ fontSize: 13, color: "#94a3b8" }}>Sin datos</p>}
                </div>
                <div className="card" style={{ padding: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}><div style={{ width: 32, height: 32, borderRadius: 8, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center" }}><Package style={{ width: 16, height: 16, color: "#d97706" }} /></div><h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>Top 5 Productos</h3></div>
                    {(stats?.topProducts || []).slice(0, 5).map((p, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 4 ? "1px solid #f0f1f3" : "none" }}>
                            <span style={{ width: 24, height: 24, borderRadius: 6, background: i === 0 ? "#fef3c7" : "#f5f6fa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
                            <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#1e1b4b" }}>{p.name}</span>
                            <span style={{ fontSize: 12, color: "#64748b" }}>{p.sold} uds</span>
                        </div>
                    ))}
                    {(!stats?.topProducts?.length) && <p style={{ fontSize: 13, color: "#94a3b8" }}>Sin datos</p>}
                </div>
                <div className="card" style={{ padding: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}><div style={{ width: 32, height: 32, borderRadius: 8, background: alertCount > 0 ? "#fee2e2" : "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center" }}><AlertTriangle style={{ width: 16, height: 16, color: alertCount > 0 ? "#ef4444" : "#22c55e" }} /></div><h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>Alertas</h3></div>
                    {(stats?.alerts?.pendingOver15min || 0) > 0 && <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 10, background: "#fef2f2", borderRadius: 8, marginBottom: 8 }}><span style={{ fontSize: 16 }}>⏰</span><span style={{ fontSize: 12, fontWeight: 600, color: "#dc2626" }}>{stats?.alerts?.pendingOver15min} pedidos pendientes &gt;15 min</span></div>}
                    {(stats?.alerts?.lowStock || []).map((p, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: 10, background: "#fffbeb", borderRadius: 8, marginBottom: 4 }}><span style={{ fontSize: 14 }}>📦</span><span style={{ fontSize: 12, fontWeight: 600, color: "#d97706" }}>{p.name}: {p.stockQuantity}/{p.minStock}</span></div>)}
                    {alertCount === 0 && <p style={{ fontSize: 13, color: "#22c55e", fontWeight: 600 }}>✓ Sin alertas activas</p>}
                </div>
            </div>

            {/* Recent Orders */}
            <div className="card" style={{ padding: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #e8eaf0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 36, height: 36, borderRadius: 10, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center" }}><TrendingUp style={{ width: 18, height: 18, color: "#7c3aed" }} /></div><h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>Pedidos Recientes</h2></div>
                </div>
                {loading ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60 }}><div style={{ width: 32, height: 32, border: "3px solid #ede9fe", borderTopColor: "#7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /><style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style></div>
                ) : recentOrders.length === 0 ? (
                    <div className="empty-state"><div className="empty-state-icon" style={{ background: "#ede9fe" }}><ShoppingCart style={{ width: 28, height: 28, color: "#7c3aed" }} /></div><p style={{ fontSize: 15, fontWeight: 600, color: "#1e1b4b", margin: 0 }}>No hay pedidos todavía</p></div>
                ) : (
                    <div style={{ overflowX: "auto" }}><table className="data-table"><thead><tr><th>ID</th><th>Cliente</th><th>Tipo</th><th>Estado</th><th style={{ textAlign: "right" }}>Total</th></tr></thead>
                    <tbody>{recentOrders.slice(0, 8).map((o: any, i: number) => (
                        <tr key={i}><td style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 600, color: "#7c3aed" }}>#{o.id?.slice(0, 8)}</td><td style={{ fontWeight: 500, color: "#1e1b4b" }}>{o.customerName || "Cliente"}</td>
                        <td>{o.tableId ? <span style={{ background: "#ede9fe", color: "#7c3aed", padding: "2px 8px", borderRadius: 6, fontSize: 12, fontWeight: 500 }}>Mesa</span> : <span style={{ background: "#fff7ed", color: "#f97316", padding: "2px 8px", borderRadius: 6, fontSize: 12, fontWeight: 500 }}>{o.orderType === "DELIVERY" ? "Delivery" : "Para llevar"}</span>}</td>
                        <td>{getStatusBadge(o.status || "PENDING")}</td><td style={{ textAlign: "right", fontWeight: 700, color: "#1e1b4b" }}>S/ {(Number(o.total) || 0).toFixed(2)}</td></tr>
                    ))}</tbody></table></div>
                )}
            </div>
        </div>
    );
}
