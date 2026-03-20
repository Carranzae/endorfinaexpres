"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { UserCheck, RefreshCw, LogIn, LogOut } from "lucide-react";

export default function AttendancePage() {
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try { const { data } = await api.get("/attendance"); setRecords(Array.isArray(data) ? data : []); }
        catch { setRecords([]); } finally { setLoading(false); }
    };
    useEffect(() => { fetchData(); }, []);

    const checkIn = async () => {
        try { await api.post("/attendance/check-in"); fetchData(); }
        catch (e: any) { alert(e.response?.data?.message || "Error en check-in"); }
    };
    const checkOut = async () => {
        try { await api.post("/attendance/check-out"); fetchData(); }
        catch (e: any) { alert(e.response?.data?.message || "Error en check-out"); }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div><h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>Asistencias</h1><p style={{ fontSize: 14, color: "#94a3b8", margin: 0, marginTop: 4 }}>Control de asistencia del personal</p></div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={checkIn} className="btn-success" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", fontSize: 13 }}><LogIn style={{ width: 16, height: 16 }} /> Check-In</button>
                    <button onClick={checkOut} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", fontSize: 13 }}><LogOut style={{ width: 16, height: 16 }} /> Check-Out</button>
                    <button onClick={fetchData} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px" }}><RefreshCw style={{ width: 14, height: 14 }} /></button>
                </div>
            </div>
            <div className="card" style={{ padding: 0 }}>
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><div style={{ width: 32, height: 32, border: "3px solid #ede9fe", borderTopColor: "#7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /><style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style></div>
                ) : records.length === 0 ? (
                    <div className="empty-state"><div className="empty-state-icon" style={{ background: "#e0f2fe" }}><UserCheck style={{ width: 28, height: 28, color: "#0ea5e9" }} /></div><p style={{ fontSize: 16, fontWeight: 600, color: "#1e1b4b" }}>Sin registros</p><p style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>Presiona Check-In para registrar tu entrada</p></div>
                ) : (
                    <div style={{ overflowX: "auto" }}><table className="data-table"><thead><tr><th>Empleado</th><th>Fecha</th><th>Check-In</th><th>Check-Out</th><th>Horas</th><th>Estado</th></tr></thead>
                    <tbody>{records.map(r => (
                        <tr key={r.id}>
                            <td style={{ fontWeight: 600, color: "#1e1b4b" }}>{r.employee?.fullName || "—"}</td>
                            <td style={{ color: "#64748b" }}>{r.date ? new Date(r.date).toLocaleDateString("es-PE") : ""}</td>
                            <td style={{ color: "#22c55e", fontWeight: 600 }}>{r.checkIn ? new Date(r.checkIn).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }) : "—"}</td>
                            <td style={{ color: "#f97316", fontWeight: 600 }}>{r.checkOut ? new Date(r.checkOut).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }) : "—"}</td>
                            <td style={{ fontWeight: 700 }}>{Number(r.hoursWorked || 0).toFixed(1)}h</td>
                            <td><span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: r.status === "PRESENT" ? "#d1fae5" : "#fef3c7", color: r.status === "PRESENT" ? "#059669" : "#d97706" }}>{r.status === "PRESENT" ? "Presente" : r.status === "LATE" ? "Tardanza" : r.status === "ABSENT" ? "Ausente" : r.status}</span></td>
                        </tr>
                    ))}</tbody></table></div>
                )}
            </div>
        </div>
    );
}
