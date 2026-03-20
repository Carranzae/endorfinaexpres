"use client";

import { motion } from "framer-motion";

export default function LocationSection() {
  return (
    <section className="w-full bg-[#E6FF00] py-16 lg:py-24 px-6 lg:px-12 border-y-4 border-[#111]">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h2 
          className="text-5xl md:text-[80px] leading-none font-black text-[#111] uppercase tracking-tighter mb-10 text-center"
          style={{ fontFamily: "Oswald, sans-serif" }}
        >
          NUESTRA DIRECCIÓN
        </h2>

        <div className="w-full grid lg:grid-cols-2 gap-10 lg:gap-0 border-4 border-[#111] shadow-[8px_8px_0_0_#111] bg-white overflow-hidden">
          {/* Info Block */}
          <div className="flex flex-col justify-center p-10 lg:p-16 relative">
             <div className="absolute top-4 right-4 text-[#111] opacity-10">
                <span className="material-symbols-outlined text-[100px] lg:text-[150px]">location_on</span>
             </div>
             
             <h3 className="text-3xl lg:text-5xl font-bold uppercase text-[#111] mb-6 relative z-10" style={{ fontFamily: "Oswald, sans-serif" }}>
               Ubícanos en
             </h3>
             <p className="text-2xl lg:text-3xl font-medium text-gray-800 mb-8 relative z-10" style={{ fontFamily: "Poppins, sans-serif" }}>
               Av. Universitaria 1234, <br/>
               Frente a la UPN, <br/>
               Trujillo - Perú
             </p>
             
             <div className="flex flex-col gap-4 relative z-10">
               <div className="flex items-center gap-3">
                 <span className="material-symbols-outlined text-3xl text-[#f27f0d]">schedule</span>
                 <span className="text-xl font-bold uppercase" style={{ fontFamily: "Oswald, sans-serif" }}>Lunes a Viernes: 11:00 am - 10:00 pm</span>
               </div>
               <div className="flex items-center gap-3">
                 <span className="material-symbols-outlined text-3xl text-[#f27f0d]">schedule</span>
                 <span className="text-xl font-bold uppercase" style={{ fontFamily: "Oswald, sans-serif" }}>Sábados y Domingos: 12:00 pm - 11:00 pm</span>
               </div>
             </div>
             
             <a href="#map" className="mt-10 inline-block bg-[#111] text-white px-8 py-4 w-max font-bold tracking-widest uppercase hover:bg-[#f27f0d] transition-colors border-2 border-[#111]" style={{ fontFamily: "Oswald, sans-serif" }}>
               CÓMO LLEGAR
             </a>
          </div>
          
          {/* Map/Image Placeholder */}
          <div className="w-full h-[300px] lg:h-full bg-gray-300 border-t-4 lg:border-t-0 lg:border-l-4 border-[#111] relative isolate">
             <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80" alt="Fachada Local" className="absolute inset-0 w-full h-full object-cover grayscale mix-blend-multiply opacity-80" />
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="bg-[#111] text-[#E6FF00] px-4 py-2 border-2 border-white transform rotate-[-5deg] shadow-[4px_4px_0_0_#FFF]">
                  <span className="font-bold text-2xl uppercase tracking-widest" style={{ fontFamily: "Oswald, sans-serif" }}>¡Te esperamos!</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
