"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function CookiesPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#ddd", fontFamily: "'Space Grotesk', sans-serif" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 20px" }}>
        <button 
          onClick={() => router.push("/")}
          style={{ background: "transparent", border: "none", color: "#39FF14", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 16, marginBottom: 40 }}
        >
          <ArrowLeft size={20} /> Volver al inicio
        </button>

        <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 48, color: "white", marginBottom: 30, textTransform: "uppercase" }}>Política de Cookies</h1>
        
        <div style={{ lineHeight: 1.8, fontSize: 16 }}>
          <p style={{ marginBottom: 20 }}>
            En Endorfina Express, utilizamos cookies y tecnologías similares para ofrecerle la mejor experiencia ultra-rápida y personalizada en nuestra plataforma web.
          </p>

          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 24, color: "white", marginTop: 40, marginBottom: 15 }}>¿Qué son las Cookies?</h2>
          <p style={{ marginBottom: 20 }}>
            Las cookies son pequeños archivos de texto que se almacenan en su dispositivo (computadora o teléfono) cuando visita un sitio web. Ayudan al sitio a recordar información sobre su visita, como su inicio de sesión o artículos en su carrito de compras.
          </p>

          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 24, color: "white", marginTop: 40, marginBottom: 15 }}>Cómo usamos las Cookies</h2>
          <ul style={{ marginLeft: 20, marginBottom: 20 }}>
            <li style={{ marginBottom: 10 }}><strong>Esenciales:</strong> Cookies necesarias para el funcionamiento de la tienda, como la autenticación y el carrito de pedidos POS.</li>
            <li style={{ marginBottom: 10 }}><strong>De funcionalidad:</strong> Para recordar sus preferencias de idioma o dirección favorita.</li>
            <li style={{ marginBottom: 10 }}><strong>Analíticas:</strong> Nos ayudan a entender cómo los clientes interactúan con nuestra página, lo que nos permite mejorar el diseño y el rendimiento de Endorfina Express.</li>
          </ul>

          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 24, color: "white", marginTop: 40, marginBottom: 15 }}>Gestión de Cookies</h2>
          <p style={{ marginBottom: 20 }}>
            Usted puede modificar la configuración de su navegador para rechazar o eliminar las cookies en cualquier momento. Sin embargo, tenga en cuenta que si desactiva las cookies esenciales, es posible que no pueda realizar pedidos en nuestra plataforma de manera correcta.
          </p>
        </div>
      </div>
    </div>
  );
}
