"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";

export default function ComplaintsPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", document: "", email: "", phone: "", detail: "", req: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    // In a real app this would send to an API endpoint
    setTimeout(() => {
      router.push("/");
    }, 4000);
  };

  if (sent) {
    return (
      <div style={{ minHeight: "100vh", background: "#050505", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Grotesk', sans-serif" }}>
        <div style={{ textAlign: "center", padding: 40, border: "1px solid #39FF14", borderRadius: 20, background: "#111" }}>
          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 36, color: "#39FF14", marginBottom: 20 }}>¡RECLAMO ENVIADO!</h2>
          <p>Hemos registrado su solicitud en nuestro Libro de Reclamaciones.</p>
          <p style={{ marginTop: 10, color: "#888" }}>Nos contactaremos con usted a la brevedad.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#ddd", fontFamily: "'Space Grotesk', sans-serif", paddingBottom: 100 }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 20px" }}>
        <button 
          onClick={() => router.push("/")}
          style={{ background: "transparent", border: "none", color: "#FF2A2A", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 16, marginBottom: 40 }}
        >
          <ArrowLeft size={20} /> Volver al Inicio
        </button>

        <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 48, color: "white", marginBottom: 30, textTransform: "uppercase" }}>Libro de Reclamaciones</h1>
        
        <p style={{ marginBottom: 40, color: "#aaa" }}>Conforme a lo establecido en el Código de Protección y Defensa del Consumidor (Ley N° 29571) de Perú, Endorfina Express pone a su disposición este formato para el ingreso de quejas o reclamos.</p>

        <form onSubmit={handleSubmit} style={{ background: "#111", padding: 40, borderRadius: 24, border: "1px solid rgba(255,42,42,0.3)" }}>
          <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 24, color: "white", marginBottom: 20 }}>1. Datos del Consumidor</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 30 }}>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>Nombre Completo *</label>
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ width: "100%", padding: 12, background: "#000", border: "1px solid #333", color: "white", borderRadius: 8 }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>DNI / CE *</label>
              <input required value={form.document} onChange={e => setForm({...form, document: e.target.value})} style={{ width: "100%", padding: 12, background: "#000", border: "1px solid #333", color: "white", borderRadius: 8 }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>Correo Electrónico *</label>
              <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ width: "100%", padding: 12, background: "#000", border: "1px solid #333", color: "white", borderRadius: 8 }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>Teléfono *</label>
              <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={{ width: "100%", padding: 12, background: "#000", border: "1px solid #333", color: "white", borderRadius: 8 }} />
            </div>
          </div>

          <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 24, color: "white", marginBottom: 20 }}>2. Detalle de Reclamo o Queja</h3>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>Detalle exacto de lo ocurrido *</label>
            <textarea required rows={4} value={form.detail} onChange={e => setForm({...form, detail: e.target.value})} style={{ width: "100%", padding: 12, background: "#000", border: "1px solid #333", color: "white", borderRadius: 8, resize: "vertical" }} />
          </div>
          <div style={{ marginBottom: 40 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>Pedido o Solicitud del Consumidor *</label>
            <textarea required rows={3} value={form.req} onChange={e => setForm({...form, req: e.target.value})} style={{ width: "100%", padding: 12, background: "#000", border: "1px solid #333", color: "white", borderRadius: 8, resize: "vertical" }} />
          </div>

          <button type="submit" style={{ background: "#FF2A2A", color: "white", border: "none", padding: "16px 30px", borderRadius: 8, fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, width: "100%", justifyContent: "center", letterSpacing: 2 }}>
            <Send size={20} /> ENVIAR RECLAMO
          </button>
        </form>
      </div>
    </div>
  );
}
