"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/axios";

export default function ReclamacionesPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [issue, setIssue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/complaints", {
        name,
        email,
        phone,
        issue
      });
      alert("¡Tu reclamo o sugerencia ha sido enviado exitosamente! Lo revisaremos pronto.");
      setName("");
      setEmail("");
      setPhone("");
      setIssue("");
    } catch (error) {
      alert("Error enviando el reclamo. Inténtalo de nuevo.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="legal-container">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Inter:wght@400;600;700&display=swap');
        body { margin: 0; font-family: 'Inter', sans-serif; background-color: #e3d2be; color: #111; }
        .legal-container { min-height: 100vh; padding: 40px; display: flex; justify-content: center; }
        .legal-content { background: #fff; border: 4px solid #111; border-radius: 12px; padding: 40px; width: 100%; max-width: 800px; box-shadow: 12px 12px 0px #111; position: relative; }
        .btn-back { position: absolute; top: -24px; left: -24px; background: #f97316; border: 3px solid #111; border-radius: 50%; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #111; box-shadow: 4px 4px 0px #111; }
        .title { font-family: 'Oswald', sans-serif; font-size: 40px; text-transform: uppercase; margin: 0 0 20px; }
        
        .form-label { display: block; font-family: 'Oswald', sans-serif; font-size: 16px; margin: 16px 0 8px; text-transform: uppercase; font-weight: 700; }
        .form-input { width: 100%; padding: 12px; border: 3px solid #111; border-radius: 6px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 14px; outline: none; transition: box-shadow 0.1s; }
        .form-input:focus { box-shadow: 4px 4px 0px #f97316; }
        .form-textarea { width: 100%; padding: 12px; border: 3px solid #111; border-radius: 6px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 14px; min-height: 120px; outline: none; transition: box-shadow 0.1s; resize: vertical; }
        .form-textarea:focus { box-shadow: 4px 4px 0px #f97316; }
        
        .btn-submit { background: #111; color: #fff; border: none; padding: 16px 32px; font-family: 'Oswald', sans-serif; font-size: 18px; font-weight: 700; text-transform: uppercase; margin-top: 24px; cursor: pointer; border-radius: 8px; transition: background 0.1s; }
        .btn-submit:hover { background: #333; }
        .btn-submit:active { transform: translateY(2px); }
      `}</style>
      <div className="legal-content">
        <button className="btn-back" onClick={() => router.push("/")}><ArrowLeft size={24} strokeWidth={3} /></button>
        <h1 className="title">Libro de Reclamaciones</h1>
        <p>Conforme a lo establecido en el Código de Protección y Defensa del Consumidor, Endorfina Express S.A.C. cuenta con un Libro de Reclamaciones Virtual a tu disposición.</p>
        
        <form onSubmit={handleSubmit} style={{ marginTop: 32 }}>
          <label className="form-label">Nombre Completo</label>
          <input type="text" className="form-input" required value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Juan Pérez" />

          <label className="form-label">Correo (Opcional)</label>
          <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.com" />

          <label className="form-label">Teléfono / Celular</label>
          <input type="tel" className="form-input" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="999 999 999" />

          <label className="form-label">Detalle del Reclamo / Queja</label>
          <textarea className="form-textarea" required value={issue} onChange={e => setIssue(e.target.value)} placeholder="Describe tu reclamo o sugerencia aquí..."></textarea>

          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? "ENVIANDO..." : "ENVIAR RECLAMO"}
          </button>
        </form>

      </div>
    </div>
  );
}
