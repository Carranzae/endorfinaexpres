"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function DatosPage() {
  const router = useRouter();

  return (
    <div className="legal-container">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Inter:wght@400;600;700&display=swap');
        body { margin: 0; font-family: 'Inter', sans-serif; background-color: #e3d2be; color: #111; }
        .legal-container { min-height: 100vh; padding: 40px; display: flex; justify-content: center; }
        .legal-content { background: #fff; border: 4px solid #111; border-radius: 12px; padding: 40px; width: 100%; max-width: 800px; box-shadow: 12px 12px 0px #111; position: relative; }
        .btn-back { position: absolute; top: -24px; left: -24px; background: #f97316; border: 3px solid #111; border-radius: 50%; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #111; box-shadow: 4px 4px 0px #111; }
        .title { font-family: 'Oswald', sans-serif; font-size: 40px; text-transform: uppercase; margin: 0 0 20px; }
      `}</style>
      <div className="legal-content">
        <button className="btn-back" onClick={() => router.push("/")}><ArrowLeft size={24} strokeWidth={3} /></button>
        <h1 className="title">Protección de Datos Personales</h1>
        <p>En cumplimiento con la Ley de Protección de Datos Personales (Ley N° 29733), te informamos que los datos que nos proporcionan de forma facultativa y voluntaria serán almacenados y custodiados.</p>
        <p>El uso será exclusivamente para brindarte un mejor servicio, ofertas de "Club Endorfina" y acumulación de puntos por compras. Puedes solicitar el retiro o corrección de tus datos enviando un correo a hola@endorfinaexpress.pe.</p>
      </div>
    </div>
  );
}
