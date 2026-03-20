export default function PromoBanner() {
  const promos = [
    "🔥 PROMO DEL DÍA: 20% OFF CON CARNET UNIVERSITARIO",
    "🚀 ENVÍO GRATIS A LA UPN",
    "⭐ CLUB ENDORFINA: ÚNETE Y GANA PUNTOS",
    "🍽️ COMBOS DESDE S/ 12.90",
    "🎉 MENÚ EJECUTIVO DE LUN A VIE: S/ 15",
    "📞 PEDIDOS POR WHATSAPP AL TOQUE",
  ];

  const doubled = [...promos, ...promos];

  return (
    <div className="overflow-hidden bg-[#1c1c1c] py-5 border-y-4 border-[#f27f0d]">
      <div className="marquee-track gap-20">
        {doubled.map((text, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-10 text-white uppercase tracking-widest text-sm mr-20"
            style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, whiteSpace: "nowrap" }}
          >
            {text}
            <span className="w-2 h-2 rounded-full bg-[#f27f0d] inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
}
