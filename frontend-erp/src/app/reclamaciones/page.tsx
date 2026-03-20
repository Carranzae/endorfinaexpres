"use client";

import { useState } from "react";
import { api } from "@/lib/axios";

export default function ReclamacionesPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", issue: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    try {
      await api.post("/complaints", formData);
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", issue: "" });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.response?.data?.message || "Ocurrió un error al enviar el reclamo.");
    }
  };

  return (
    <div className="bg-[#FDF9F6] min-h-screen py-16 px-6 lg:px-12 font-medium" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="max-w-3xl mx-auto bg-white border-4 border-[#111] p-8 md:p-12 shadow-[8px_8px_0_0_#111]">
        <div className="flex items-center gap-4 border-b-4 border-[#111] pb-6 mb-8">
          <span className="material-symbols-outlined text-4xl md:text-5xl text-[#f27f0d]">history_edu</span>
          <h1 className="text-3xl md:text-5xl font-black uppercase leading-tight" style={{ fontFamily: "Oswald, sans-serif" }}>
            Libro de Reclamaciones Virtual
          </h1>
        </div>

        <p className="text-gray-700 mb-8 border-l-4 border-[#f27f0d] pl-4 text-sm md:text-base">
          Conforme a lo establecido en el Código de Protección y Defensa del Consumidor, contamos con un Libro de Reclamaciones Virtual. Envía tu disconformidad o reclamo a través del siguiente formulario y te responderemos a la brevedad.
        </p>

        {status === "success" ? (
          <div className="bg-[#22C55E] text-white p-6 font-bold uppercase tracking-widest text-center border-2 border-[#111] shadow-[4px_4px_0_0_#111]">
            ✓ RECLAMO REGISTRADO EXITOSAMENTE. NUESTRO EQUIPO TE CONTACTARÁ PRONTO.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {status === "error" && (
              <div className="bg-red-50 text-red-600 p-4 border-2 border-red-600 font-bold uppercase text-sm">
                Error: {errorMessage}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold uppercase text-[#111] mb-2">Nombre Completo (*)</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border-2 border-[#111] p-3 focus:ring-4 focus:ring-[#E6FF00] outline-none rounded-none" />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase text-[#111] mb-2">Teléfono de Contacto (*)</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full border-2 border-[#111] p-3 focus:ring-4 focus:ring-[#E6FF00] outline-none rounded-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold uppercase text-[#111] mb-2">Correo Electrónico (Opcional)</label>
              <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full border-2 border-[#111] p-3 focus:ring-4 focus:ring-[#E6FF00] outline-none rounded-none" />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase text-[#111] mb-2">Detalle de la Queja o Reclamo (*)</label>
              <textarea required rows={5} value={formData.issue} onChange={e => setFormData({ ...formData, issue: e.target.value })} className="w-full border-2 border-[#111] p-3 focus:ring-4 focus:ring-[#E6FF00] outline-none rounded-none resize-none" placeholder="Describe claramente tu inconveniente..."></textarea>
            </div>

            <button disabled={status === "loading"} type="submit" className="w-full bg-[#111] text-white py-4 font-black text-xl uppercase tracking-widest hover:bg-[#E6FF00] hover:text-[#111] transition-colors border-2 border-[#111] shadow-[4px_4px_0_0_#111] disabled:opacity-50" style={{ fontFamily: "Oswald, sans-serif" }}>
              {status === "loading" ? "ENVIANDO..." : "REGISTRAR RECLAMO"}
            </button>
          </form>
        )}
        
        <div className="mt-8 text-center">
          <a href="/" className="text-gray-500 hover:text-[#f27f0d] font-bold uppercase underline">Volver a Inicio</a>
        </div>
      </div>
    </div>
  );
}
