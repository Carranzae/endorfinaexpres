"use client";

import { motion } from "framer-motion";

export default function HeroPickadeli() {
  return (
    <section id="inicio" className="w-full flex flex-col bg-[#FDF9F6] pb-12">
      {/* VER CARTA BUTTON (Sticky-like or prominent below the header) */}
      <div className="w-full px-4 lg:px-12 mt-4 lg:mt-8 z-20 relative">
        <a 
          href="#menu" 
          className="flex items-center gap-4 bg-[#E6FF00] p-4 lg:p-5 rounded-md border-2 border-[#111] transition-transform hover:-translate-y-1 shadow-[4px_4px_0_0_#111] w-full relative overflow-hidden group"
        >
          {/* Icon circle */}
          <div className="bg-[#111] text-white w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl lg:text-3xl">restaurant_menu</span>
          </div>
          
          {/* Text block */}
          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl lg:text-4xl font-black text-[#111] uppercase tracking-tight leading-none" style={{ fontFamily: "Oswald, sans-serif" }}>
              VER CARTA
            </h2>
            <p className="text-[#111] font-medium text-xs md:text-sm lg:text-base tracking-tight leading-tight mt-1" style={{ fontFamily: "Poppins, sans-serif" }}>
              ¡Conoce todo lo que tenemos para ti!
            </p>
          </div>
          
          {/* Arrow icon (decor) */}
          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
             <span className="material-symbols-outlined text-3xl lg:text-5xl text-[#111]">arrow_forward</span>
          </div>
          
          {/* Decorative lines mimicking sketch arrow */}
          <div className="absolute right-0 bottom-0 opacity-10 blur-[1px] transform translate-y-4 right-10 scale-[2] pointer-events-none text-black">
             <span className="material-symbols-outlined text-[80px]">north_west</span>
          </div>
        </a>
      </div>

      {/* HERO IMAGE / CAROUSEL BLOCK */}
      <div className="w-full mt-6 lg:mt-10 px-0 lg:px-12 relative overflow-hidden group">
        <div className="relative w-full aspect-[4/3] lg:aspect-[21/9] bg-gray-200 lg:rounded-2xl overflow-hidden border-y lg:border-2 border-[#111] shadow-none lg:shadow-[8px_8px_0_0_#111]">
          {/* Background image (representing the photo carousel) */}
          <img 
            src="https://images.unsplash.com/photo-1543826173-70651703c5a4?auto=format&fit=crop&q=80" 
            alt="Hero Food" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          {/* Branding / Tagline over image */}
          <div className="absolute bottom-10 left-6 lg:bottom-16 lg:left-12 flex flex-col items-start z-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
              className="bg-[#22C55E] text-white px-3 py-1 mb-1 lg:mb-2 transform -rotate-2 border border-[#111]"
            >
              <span className="font-bold text-sm md:text-lg lg:text-xl uppercase tracking-widest" style={{ fontFamily: "Oswald, sans-serif" }}>
                Sabor Indiscutible
              </span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-[#7DD3FC] text-[#111] px-3 md:px-5 py-1 md:py-2 transform -rotate-1 border-2 border-[#111] shadow-[4px_4px_0_0_#111]"
            >
              <h1 className="text-2xl md:text-4xl lg:text-6xl font-black uppercase tracking-tight" style={{ fontFamily: "Oswald, sans-serif" }}>
                NUEVOS COMBOS
              </h1>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* PIDE AQUI BUTTON */}
      <div className="w-full px-4 lg:px-12 flex justify-center mt-6 md:mt-10">
        <a 
          href="#menu"
          className="bg-[#111] text-white px-8 md:px-12 py-3 lg:py-5 w-full md:w-auto min-w-[200px] lg:min-w-[300px] text-center border-2 border-transparent hover:border-[#111] hover:bg-white hover:text-[#111] transition-colors rounded-sm shadow-[4px_4px_0_0_rgba(0,0,0,0.2)]"
        >
          <span className="text-xl md:text-2xl lg:text-3xl font-bold uppercase tracking-widest" style={{ fontFamily: "Oswald, sans-serif" }}>PIDE AQUÍ</span>
        </a>
      </div>
    </section>
  );
}
