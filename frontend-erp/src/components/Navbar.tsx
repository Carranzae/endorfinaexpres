"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const { items, toggleCart } = useCartStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalQty = items.reduce((a, b) => a + b.quantity, 0);

  return (
    <>
      {/* Top Black Bar (Utility) */}
      <div className="w-full bg-[#111] text-white py-1.5 px-6 flex justify-end items-center gap-6 text-[10px] sm:text-xs font-bold tracking-widest uppercase">
        <a href="/customer/login" className="hover:text-[#E6FF00] transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">person</span> 
          Mi Cuenta
        </a>
        <a href="#footer" className="hover:text-[#E6FF00] transition-colors">Contáctanos</a>
        <a href="https://wa.me/51994466800" target="_blank" rel="noopener noreferrer" className="hover:text-[#E6FF00] transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">support_agent</span> 
          Soporte WA
        </a>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 bg-[#FDF9F6] border-b border-gray-200 px-6 lg:px-12 py-3 lg:py-5 flex items-center justify-between">
        
        {/* Left: Mobile Toggle (only on small screens) */}
        <div className="md:hidden flex-1">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 -ml-2 text-[#111]">
            <span className="material-symbols-outlined text-3xl">{mobileOpen ? "close" : "menu"}</span>
          </button>
        </div>

        {/* Center/Left: Logo */}
        <div className="flex-1 md:flex-none flex justify-center md:justify-start">
          <a href="#inicio" className="flex items-center gap-2 lg:gap-3">
            <img src="/logo.png" alt="Endorfina" className="w-12 h-12 lg:w-14 lg:h-14 object-contain rounded-xl" />
            <span className="text-3xl lg:text-4xl tracking-tighter text-[#111]" style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700 }}>
              ENDORFINA
            </span>
          </a>
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-10 lg:gap-14">
          <a href="#menu" className="text-[#111] font-bold tracking-widest hover:text-gray-500 transition-colors text-lg" style={{ fontFamily: "Oswald, sans-serif" }}>CARTA</a>
          <a href="#club" className="text-[#111] font-bold tracking-widest hover:text-gray-500 transition-colors text-lg" style={{ fontFamily: "Oswald, sans-serif" }}>NOSOTROS</a>
          <a href="#footer" className="text-[#111] font-bold tracking-widest hover:text-gray-500 transition-colors text-lg" style={{ fontFamily: "Oswald, sans-serif" }}>LOCALES</a>
          <a href="/customer/login" className="text-[#111] font-bold tracking-widest hover:text-[#f27f0d] transition-colors text-lg flex items-center gap-1" style={{ fontFamily: "Oswald, sans-serif" }}>
            <span className="material-symbols-outlined text-xl">loyalty</span>
            MIS PUNTOS
          </a>
        </nav>

        {/* Right: Cart Button */}
        <div className="flex-1 flex justify-end">
          <button
            onClick={toggleCart}
            className="group relative bg-[#E6FF00] text-[#111] pl-4 pr-12 lg:pl-6 lg:pr-14 py-2 lg:py-3 rounded-[4px] border border-[#111] hover:bg-[#d4eb00] transition-colors flex flex-col justify-center text-left"
            style={{ boxShadow: "4px 4px 0px 0px #111" }}
          >
            <span className="font-bold text-lg lg:text-xl tracking-wide leading-tight" style={{ fontFamily: "Oswald, sans-serif" }}>
              TU PEDIDO
            </span>
            <span className="text-[10px] lg:text-xs font-medium tracking-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
              ¡Todo listo en 20 min!
            </span>
            
            {/* Absolute Icon/Badge container on the right edge */}
            <div className="absolute right-3 lg:right-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl lg:text-3xl">shopping_bag</span>
              {totalQty > 0 && (
                <span className="absolute -top-1 -right-2 w-5 h-5 bg-[#111] text-[#E6FF00] text-xs font-black rounded-full flex items-center justify-center">
                  {totalQty}
                </span>
              )}
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 py-4 px-6 flex flex-col gap-4 text-center">
          <a href="#menu" onClick={() => setMobileOpen(false)} className="text-2xl font-bold tracking-widest text-[#111]" style={{ fontFamily: "Oswald, sans-serif" }}>CARTA</a>
          <a href="#club" onClick={() => setMobileOpen(false)} className="text-2xl font-bold tracking-widest text-[#111]" style={{ fontFamily: "Oswald, sans-serif" }}>NOSOTROS</a>
          <a href="#footer" onClick={() => setMobileOpen(false)} className="text-2xl font-bold tracking-widest text-[#111]" style={{ fontFamily: "Oswald, sans-serif" }}>LOCALES</a>
          <a href="/customer/login" onClick={() => setMobileOpen(false)} className="text-2xl font-bold tracking-widest text-[#f27f0d] flex items-center justify-center gap-2" style={{ fontFamily: "Oswald, sans-serif" }}>
            <span className="material-symbols-outlined text-2xl">loyalty</span>
            MIS PUNTOS
          </a>
        </div>
      )}
    </>
  );
}
