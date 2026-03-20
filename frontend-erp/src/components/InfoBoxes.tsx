"use client";

import { motion } from "framer-motion";

export default function InfoBoxes() {
  return (
    <div className="w-full bg-[#FDF9F6] py-12 lg:py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Sky Blue Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-[#7DD3FC] p-8 lg:p-12 h-[350px] lg:h-[400px] flex flex-col justify-between relative overflow-hidden group border border-transparent hover:border-[#111] transition-all"
        >
          <div className="relative z-10 w-3/4">
            <h2 className="text-4xl lg:text-5xl font-black uppercase text-[#111] leading-[1] tracking-tight mb-4" style={{ fontFamily: "Oswald, sans-serif" }}>
              CONOCE MÁS DE NOSOTROS
            </h2>
            <p className="text-[#111] font-medium text-xs lg:text-sm uppercase tracking-wider leading-relaxed mb-8">
              ¿Te gusta nuestra comida?<br/>Te gustarán más quiénes<br/>la preparan.
            </p>
            <a href="#club" className="inline-block bg-[#111] text-white uppercase tracking-widest text-sm lg:text-base font-bold px-6 py-3 border border-[#111] hover:bg-transparent hover:text-[#111] transition-colors" style={{ fontFamily: "Oswald, sans-serif" }}>
              CONÓCENOS
            </a>
          </div>
          
          {/* Decorative Emoji / Character replacing Hand Illustration */}
          <div className="absolute -bottom-8 -right-8 text-[180px] lg:text-[220px] transition-transform group-hover:rotate-12 group-hover:scale-110 duration-500">
            🤟
          </div>
        </motion.div>

        {/* Yellow Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          className="bg-[#E6FF00] p-8 lg:p-12 h-[350px] lg:h-[400px] flex flex-col justify-between relative overflow-hidden group border border-transparent hover:border-[#111] transition-all"
        >
          <div className="relative z-10 w-3/4">
            <h2 className="text-4xl lg:text-5xl font-black uppercase text-[#111] leading-[1] tracking-tight mb-4" style={{ fontFamily: "Oswald, sans-serif" }}>
              HAY UN ENDORFINA CERCA DE TI
            </h2>
            <p className="text-[#111] font-medium text-xs lg:text-sm uppercase tracking-wider leading-relaxed mb-8">
              Ingresa y conoce nuestra<br/>lista de locales.
            </p>
            <a href="#footer" className="inline-block bg-[#111] text-white uppercase tracking-widest text-sm lg:text-base font-bold px-6 py-3 border border-[#111] hover:bg-transparent hover:text-[#111] transition-colors" style={{ fontFamily: "Oswald, sans-serif" }}>
              NUESTROS LOCALES
            </a>
          </div>
          
          {/* Decorative Emoji / Character */}
          <div className="absolute bottom-[-10%] right-[-10%] text-[180px] lg:text-[220px] transition-transform group-hover:-rotate-12 group-hover:translate-x-[-10%] duration-500">
            🏃
          </div>
        </motion.div>

        {/* Green Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="bg-[#22C55E] p-8 lg:p-12 h-[350px] lg:h-[400px] flex flex-col justify-between relative overflow-hidden group border border-transparent hover:border-[#111] transition-all"
        >
          <div className="relative z-10 w-3/4">
            <h2 className="text-4xl lg:text-5xl font-black uppercase text-[#111] leading-[1] tracking-tight mb-4" style={{ fontFamily: "Oswald, sans-serif" }}>
              WORKSHOPS & EVENTOS
            </h2>
            <p className="text-[#111] font-medium text-xs lg:text-sm uppercase tracking-wider leading-relaxed mb-8">
              Conoce como nos<br/>divertimos junto a<br/>nuestra comunidad.
            </p>
            <a href="#club" className="inline-block bg-[#111] text-white uppercase tracking-widest text-sm lg:text-base font-bold px-6 py-3 border border-[#111] hover:bg-transparent hover:text-[#111] transition-colors" style={{ fontFamily: "Oswald, sans-serif" }}>
              QUIERO SABER MÁS
            </a>
          </div>
          
          {/* Decorative Emoji / Character */}
          <div className="absolute -right-10 top-1/2 -translate-y-1/2 text-[180px] lg:text-[220px] transition-transform group-hover:scale-110 duration-500">
            👍
          </div>
        </motion.div>

      </div>
    </div>
  );
}
