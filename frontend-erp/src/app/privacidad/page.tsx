export default function PrivacidadPage() {
  return (
    <div className="bg-[#FDF9F6] min-h-screen py-16 px-6 lg:px-12 font-medium" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="max-w-4xl mx-auto bg-white border-4 border-[#111] p-8 md:p-12 shadow-[8px_8px_0_0_#111]">
        <h1 className="text-4xl md:text-5xl font-black uppercase mb-8 border-b-4 border-[#111] pb-4" style={{ fontFamily: "Oswald, sans-serif" }}>
          Políticas de Privacidad y Tratamiento de Datos
        </h1>
        
        <div className="space-y-6 text-gray-800 text-sm md:text-base leading-relaxed">
          <p>
            En <strong>Endorfina Express</strong> valoramos tu privacidad y nos comprometemos a proteger los datos personales que nos compartes. 
            Esta política describe cómo recopilamos, usamos y protegemos tu información.
          </p>
          
          <h2 className="text-xl font-bold uppercase mt-6">1. ¿Qué datos recopilamos?</h2>
          <p>
            Recopilamos nombres, correos electrónicos, números de teléfono, direcciones y referencias de ubicación cuando:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Realizas un pedido a través de nuestra plataforma en línea.</li>
              <li>Te suscribes a nuestro boletín para descuentos y promociones.</li>
              <li>Ingresas una incidencia en nuestro Libro de Reclamaciones.</li>
            </ul>
          </p>

          <h2 className="text-xl font-bold uppercase mt-6">2. Uso de la Información</h2>
          <p>
            Los datos sirven exclusivamente para el procesamiento, envío y seguimiento de pedidos, y para mantener un sistema de fidelización asociado a tu perfil (identificado por correo y teléfono).
          </p>
          
          <h2 className="text-xl font-bold uppercase mt-6">3. Cookies</h2>
          <p>
            Utilizamos <em>cookies</em> necesarias para el funcionamiento de la sesión y el carrito de compras. Si rechazas el uso de cookies, podrías experimentar fallas transaccionales y la denegación del uso de la plataforma por razones de seguridad anti-fraude.
          </p>

          <h2 className="text-xl font-bold uppercase mt-6">4. Tus Derechos</h2>
          <p>
            De acuerdo con la Ley de Protección de Datos Personales, tienes derecho a solicitar la rectificación, cancelación u oposición al uso de tus datos escribiéndonos directamente a nuestro servicio de WhatsApp.
          </p>
        </div>
        
        <div className="mt-12 text-center">
          <a href="/" className="inline-block bg-[#E6FF00] px-8 py-3 font-bold uppercase border-2 border-[#111] shadow-[4px_4px_0_0_#111] hover:-translate-y-1 transition-transform" style={{ fontFamily: "Oswald, sans-serif" }}>
            Volver a la Tienda
          </a>
        </div>
      </div>
    </div>
  );
}
