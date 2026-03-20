"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section id="inicio" className="relative overflow-hidden px-6 py-12 lg:px-20 lg:py-24 bg-[#FFF8F0]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT — Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="z-10"
        >
          <h1
            className="text-6xl md:text-8xl leading-[0.9] mb-6 text-[#1c1c1c]"
            style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700 }}
          >
            ¡HOLA, ENDORFIÑO!<br />
            <span className="text-[#f27f0d]">EL SABOR QUE TE HACE FELIZ, AL INSTANTE.</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-slate-600 max-w-lg font-semibold">
            Menú diario y platos a la carta a un paso de la UPN.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#menu"
              className="bg-[#1c1c1c] text-white text-2xl px-10 py-5 rounded-xl hover:bg-[#f27f0d] transition-all flex items-center gap-3 group shadow-xl hover:-translate-y-1"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              VER MENÚ DE HOY
              <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
            </a>
            <a
              href="#club"
              className="border-4 border-[#1c1c1c] text-[#1c1c1c] text-2xl px-8 py-5 rounded-xl hover:bg-[#1c1c1c] hover:text-white transition-all shadow-[4px_4px_0px_0px_#f27f0d] hover:-translate-y-1"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              🎉 ÚNETE AL CLUB
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-6 mt-10">
            <div className="flex items-center gap-2 font-semibold text-gray-500 text-sm">
              <span className="material-symbols-outlined text-[#f27f0d]">schedule</span>
              Entrega 20–30 min
            </div>
            <div className="flex items-center gap-2 font-semibold text-gray-500 text-sm">
              <span className="material-symbols-outlined text-yellow-400">star</span>
              4.9 en Google
            </div>
            <div className="flex items-center gap-2 font-semibold text-gray-500 text-sm">
              <span className="material-symbols-outlined text-green-500">verified</span>
              Envío gratis a UPN
            </div>
          </div>
        </motion.div>

        {/* RIGHT — Food image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex justify-center items-center min-h-[340px]"
        >
          {/* Background circle */}
          <div className="absolute w-72 h-72 md:w-96 md:h-96 bg-[#FFDAC1] rounded-full -z-10 blur-3xl opacity-60" />
          <div
            className="absolute w-72 h-72 md:w-80 md:h-80 rounded-full border-4 border-[#1c1c1c] bg-[#FFDAC1] -z-0"
            style={{ boxShadow: "8px 8px 0 #1c1c1c" }}
          />

          {/* Floating badge promo */}
          <div
            className="absolute top-2 left-0 z-20 bg-[#CCFF00] px-4 py-2 rounded-xl border-2 border-[#1c1c1c] shadow-[3px_3px_0px_0px_#1c1c1c] flex items-center gap-2"
          >
            <span className="text-xl">🔥</span>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase">Promo hoy</p>
              <p className="font-bold text-sm" style={{ fontFamily: "Oswald, sans-serif" }}>20% OFF CARNET UP</p>
            </div>
          </div>

          {/* Rating badge */}
          <div
            className="absolute bottom-2 right-0 z-20 bg-[#1c1c1c] text-white px-4 py-2 rounded-xl border-2 border-[#1c1c1c] shadow-[3px_3px_0px_0px_#f27f0d] flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-yellow-400" style={{ fontSize: "20px" }}>star</span>
            <p className="font-black text-sm" style={{ fontFamily: "Oswald, sans-serif" }}>4.9 / 5 ESTRELLAS</p>
          </div>

          {/* Food image */}
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBN1SjSUg3zsNO5LzD4Yy7AoXdOv6HY-vhMVg7bqUaf9pHb8kf1dkwc59W6xLvt0zG-oSDXgJMCpZV9gIUi-03c6vqRMHpbiQdwo5QGPAcIsmhvyhDn-ytL8_7kw1MxmVRa2O7WAMz4Rn-KrAAsKqk6DQ1z8itb5NUHOaWAXYkq7NYjNh5UbAqi7YhdobFNRnJECzUkLSxAOH0UlWTDi8Y9Io3RZFWXwps7q-pIuyC3XvWH1xPSfugbq77uJvie272QoBPMIxEFOss"
            alt="Plato estrella Endorfina Express"
            className="relative z-10 w-full max-w-md drop-shadow-2xl img-float"
          />
        </motion.div>
      </div>
    </section>
  );
}
