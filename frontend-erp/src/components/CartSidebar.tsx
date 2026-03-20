"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { api } from "@/lib/axios";
import { useState } from "react";

const WHATSAPP = "51994466800";
const PEDIDOSYA = "https://www.pedidosya.com.pe";

export default function CartSidebar() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState("");

  const sendToBackend = async () => {
    setOrdering(true);
    setOrderError("");
    try {
      await api.post("/orders", {
        customerName: "Cliente Web",
        type: "DELIVERY",
        items: items.map(i => ({ productId: i.id, quantity: i.quantity, unitPrice: i.price })),
        total: getTotal(),
      });
      setOrderSuccess(true);
      clearCart();
      setTimeout(() => { setOrderSuccess(false); toggleCart(); }, 3000);
    } catch (e: any) {
      setOrderError(e.response?.data?.message || "Error al enviar pedido. Intenta por WhatsApp.");
    } finally {
      setOrdering(false);
    }
  };

  const sendWhatsApp = () => {
    let msg = "🍽️ *PEDIDO – ENDORFINA EXPRESS*\n\n";
    items.forEach(i => {
      msg += `• ${i.quantity}x ${i.name} — S/ ${(i.price * i.quantity).toFixed(2)}\n`;
    });
    msg += `\n💰 *TOTAL: S/ ${getTotal().toFixed(2)}*\n\n📍 Av. Mansiche 123, UPN – Trujillo\n_Pago: Yape / Plin / Efectivo_`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="relative w-full max-w-md bg-[#FFF8F0] h-full flex flex-col border-l-4 border-[#1c1c1c]"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b-4 border-[#1c1c1c] flex justify-between items-center bg-[#1c1c1c]">
              <h2 className="text-white text-2xl" style={{ fontFamily: "Oswald, sans-serif" }}>
                MI CARRITO 🛒
              </h2>
              <button onClick={toggleCart} className="text-white hover:text-[#f27f0d] transition-colors">
                <span className="material-symbols-outlined text-3xl">close</span>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                  <span className="material-symbols-outlined text-7xl text-[#ccc]">shopping_cart</span>
                  <p className="text-xl text-gray-400" style={{ fontFamily: "Oswald, sans-serif" }}>
                    ¡TU CARRITO ESTÁ VACÍO!
                  </p>
                  <button
                    onClick={() => { toggleCart(); setTimeout(() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" }), 300); }}
                    className="bg-[#f27f0d] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#d4650a] transition-colors"
                    style={{ fontFamily: "Oswald, sans-serif" }}
                  >
                    VER MENÚ
                  </button>
                </div>
              ) : items.map(item => (
                <div key={item.id} className="bg-white rounded-xl border-2 border-[#1c1c1c] shadow-[4px_4px_0px_0px_#1c1c1c] p-4 flex gap-4 items-center">
                  <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center">
                    {item.imageUrl
                      ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-1" />
                      : <span className="material-symbols-outlined text-4xl text-gray-300">dinner_dining</span>
                    }
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm leading-tight" style={{ fontFamily: "Oswald, sans-serif" }}>{item.name}</p>
                    <p className="text-[#f27f0d] font-bold text-sm">S/ {item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border-2 border-[#1c1c1c] rounded-lg overflow-hidden">
                        <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 hover:bg-gray-100 transition-colors bg-white">
                          <span className="material-symbols-outlined text-sm" style={{ fontSize: "16px" }}>remove</span>
                        </button>
                        <span className="w-8 text-center font-black text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 hover:bg-gray-100 transition-colors bg-white">
                          <span className="material-symbols-outlined text-sm" style={{ fontSize: "16px" }}>add</span>
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors ml-auto">
                        <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>delete</span>
                      </button>
                    </div>
                  </div>
                  <p className="font-black text-base shrink-0">S/ {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* Footer */}
            {orderSuccess ? (
              <div className="p-6 border-t-4 border-[#1c1c1c] bg-[#22C55E] text-center">
                <p className="text-white text-2xl font-black" style={{ fontFamily: "Oswald, sans-serif" }}>
                  ✅ ¡PEDIDO ENVIADO!
                </p>
                <p className="text-white/80 text-sm mt-1">Tu pedido está siendo preparado</p>
              </div>
            ) : items.length > 0 && (
              <div className="p-6 border-t-4 border-[#1c1c1c] bg-white space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-500 uppercase text-sm tracking-wider">Total</span>
                  <span className="text-3xl font-black" style={{ fontFamily: "Oswald, sans-serif" }}>
                    S/ {getTotal().toFixed(2)}
                  </span>
                </div>
                {orderError && (
                  <div className="bg-red-50 border border-red-300 rounded-lg p-3 text-red-600 text-sm">{orderError}</div>
                )}
                <button
                  onClick={sendToBackend}
                  disabled={ordering}
                  className="w-full py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all hover:-translate-y-1 border-2 border-[#1c1c1c] shadow-[4px_4px_0px_0px_#1c1c1c]"
                  style={{ backgroundColor: "#f27f0d", fontFamily: "Oswald, sans-serif", opacity: ordering ? 0.6 : 1 }}
                >
                  <span className="material-symbols-outlined">restaurant</span>
                  {ordering ? "ENVIANDO..." : "🛎️ PEDIR ONLINE"}
                </button>
                <button
                  onClick={sendWhatsApp}
                  className="w-full py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all hover:-translate-y-1 border-2 border-[#1c1c1c] shadow-[4px_4px_0px_0px_#1c1c1c]"
                  style={{ backgroundColor: "#25D366", fontFamily: "Oswald, sans-serif" }}
                >
                  <span className="material-symbols-outlined">chat</span>
                  PEDIR POR WHATSAPP
                </button>
                <a
                  href={PEDIDOSYA} target="_blank" rel="noopener noreferrer"
                  className="flex w-full py-3 rounded-xl font-bold text-white text-base items-center justify-center gap-2 hover:opacity-90 transition-all border-2 border-[#1c1c1c]"
                  style={{ backgroundColor: "#FA0050", fontFamily: "Oswald, sans-serif" }}
                >
                  🍕 TAMBIÉN EN PEDIDOSYA
                </a>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
