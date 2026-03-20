export default function Footer() {
  return (
    <footer id="footer" className="bg-[#1c1c1c] text-white px-6 py-12 lg:px-20 border-t-8 border-[#f27f0d]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo.png" alt="Endorfina Express Logo" className="w-12 h-12 object-contain rounded-xl" />
            <h2 className="text-3xl" style={{ fontFamily: "Oswald, sans-serif" }}>
              ENDORFINA EXPRESS
            </h2>
          </div>
          <p className="text-slate-400 font-light leading-relaxed">
            Endorfina Express S.A.C.<br />
            RUC: 20601234567
          </p>
          <div className="flex gap-3 mt-6">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
              className="w-11 h-11 bg-[#f27f0d] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-white text-xl">photo_camera</span>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
              className="w-11 h-11 bg-[#f27f0d] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-white text-xl">thumb_up</span>
            </a>
            <a href="https://wa.me/51994466800" target="_blank" rel="noopener noreferrer"
              className="w-11 h-11 bg-[#25D366] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-white text-xl">chat</span>
            </a>
          </div>
        </div>

        {/* Location */}
        <div>
          <h3 className="text-xl mb-4" style={{ fontFamily: "Oswald, sans-serif" }}>UBICACIÓN</h3>
          <div className="space-y-3 text-slate-400">
            <p className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[#f27f0d] shrink-0">location_on</span>
              Av. Mansiche 123, Frente a UPN<br />Trujillo, Perú
            </p>
            <p className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f27f0d] shrink-0">schedule</span>
              Mar – Dom: 11am a 10pm
            </p>
            <p className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f27f0d] shrink-0">phone</span>
              994 466 800
            </p>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-xl mb-4" style={{ fontFamily: "Oswald, sans-serif" }}>EXPLORA</h3>
          <ul className="space-y-3 text-slate-400 font-medium">
            <li><a href="#menu" className="hover:text-white transition-colors flex items-center gap-2"><span className="material-symbols-outlined text-sm" style={{ fontSize: "16px" }}>arrow_forward_ios</span>Nuestro Menú</a></li>
            <li><a href="#club" className="hover:text-white transition-colors flex items-center gap-2"><span className="material-symbols-outlined text-sm" style={{ fontSize: "16px" }}>arrow_forward_ios</span>Club Endorfina</a></li>
            <li><a href="/customer/login" className="hover:text-white transition-colors flex items-center gap-2"><span className="material-symbols-outlined text-sm" style={{ fontSize: "16px" }}>arrow_forward_ios</span>Mi Cuenta / Mis Puntos</a></li>
            <li>
              <a href="https://wa.me/51994466800" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-sm" style={{ fontSize: "16px" }}>arrow_forward_ios</span>Pedir por WhatsApp
              </a>
            </li>
            <li><a href="/privacidad" className="hover:text-white transition-colors flex items-center gap-2"><span className="material-symbols-outlined text-sm" style={{ fontSize: "16px" }}>arrow_forward_ios</span>Privacidad</a></li>
            <li><a href="/reclamaciones" className="hover:text-white transition-colors flex items-center gap-2"><span className="material-symbols-outlined text-sm" style={{ fontSize: "16px" }}>arrow_forward_ios</span>Reclamaciones</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        © 2026 Endorfina Express. Hecho con sabor en Trujillo. 🍽️
      </div>
    </footer>
  );
}
