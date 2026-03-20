"use client";

import { useState } from "react";
import { api } from "@/lib/axios";

export default function SubscribeSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/newsletter/subscribe", {
        email,
        firstName: "Amigo",
        lastName: "Endorfina",
      });

      setSubmitted(true);
      setEmail("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al suscribirse.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-[#E6FF00] py-16 px-6 lg:px-12 border-b-4 border-[#111]">
      <div className="max-w-5xl mx-auto bg-white border-4 border-[#111] shadow-[8px_8px_0_0_#111] p-10 lg:p-16 flex flex-col items-center text-center">
        <h2 
          className="text-4xl lg:text-5xl font-black uppercase text-[#111] tracking-tighter mb-4" 
          style={{ fontFamily: "Oswald, sans-serif" }}
        >
          ¡SUSCRÍBETE Y APLICA 10% DE DSCTO!
        </h2>
        <p className="text-xl text-gray-700 font-medium mb-8" style={{ fontFamily: "Poppins, sans-serif" }}>
          Déjanos tu correo y recibe al instante tu código de descuento para tu próximo pedido.
        </p>

        {submitted ? (
          <div className="bg-[#22C55E] text-white px-8 py-4 font-bold uppercase tracking-widest text-xl border-2 border-[#111] shadow-[4px_4px_0_0_#111]">
             ¡Genial! Revisa tu bandeja de entrada.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-2xl flex flex-col md:flex-row gap-4">
             {error && <div className="w-full text-red-600 font-bold mb-2">{error}</div>}
             <input 
               type="email" 
               required 
               placeholder="ejemplo@correo.com"
               value={email} 
               onChange={e => setEmail(e.target.value)}
               className="flex-1 bg-[#FDF9F6] border-2 border-[#111] p-4 text-xl outline-none focus:ring-4 focus:ring-[#E6FF00] font-medium"
               style={{ fontFamily: "Poppins, sans-serif" }}
             />
             <button 
               type="submit" 
               disabled={loading}
               className="bg-[#111] text-white px-10 py-4 font-bold border-2 border-[#111] uppercase tracking-widest hover:bg-[#E6FF00] hover:text-[#111] transition-colors disabled:opacity-50"
               style={{ fontFamily: "Oswald, sans-serif", fontSize: "1.2rem" }}
             >
               {loading ? "ENVIANDO..." : "SUSCRIBIRME"}
             </button>
          </form>
        )}
      </div>
    </section>
  );
}
