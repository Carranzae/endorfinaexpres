"use client";

export default function ClubSection() {
  return (
    <section id="club" className="w-full bg-[#111] text-white py-16 lg:py-24 px-6 lg:px-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        
        {/* Left: Text Content */}
        <div className="flex-1">
          <h2 
            className="text-5xl md:text-7xl lg:text-[80px] leading-none font-black text-[#E6FF00] uppercase tracking-tighter mb-8"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            CONOCE MÁS <br className="hidden lg:block"/> FAMILIA <br className="hidden lg:block"/> ENDORFINA
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 font-medium mb-8 max-w-xl" style={{ fontFamily: "Poppins, sans-serif" }}>
            Somos más que un restaurante, somos una comunidad que vibra con la buena comida. Nos encanta preparar cada plato con pasión, buscando siempre esa sonrisa de satisfacción.
          </p>
          <div className="flex flex-wrap gap-4">
             <div className="bg-transparent border-2 border-white px-6 py-3 font-bold uppercase tracking-widest" style={{ fontFamily: "Oswald, sans-serif" }}>
               Misión
             </div>
             <div className="bg-transparent border-2 border-white px-6 py-3 font-bold uppercase tracking-widest" style={{ fontFamily: "Oswald, sans-serif" }}>
               Visión
             </div>
          </div>
        </div>

        {/* Right: Images Composition */}
        <div className="flex-1 relative w-full aspect-square md:aspect-video lg:aspect-square flex items-center justify-center">
          <div className="relative w-[80%] h-[80%] bg-[#f27f0d] rounded-2xl border-4 border-[#E6FF00] shadow-[12px_12px_0_0_#E6FF00] overflow-hidden transform rotate-3">
             <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80" alt="Familia Endorfina" className="w-full h-full object-cover opacity-90" />
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full flex items-center justify-center border-4 border-[#111] shadow-[4px_4px_0_0_#111] transform -rotate-12 z-10 transition-transform hover:rotate-12">
            <span className="text-[#111] font-black text-center leading-tight uppercase" style={{ fontFamily: "Oswald, sans-serif" }}>100%<br/>Local</span>
          </div>
        </div>
      </div>
    </section>
  );
}
