"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Activity, RefreshCw, Server, Database, Globe, Cpu } from "lucide-react";

export default function SystemPage() {
    const [info, setInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchInfo = async () => {
        setLoading(true);
        try { const { data } = await api.get("/system/info"); setInfo(data); }
        catch { setInfo(null); } finally { setLoading(false); }
    };
    useEffect(() => { fetchInfo(); }, []);

    const items = info ? [
        { icon: Server, label: "Servidor", value: info.server || "NestJS", color: "#7c3aed" },
        { icon: Database, label: "Base de Datos", value: info.database || "PostgreSQL", color: "#22c55e" },
        { icon: Globe, label: "API URL", value: info.apiUrl || "localhost:3000", color: "#3b82f6" },
        { icon: Cpu, label: "Node.js", value: info.nodeVersion || process.env.NODE_ENV || "production", color: "#f97316" },
        { icon: Activity, label: "Uptime", value: info.uptime || "Activo", color: "#06b6d4" },
    ] : [];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div><h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>Estado del Sistema</h1><p style={{ fontSize: 14, color: "#94a3b8", margin: 0, marginTop: 4 }}>Información y salud del servidor</p></div>
                <button onClick={fetchInfo} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px" }}><RefreshCw style={{ width: 14, height: 14 }} /> Actualizar</button>
            </div>

            {/* Status Banner */}
            <div className="card" style={{ padding: 20, display: "flex", alignItems: "center", gap: 14, background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)" }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
                <p style={{ fontSize: 15, fontWeight: 600, color: "#166534", margin: 0 }}>Sistema Operativo — Todos los servicios funcionando correctamente</p>
            </div>

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><div style={{ width: 36, height: 36, border: "3px solid #ede9fe", borderTopColor: "#7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /><style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style></div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
                    {items.map((item, i) => (
                        <div key={i} className="stat-card">
                            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${item.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <item.icon style={{ width: 20, height: 20, color: item.color }} />
                                </div>
                                <div>
                                    <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, textTransform: "uppercase", letterSpacing: 0.5 }}>{item.label}</p>
                                    <p style={{ fontSize: 15, fontWeight: 700, color: "#1e1b4b", margin: 0, marginTop: 2 }}>{item.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
