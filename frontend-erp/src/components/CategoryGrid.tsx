"use client";

import React from "react";

const CATEGORIES = [
  { id: "1", name: "ALITAS", icon: "skillet" },
  { id: "2", name: "WRAPS", icon: "tapas" },
  { id: "3", name: "FITPOKE", icon: "set_meal" },
  { id: "4", name: "BROASTER", icon: "kebab_dining" },
  { id: "5", name: "SALCHIPAPA", icon: "fastfood" },
  { id: "6", name: "COMBOS", icon: "takeout_dining" },
  { id: "7", name: "BEBIDAS", icon: "local_bar" },
];

export default function CategoryGrid() {
  return (
    <section className="w-full bg-[#FDF9F6] py-12 lg:py-16 px-6 lg:px-12 border-t-4 border-[#111]">
      <div className="max-w-7xl mx-auto">
        <h2 
          className="text-4xl lg:text-6xl font-black text-center text-[#111] uppercase tracking-tighter mb-10"
          style={{ fontFamily: "Oswald, sans-serif" }}
        >
          ¿QUÉ VAS A COMER HOY?
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {CATEGORIES.map((cat) => (
            <a 
              key={cat.id} 
              href="#menu"
              className="group bg-white flex flex-col items-center justify-center p-6 border-2 border-[#111] shadow-[4px_4px_0_0_#111] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#111] hover:bg-[#E6FF00] transition-all rounded-sm"
            >
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-[#FDF9F6] border-2 border-[#111] rounded-full flex items-center justify-center mb-4 group-hover:bg-white transition-colors">
                <span className="material-symbols-outlined text-3xl lg:text-4xl text-[#111]">
                  {cat.icon}
                </span>
              </div>
              <h3 
                className="text-xl lg:text-3xl font-bold uppercase text-[#111] tracking-tight text-center"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                {cat.name}
              </h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
