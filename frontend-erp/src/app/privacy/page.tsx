"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#ddd", fontFamily: "'Space Grotesk', sans-serif" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 20px" }}>
        <button 
          onClick={() => router.push("/")}
          style={{ background: "transparent", border: "none", color: "#00F0FF", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 16, marginBottom: 40 }}
        >
          <ArrowLeft size={20} /> Volver al inicio
        </button>

        <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 48, color: "white", marginBottom: 30, textTransform: "uppercase" }}>Políticas de Privacidad</h1>
        
        <div style={{ lineHeight: 1.8, fontSize: 16 }}>
          <p style={{ marginBottom: 20 }}>
            <strong>Última actualización: 15 de Marzo, 2026</strong>
          </p>
          <p style={{ marginBottom: 20 }}>
            En Endorfina Express ("nosotros", "nuestro"), respetamos profundamente su privacidad y nos comprometemos a proteger sus datos personales. Esta Política de Privacidad explica cómo recopilamos, usamos y protegemos la información cuando utiliza nuestro servicio de delivery y plataforma web.
          </p>
          
          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 24, color: "white", marginTop: 40, marginBottom: 15 }}>1. Información que recopilamos</h2>
          <p style={{ marginBottom: 20 }}>
            Recopilamos información personal que usted nos proporciona directamente al registrarse, realizar un pedido o suscribirse a nuestro newsletter. Esto incluye:
          </p>
          <ul style={{ marginLeft: 20, marginBottom: 20 }}>
            <li>Nombre completo</li>
            <li>Dirección de entrega</li>
            <li>Correo electrónico</li>
            <li>Número de teléfono</li>
          </ul>

          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 24, color: "white", marginTop: 40, marginBottom: 15 }}>2. Uso de la Información</h2>
          <p style={{ marginBottom: 20 }}>
            Utilizamos la información recopilada para:
          </p>
          <ul style={{ marginLeft: 20, marginBottom: 20 }}>
            <li>Procesar y entregar sus pedidos de comida rápidamente.</li>
            <li>Comunicarnos con usted sobre el estado de su pedido.</li>
            <li>Enviar ofertas exclusivas y novedades del Endorfina Club (si ha optado por recibirlas).</li>
            <li>Mejorar nuestra plataforma y experiencia de usuario.</li>
          </ul>

          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 24, color: "white", marginTop: 40, marginBottom: 15 }}>3. Protección de Datos</h2>
          <p style={{ marginBottom: 20 }}>
            Implementamos medidas de seguridad de nivel bancario y encriptación de extremo a extremo para garantizar que su información personal esté protegida contra acceso no autorizado, alteración o destrucción. 
          </p>

          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 24, color: "white", marginTop: 40, marginBottom: 15 }}>4. Sus Derechos (Ley de Protección de Datos Personales Peruana - Ley N° 29733)</h2>
          <p style={{ marginBottom: 20 }}>
            Usted tiene el derecho de acceso, rectificación, cancelación y oposición respecto a sus datos personales. Puede ejercer estos derechos contactándonos a través de nuestro correo electrónico de soporte.
          </p>
        </div>
      </div>
    </div>
  );
}
