"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Users, Plus, RefreshCw, Edit2, Trash2, X, Shield, Eye, EyeOff } from "lucide-react";

const ROLES = [
    { value: "ADMINISTRATOR", label: "Administrador", color: "#7c3aed", bg: "#ede9fe", icon: "👑" },
    { value: "CASHIER", label: "Cajero/a", color: "#22c55e", bg: "#d1fae5", icon: "💰" },
    { value: "WAITER", label: "Mesero/a", color: "#3b82f6", bg: "#dbeafe", icon: "🍽️" },
    { value: "KITCHEN", label: "Cocinero/a", color: "#f97316", bg: "#fef3c7", icon: "👨‍🍳" },
];

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "WAITER", phone: "" });
    const [showPassword, setShowPassword] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try { const { data } = await api.get("/users"); setUsers(Array.isArray(data) ? data : []); }
        catch { setUsers([]); } finally { setLoading(false); }
    };
    useEffect(() => { fetchUsers(); }, []);

    const openCreate = () => { setEditing(null); setForm({ fullName: "", email: "", password: "", role: "WAITER", phone: "" }); setShowForm(true); };
    const openEdit = (u: any) => { setEditing(u); setForm({ fullName: u.fullName || "", email: u.email || "", password: "", role: u.role || "WAITER", phone: u.phone || "" }); setShowForm(true); };

    const save = async () => {
        try {
            if (editing) {
                const payload: any = { fullName: form.fullName, email: form.email, role: form.role, phone: form.phone };
                if (form.password) payload.password = form.password;
                const { data } = await api.patch(`/users/${editing.id}`, payload);
                setUsers(prev => prev.map(u => u.id === editing.id ? data : u));
            } else {
                if (!form.password) { alert("La contraseña es obligatoria"); return; }
                const { data } = await api.post("/users", form);
                setUsers(prev => [...prev, data]);
            }
            setShowForm(false);
        } catch (e: any) { alert(e.response?.data?.message || "Error al guardar"); }
    };

    const deleteUser = async (id: string) => {
        if (!confirm("¿Eliminar este usuario?")) return;
        try { await api.delete(`/users/${id}`); setUsers(prev => prev.filter(u => u.id !== id)); }
        catch (e: any) { alert(e.response?.data?.message || "Error al eliminar"); }
    };

    const getRoleInfo = (role: string) => ROLES.find(r => r.value === role) || ROLES[0];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div><h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>Gestión de Usuarios</h1><p style={{ fontSize: 14, color: "#94a3b8", margin: 0, marginTop: 4 }}>Crea y administra cuentas para tu equipo</p></div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={fetchUsers} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px" }}><RefreshCw style={{ width: 14, height: 14 }} /></button>
                    <button onClick={openCreate} className="btn-purple" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px" }}><Plus style={{ width: 16, height: 16 }} /> Nuevo Usuario</button>
                </div>
            </div>

            {/* Role Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
                {ROLES.map(r => {
                    const count = users.filter(u => u.role === r.value).length;
                    return (
                        <div key={r.value} className="stat-card" style={{ borderLeft: `4px solid ${r.color}` }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <span style={{ fontSize: 24 }}>{r.icon}</span>
                                <div><p style={{ fontSize: 20, fontWeight: 800, color: r.color, margin: 0 }}>{count}</p><p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{r.label}s</p></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Users Table */}
            <div className="card" style={{ padding: 0 }}>
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><div style={{ width: 32, height: 32, border: "3px solid #ede9fe", borderTopColor: "#7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /><style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style></div>
                ) : users.length === 0 ? (
                    <div className="empty-state"><div className="empty-state-icon" style={{ background: "#ede9fe" }}><Users style={{ width: 28, height: 28, color: "#7c3aed" }} /></div><p style={{ fontSize: 16, fontWeight: 600, color: "#1e1b4b" }}>Sin usuarios</p><button onClick={openCreate} className="btn-purple" style={{ marginTop: 12 }}>Crear Usuario</button></div>
                ) : (
                    <div style={{ overflowX: "auto" }}><table className="data-table"><thead><tr><th>Usuario</th><th>Email</th><th>Teléfono</th><th>Rol</th><th>Registrado</th><th>Acciones</th></tr></thead>
                    <tbody>{users.map(u => { const r = getRoleInfo(u.role); return (
                        <tr key={u.id}>
                            <td><div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 34, height: 34, borderRadius: 10, background: r.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: r.color }}>{u.fullName?.charAt(0)?.toUpperCase() || "U"}</div><span style={{ fontWeight: 600, color: "#1e1b4b" }}>{u.fullName}</span></div></td>
                            <td style={{ color: "#64748b" }}>{u.email}</td>
                            <td style={{ color: "#64748b" }}>{u.phone || "—"}</td>
                            <td><span style={{ padding: "3px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600, background: r.bg, color: r.color }}>{r.icon} {r.label}</span></td>
                            <td style={{ fontSize: 12, color: "#94a3b8" }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString("es-PE") : ""}</td>
                            <td><div style={{ display: "flex", gap: 4 }}>
                                <button onClick={() => openEdit(u)} style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #e8eaf0", background: "#fff", cursor: "pointer" }}><Edit2 style={{ width: 13, height: 13, color: "#7c3aed" }} /></button>
                                <button onClick={() => deleteUser(u.id)} style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #fee2e2", background: "#fef2f2", cursor: "pointer" }}><Trash2 style={{ width: 13, height: 13, color: "#ef4444" }} /></button>
                            </div></td>
                        </tr>
                    ); })}</tbody></table></div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()} style={{ width: 460, padding: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #e8eaf0" }}>
                            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>{editing ? "✏️ Editar" : "➕ Nuevo"} Usuario</h3>
                            <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X style={{ width: 20, height: 20, color: "#94a3b8" }} /></button>
                        </div>
                        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
                            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>NOMBRE COMPLETO</label><input className="input" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder="Juan Pérez" /></div>
                            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>EMAIL</label><input className="input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="usuario@endorfina.com" /></div>
                            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>CONTRASEÑA {editing && "(dejar vacío para mantener)"}</label>
                                <div style={{ position: "relative" }}>
                                    <input className="input" type={showPassword ? "text" : "password"} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder={editing ? "••••••••" : "Contraseña segura"} style={{ paddingRight: 40 }} />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>{showPassword ? <EyeOff style={{ width: 16, height: 16, color: "#94a3b8" }} /> : <Eye style={{ width: 16, height: 16, color: "#94a3b8" }} />}</button>
                                </div>
                            </div>
                            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>TELÉFONO</label><input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="999 999 999" /></div>
                            <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 8 }}>ROL</label>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                                    {ROLES.map(r => (
                                        <button key={r.value} type="button" onClick={() => setForm({ ...form, role: r.value })} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderRadius: 10, border: form.role === r.value ? `2px solid ${r.color}` : "2px solid #e8eaf0", background: form.role === r.value ? r.bg : "#fff", cursor: "pointer", textAlign: "left" }}>
                                            <span style={{ fontSize: 20 }}>{r.icon}</span>
                                            <span style={{ fontSize: 13, fontWeight: 600, color: form.role === r.value ? r.color : "#64748b" }}>{r.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                                <button onClick={() => setShowForm(false)} className="btn-secondary" style={{ flex: 1 }}>Cancelar</button>
                                <button onClick={save} className="btn-purple" style={{ flex: 1 }}>{editing ? "Guardar" : "Crear Usuario"}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
