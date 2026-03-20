"use client";

const EVENTS = [
  { id: 1, title: "TALLER DE HAMBURGUESAS", date: "Próximo Viernes", tags: ["Chef", "En Vivo"] },
  { id: 2, title: "NOCHE DE DJ & ALITAS", date: "Fin de Mes", tags: ["Música", "Promos"] },
];

export default function EventsSection() {
  return (
    <section className="w-full bg-[#f27f0d] py-16 lg:py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12 border-b-4 border-[#111] pb-6">
          <h2 
            className="text-4xl md:text-[60px] leading-none font-black text-[#111] uppercase tracking-tighter"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            WORKSHOPS <br className="md:hidden" /> Y EVENTOS
          </h2>
          <span className="material-symbols-outlined text-[60px] md:text-[100px] text-[#111] hidden md:block">
            celebration
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {EVENTS.map((ev) => (
            <div key={ev.id} className="bg-[#FDF9F6] border-4 border-[#111] p-8 shadow-[8px_8px_0_0_#111] hover:shadow-[12px_12px_0_0_#111] transition-shadow relative overflow-hidden group">
              {/* Highlight bar */}
              <div className="absolute top-0 left-0 w-full h-3 bg-[#E6FF00] border-b-4 border-[#111]" />
              
              <div className="mt-4 flex gap-2 mb-4">
                {ev.tags.map(t => (
                  <span key={t} className="bg-[#111] text-white text-xs font-bold uppercase tracking-widest px-3 py-1" style={{ fontFamily: "Oswald, sans-serif" }}>
                    {t}
                  </span>
                ))}
              </div>
              
              <h3 className="text-3xl lg:text-4xl font-bold uppercase text-[#111] mb-2" style={{ fontFamily: "Oswald, sans-serif" }}>
                {ev.title}
              </h3>
              <p className="text-xl font-medium text-gray-700" style={{ fontFamily: "Poppins, sans-serif" }}>
                {ev.date}
              </p>
              
              <div className="mt-8">
                 <button className="bg-transparent text-[#111] px-6 py-2 border-2 border-[#111] font-bold uppercase tracking-widest hover:bg-[#111] hover:text-[#E6FF00] transition-colors" style={{ fontFamily: "Oswald, sans-serif" }}>
                   MÁS INFO
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
