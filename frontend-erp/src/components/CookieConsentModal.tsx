"use client";

import { useEffect, useState } from "react";

export default function CookieConsentModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only run on client
    const consent = localStorage.getItem("endorfina-cookie-consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("endorfina-cookie-consent", "true");
    setShow(false);
  };

  const handleDecline = () => {
    // Recarga la página y vuelve a mostrar el modal obligando a aceptar para navegar
    window.location.reload();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md pointer-events-auto"></div>
      <div className="relative bg-white border-4 border-[#111] shadow-[8px_8px_0_0_#E6FF00] p-6 md:p-10 max-w-xl w-full z-[1001] animate-in zoom-in-95 duration-300">
        <h2 className="text-3xl md:text-4xl font-black uppercase mb-4 text-[#111] leading-none" style={{ fontFamily: "Oswald, sans-serif" }}>
          🍪 AVISO DE COOKIES Y PRIVACIDAD
        </h2>
        <p className="text-[#111] font-medium mb-6 text-sm md:text-base leading-snug" style={{ fontFamily: "Poppins, sans-serif" }}>
          Utilizamos cookies y recopilación de datos para gestionar tus pedidos, mejorar tu experiencia y entregarte recompensas, todo bajo altos estándares de seguridad. 
          Al hacer clic en "Aceptar", declaras conocer y estar de acuerdo con nuestras <a href="/privacidad" target="_blank" className="bg-[#E6FF00] px-1 underline font-bold border border-[#111]">Políticas de Privacidad y Términos de Servicio</a>.
          <br/><br/>
          <span className="text-red-600 font-bold uppercase text-xs">Atención: El rechazo limitará estrictamente tu acceso a visualizar o interactuar con el menú de la plataforma, por política de seguridad y tratamiento de datos del restaurante.</span>
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <button 
            onClick={handleAccept} 
            className="flex-1 bg-[#111] text-white px-6 py-4 font-black border-2 border-[#111] uppercase tracking-widest hover:bg-[#E6FF00] hover:text-[#111] transition-colors"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            ACEPTAR Y CONTINUAR
          </button>
          <button 
            onClick={handleDecline} 
            className="px-6 py-4 font-black border-2 border-[#111] bg-white text-gray-500 hover:text-white uppercase tracking-widest hover:bg-red-600 transition-colors"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            RECHAZAR
          </button>
        </div>
      </div>
    </div>
  );
}
