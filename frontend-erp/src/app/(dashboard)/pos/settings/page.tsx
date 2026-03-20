"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Settings, Save, RefreshCw } from "lucide-react";

export default function SettingsPage() {
    const [settings, setSettings] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [localSettings, setLocalSettings] = useState<Record<string, string>>({});

    const fetchSettings = async () => {
        setLoading(true);
        try { const { data } = await api.get("/settings"); const map: Record<string, string> = {}; if (Array.isArray(data)) data.forEach((s: any) => map[s.key] = s.value); else if (typeof data === "object") Object.assign(map, data); setSettings(map); setLocalSettings(map); }
        catch { } finally { setLoading(false); }
    };
    useEffect(() => { fetchSettings(); }, []);

    const saveSettings = async () => {
        setSaving(true);
        try { await api.put("/settings", localSettings); setSettings(localSettings); alert("Configuración guardada"); }
        catch (e: any) { alert(e.response?.data?.message || "Error al guardar"); }
        finally { setSaving(false); }
    };

    const FIELDS = [
        { key: "restaurant_name", label: "Nombre del Restaurante", placeholder: "Endorfina Express" },
        { key: "restaurant_address", label: "Dirección", placeholder: "Av. Principal 123, Lima" },
        { key: "restaurant_phone", label: "Teléfono", placeholder: "+51 999 999 999" },
        { key: "restaurant_email", label: "Email de Contacto", placeholder: "contacto@endorfina.com" },
        { key: "restaurant_ruc", label: "RUC", placeholder: "20XXXXXXXXX" },
        { key: "whatsapp_number", label: "Número WhatsApp (pedidos)", placeholder: "51999999999" },
        { key: "pedidosya_link", label: "Link PedidosYa", placeholder: "https://pedidosya.com/..." },
        { key: "igv_rate", label: "Tasa IGV (%)", placeholder: "18" },
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div><h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>Configuración</h1><p style={{ fontSize: 14, color: "#94a3b8", margin: 0, marginTop: 4 }}>Ajustes generales del restaurante</p></div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={fetchSettings} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px" }}><RefreshCw style={{ width: 14, height: 14 }} /></button>
                    <button onClick={saveSettings} className="btn-purple" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px" }} disabled={saving}><Save style={{ width: 16, height: 16 }} /> {saving ? "Guardando..." : "Guardar Cambios"}</button>
                </div>
            </div>
            <div className="card" style={{ padding: 32 }}>
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><div style={{ width: 32, height: 32, border: "3px solid #ede9fe", borderTopColor: "#7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /><style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style></div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
                        {FIELDS.map(f => (
                            <div key={f.key}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>{f.label}</label>
                                <input className="input" value={localSettings[f.key] || ""} onChange={e => setLocalSettings({ ...localSettings, [f.key]: e.target.value })} placeholder={f.placeholder} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
