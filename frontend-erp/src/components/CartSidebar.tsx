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
  const [showCheckout, setShowCheckout] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nombres: '',
    direccion: '',
    telefono: '',
    referencia: '',
    metodoPago: 'Yape / Plin',
  });

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrdering(true);
    setOrderError("");

    try {
      await api.post("/orders", {
        customerName: formData.nombres,
        type: "DELIVERY",
        notes: `Dir: ${formData.direccion} | Ref: ${formData.referencia} | Tel: ${formData.telefono} | Pago: ${formData.metodoPago}`,
        items: items.map(i => ({ productId: i.id, quantity: i.quantity, unitPrice: i.price })),
        total: getTotal(),
      });

      // Prepare WhatsApp Message
      let msg = "🍽️ *NUEVO PEDIDO ONLINE – ENDORFINA EXPRESS*\n\n";
      msg += `*Cliente:* ${formData.nombres}\n`;
      msg += `*Teléfono:* ${formData.telefono}\n`;
      msg += `*Dirección:* ${formData.direccion}\n`;
      if(formData.referencia) msg += `*Referencia:* ${formData.referencia}\n`;
      msg += `*Medio de pago:* ${formData.metodoPago}\n\n`;
      msg += `*🛒 Detalle del pedido:*\n`;
      items.forEach(i => {
        msg += `• ${i.quantity}x ${i.name} — S/ ${(i.price * i.quantity).toFixed(2)}\n`;
      });
      msg += `\n💰 *TOTAL PAGO: S/ ${getTotal().toFixed(2)}*\n`;
      
      // Abre Whatsapp
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");

      setOrderSuccess(true);
      clearCart();
      setTimeout(() => { 
        setOrderSuccess(false); 
        setShowCheckout(false);
        toggleCart(); 
      }, 3000);
    } catch (e: any) {
      setOrderError(e.response?.data?.message || "Error al enviar pedido. Intenta nuevamente.");
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
    <>
      {/* Botón Flotante */}
      {!isOpen && items.length > 0 && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={toggleCart}
          className="fixed bottom-6 right-6 z-50 bg-[#E6FF00] text-[#111] p-4 rounded-full border-4 border-[#111] shadow-[4px_4px_0_0_#111] hover:-translate-y-2 hover:shadow-[6px_6px_0_0_#111] transition-all flex items-center justify-center group"
        >
          <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">shopping_cart</span>
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#111]">
            {items.reduce((acc, curr) => acc + curr.quantity, 0)}
          </span>
        </motion.button>
      )}

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
            <div className="px-4 md:px-6 py-4 md:py-5 border-b-4 border-[#1c1c1c] flex justify-between items-center bg-[#1c1c1c]">
              <h2 className="text-white text-xl md:text-2xl flex items-center gap-2" style={{ fontFamily: "Oswald, sans-serif" }}>
                {showCheckout && (
                  <button onClick={() => setShowCheckout(false)} className="hover:text-[#f27f0d] transition-colors material-symbols-outlined mr-2">
                    arrow_back
                  </button>
                )}
                {showCheckout ? 'FINALIZAR PEDIDO' : 'MI CARRITO 🛒'}
              </h2>
              <button 
                onClick={() => { toggleCart(); setShowCheckout(false); }} 
                className="text-white hover:text-[#f27f0d] transition-colors"
              >
                <span className="material-symbols-outlined text-3xl">close</span>
              </button>
            </div>

            {/* Items or Checkout Form */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 md:space-y-4">
              {showCheckout ? (
                <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="flex flex-col gap-3 md:gap-4">
                  <div>
                    <label className="block font-bold text-[#111] mb-1 text-xs md:text-sm uppercase">Nombres Completos</label>
                    <input required type="text" value={formData.nombres} onChange={e => setFormData({...formData, nombres: e.target.value})} className="w-full border-2 border-[#111] p-2 md:p-3 text-sm focus:ring-4 focus:ring-[#E6FF00] outline-none" />
                  </div>
                  <div>
                    <label className="block font-bold text-[#111] mb-1 text-xs md:text-sm uppercase">Dirección de Entrega</label>
                    <input required type="text" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} className="w-full border-2 border-[#111] p-2 md:p-3 text-sm focus:ring-4 focus:ring-[#E6FF00] outline-none" />
                  </div>
                  <div>
                    <label className="block font-bold text-[#111] mb-1 text-xs md:text-sm uppercase">Celular</label>
                    <input required type="tel" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} className="w-full border-2 border-[#111] p-2 md:p-3 text-sm focus:ring-4 focus:ring-[#E6FF00] outline-none" />
                  </div>
                  <div>
                    <label className="block font-bold text-[#111] mb-1 text-xs md:text-sm uppercase">Referencia (Opcional)</label>
                    <input type="text" value={formData.referencia} onChange={e => setFormData({...formData, referencia: e.target.value})} className="w-full border-2 border-[#111] p-2 md:p-3 text-sm focus:ring-4 focus:ring-[#E6FF00] outline-none" />
                  </div>
                  <div>
                    <label className="block font-bold text-[#111] mb-1 text-xs md:text-sm uppercase">Método de Pago</label>
                    <select required value={formData.metodoPago} onChange={e => setFormData({...formData, metodoPago: e.target.value})} className="w-full border-2 border-[#111] p-2 md:p-3 text-sm focus:ring-4 focus:ring-[#E6FF00] outline-none font-bold bg-white">
                      <option value="Yape / Plin">Yape o Plin</option>
                      <option value="Efectivo">Efectivo</option>
                      <option value="Tarjeta (POS)">Tarjeta (POS a domicilio)</option>
                    </select>
                  </div>
                  <div className="bg-[#E6FF00] p-3 md:p-4 border-2 border-[#111] shadow-[4px_4px_0_0_#111] font-bold text-center mt-2 text-sm md:text-base">
                    Total a Pagar: S/ {getTotal().toFixed(2)}
                  </div>
                </form>
              ) : items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-3">
                  <span className="material-symbols-outlined text-5xl md:text-7xl text-[#ccc]">shopping_cart</span>
                  <p className="text-lg md:text-xl text-gray-400" style={{ fontFamily: "Oswald, sans-serif" }}>
                    ¡TU CARRITO ESTÁ VACÍO!
                  </p>
                  <button
                    onClick={() => { toggleCart(); setTimeout(() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" }), 300); }}
                    className="bg-[#f27f0d] text-white px-5 md:px-6 py-2 md:py-3 rounded-none font-bold hover:bg-[#d4650a] transition-colors border-2 border-[#111] shadow-[2px_2px_0_0_#111]"
                    style={{ fontFamily: "Oswald, sans-serif" }}
                  >
                    VER MENÚ
                  </button>
                </div>
              ) : items.map(item => (
                <div key={item.id} className="bg-white border-2 border-[#1c1c1c] shadow-[3px_3px_0px_0px_#1c1c1c] p-3 flex gap-3 items-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 bg-gray-50 border border-gray-200 flex items-center justify-center">
                    {item.imageUrl
                      ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-1" />
                      : <span className="material-symbols-outlined text-3xl text-gray-300">dinner_dining</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs md:text-sm leading-tight truncate" style={{ fontFamily: "Oswald, sans-serif" }}>{item.name}</p>
                    <p className="text-[#f27f0d] font-bold text-xs md:text-sm">S/ {item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                       <div className="flex items-center border-[1.5px] border-[#1c1c1c] bg-white">
                        <button onClick={() => updateQuantity(item.id, -1)} className="px-1.5 md:px-2 py-0.5 hover:bg-gray-100 transition-colors">
                          <span className="material-symbols-outlined text-[14px]">remove</span>
                        </button>
                        <span className="w-6 md:w-8 text-center font-black text-xs md:text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="px-1.5 md:px-2 py-0.5 hover:bg-gray-100 transition-colors">
                          <span className="material-symbols-outlined text-[14px]">add</span>
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors ml-auto">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                  <p className="font-black text-sm md:text-base shrink-0">S/ {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* Footer */}
            {orderSuccess ? (
              <div className="p-6 border-t-4 border-[#1c1c1c] bg-[#22C55E] text-center">
                <p className="text-white text-2xl font-black" style={{ fontFamily: "Oswald, sans-serif" }}>
                  ✅ ¡PEDIDO REGISTRADO!
                </p>
                <p className="text-white text-sm font-bold mt-2">Redirigiendo a WhatsApp...</p>
              </div>
            ) : items.length > 0 && (
              <div className="p-4 md:p-6 border-t-4 border-[#1c1c1c] bg-white space-y-3">
                {!showCheckout && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-500 uppercase text-sm tracking-wider">Total</span>
                    <span className="text-3xl font-black" style={{ fontFamily: "Oswald, sans-serif" }}>
                      S/ {getTotal().toFixed(2)}
                    </span>
                  </div>
                )}
                {orderError && (
                  <div className="bg-red-50 border-2 border-red-500 rounded-none p-3 text-red-600 font-bold uppercase text-sm">{orderError}</div>
                )}
                
                {showCheckout ? (
                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={ordering}
                    className="w-full py-3 md:py-4 font-black text-[#111] text-base md:text-xl flex items-center justify-center gap-2 hover:bg-white transition-all border-2 border-[#1c1c1c] shadow-[3px_3px_0px_0px_#1c1c1c] uppercase"
                    style={{ backgroundColor: "#E6FF00", fontFamily: "Oswald, sans-serif", opacity: ordering ? 0.6 : 1 }}
                  >
                    <span className="material-symbols-outlined text-xl">send</span>
                    {ordering ? "ENVIANDO..." : "CONFIRMAR PEDIDO"}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setShowCheckout(true)}
                      className="w-full py-3 md:py-4 font-black text-white text-base md:text-lg flex items-center justify-center gap-2 hover:-translate-y-1 transition-transform border-2 border-[#1c1c1c] shadow-[3px_3px_0px_0px_#1c1c1c]"
                      style={{ backgroundColor: "#f27f0d", fontFamily: "Oswald, sans-serif" }}
                    >
                      <span className="material-symbols-outlined text-xl">local_dining</span>
                      PEDIDO ONLINE
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={sendWhatsApp}
                        className="flex-1 py-2 md:py-3 font-bold text-white text-xs md:text-base flex items-center justify-center gap-1 hover:-translate-y-1 transition-transform border-2 border-[#1c1c1c] shadow-[2px_2px_0px_0px_#1c1c1c]"
                        style={{ backgroundColor: "#25D366", fontFamily: "Oswald, sans-serif" }}
                      >
                        <span className="material-symbols-outlined text-[16px]">chat</span>
                        WHATSAPP
                      </button>
                      <a
                        href={PEDIDOSYA} target="_blank" rel="noopener noreferrer"
                        className="flex-1 py-2 md:py-3 font-bold text-white text-xs md:text-base flex items-center justify-center gap-1 hover:-translate-y-1 transition-transform border-2 border-[#1c1c1c] shadow-[2px_2px_0px_0px_#1c1c1c]"
                        style={{ backgroundColor: "#FA0050", fontFamily: "Oswald, sans-serif" }}
                      >
                        PEDIDOSYA
                      </a>
                    </div>
                  </>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}
