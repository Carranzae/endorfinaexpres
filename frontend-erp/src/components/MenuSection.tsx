"use client";

import { useState, useCallback, memo } from "react";
import { useCartStore } from "@/store/cartStore";
import OptimizedImage from "./OptimizedImage";
import dynamic from "next/dynamic";

// Dynamic import for framer-motion (heavy library - loaded on demand)
const motion = dynamic(
  () => import("framer-motion").then((m) => m.motion as any),
  { ssr: true }
) as any;
const AnimatePresence = dynamic(
  () => import("framer-motion").then((m) => m.AnimatePresence as any),
  { ssr: true }
) as any;

/* ── Static demo products ── */
export const DEMO_PRODUCTS = [
  {
    id: "p1",
    name: "Lomo Saltado",
    description: "Clásico wok peruano con lomo de res, tomate, cebolla y papas fritas.",
    price: 24.90,
    categoryId: "FONDOS",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC32PEJIkLDpoLRCf0yZI9PiENzEEuqFeA8wsizC0Eu3-N3PMtNqcIfyOER8Log6hO6oQ39WIcPJC5FEwU5V7HEZN45GZ9Fic1gc_LQCcYQopCHZ5pjespV2BEjOlBfxFwhjlMMy0D9TL8ZzO1P6DSV5-7Iz7_XL0aa1gYnwNAejJa7XkxRKXC0W-WyR1eqllKQbkXK-7BF-TweXViJTiN2AVinLKQqNTcqAoA7W_b-CQDb92BWL6YZr5ysPJUMPZF7bQHxS2oJ7Wo",
  },
  {
    id: "p2",
    name: "Ají de Gallina",
    description: "Cremosa salsa de ají amarillo con pollo desmenuzado y arroz.",
    price: 21.00,
    categoryId: "FONDOS",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkI9nL4SSPS3Ra_gAruqQ8DTfsNL7eQGlt7JRqgZYcyyta_BT1-4yYkmorKnOruKrKyKFX2OykKoXkb0Mf4fXCrVYk3EN8dNhUR92Q1dmQ7kfEBdvnjB2h30wI_aWpPV6IwpYA3byklrMYi5jHDI7UZBwEOhHhOTDbf2kgEmAYW7WGQL3NQtILBGJgnokPGT8THZPyhlaUQlKKodYtcWsJRaCWmruRhdgQ8uOm_N35jRXmaSMHmBuQpbxikd3RwJPUxWUpw5UVB_Y",
  },
  {
    id: "p3",
    name: "Arroz con Pollo",
    description: "Arroz verde con culantro, pollo tierno y ensalada criolla.",
    price: 19.50,
    categoryId: "FONDOS",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4bbwq9l34foDBS9piUP1qgJqxKvFwag2U_77ah6wzT1J57UqTBShz8zuioa9D3NJi_pW7yJHljXsiZ1kOg6Tw-NUw6_LmZLqFr1mCaATnRuGNjT-OZ7bqu8oi7vArhV9EDtuN9geBR7uJItS06sxog-wSaSA0XP26sbbzkE8GKPcqBF1iT2DdCtiilNFqA61CE2Pm9Yfa3Tq7Op6beEFXlN7vbhtn6dzwSbA7iePpAkaKnIln5TOb1ixWYvSpEFxfBeLIVOsQEjU",
  },
  {
    id: "p4",
    name: "Tallarines Rojos",
    description: "Pasta en salsa criolla de tomate con carne molida y queso parmesano.",
    price: 18.00,
    categoryId: "PASTAS",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAl3Xo7UDkASog_gcNVz8JAXYY28VFKQSWaIXqxlYoCOpgd_Bjj9zY6GzdB9y3vavopkCNB_eEej5NH-u1CuZhMtkHPZXxLgE8tFzuFVIfi_44MoGBZXBtpgj3AhhDSXRDoMGEqFtG2Nu1wXBRYqG_qnQOyPgLcsB8rbqbas5VXZ8J7bsFaf3tidnwvH-9dKMua_JOpLS7fVlOTt132UUvWcXbRRPifLQueQIUa6GN7J-4addq_HKaO3Rfu5sI1FBz1SdjbMWVQ4f0",
  },
];

// Reference neon colors matching the HTML reference
const CARD_COLORS = ["card-neon-1", "card-neon-2", "card-neon-3", "card-neon-4"];

const CATEGORIES = ["TODOS", "FONDOS", "PASTAS", "COMBOS", "BEBIDAS"];

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId?: string;
  imageUrl?: string;
}

interface Props {
  products: Product[];
  loading: boolean;
}

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useState(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  });
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 bg-[#1c1c1c] text-white px-5 py-4 rounded-xl border-2 border-[#f27f0d] shadow-[4px_4px_0px_0px_#f27f0d] toast-in">
      <span className="material-symbols-outlined text-green-400">check_circle</span>
      <span className="font-bold text-sm" style={{ fontFamily: "Oswald, sans-serif" }}>{message}</span>
    </div>
  );
}

export default function MenuSection({ products, loading }: Props) {
  const { addItem } = useCartStore();
  const [activeCategory, setActiveCategory] = useState("TODOS");
  const [toast, setToast] = useState<{ msg: string; key: number } | null>(null);

  const displayProducts = products.length > 0 ? products : DEMO_PRODUCTS;
  const filtered = activeCategory === "TODOS"
    ? displayProducts
    : displayProducts.filter(p => p.categoryId === activeCategory);

  const handleAdd = useCallback((product: Product) => {
    addItem(product);
    setToast({ msg: `¡${product.name} añadido! 🛒`, key: Date.now() });
  }, [addItem]);

  return (
    <section id="menu" className="px-6 py-20 lg:px-20 bg-white border-y-4 border-[#1c1c1c]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <h2
            className="text-5xl flex items-center gap-4"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            <span
              className="material-symbols-outlined text-4xl bg-[#f27f0d] text-white p-2 rounded-lg"
            >
              restaurant_menu
            </span>
            PLATOS A LA CARTA
          </h2>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-5 py-2 rounded-lg text-sm border-2 border-[#1c1c1c] transition-all hover:-translate-y-0.5
                  ${activeCategory === cat
                    ? "bg-[#1c1c1c] text-white shadow-[3px_3px_0px_0px_#f27f0d]"
                    : "bg-white text-[#1c1c1c] hover:bg-[#f27f0d] hover:text-white shadow-[2px_2px_0px_0px_#1c1c1c]"
                  }`}
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-14 h-14 border-4 border-[#f27f0d] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filtered.map((product, i) => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.07 }}
                  className={`${CARD_COLORS[i % 4]} p-6 rounded-xl flex flex-col items-center text-center group border-2 border-[#1c1c1c] shadow-[8px_8px_0px_0px_rgba(28,28,28,1)] hover:shadow-[4px_4px_0px_0px_rgba(28,28,28,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200`}
                >
                  {/* Image */}
                  <div className="h-48 w-48 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    {product.imageUrl ? (
                      <OptimizedImage
                        src={product.imageUrl}
                        alt={product.name}
                        width={160}
                        height={160}
                        priority={false}
                        className="w-40 h-40 drop-shadow-xl"
                        objectFit="contain"
                        quality={70}
                      />
                    ) : (
                      <span className="material-symbols-outlined text-8xl text-white/60">dinner_dining</span>
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="text-2xl mt-4 w-full text-left" style={{ fontFamily: "Oswald, sans-serif" }}>
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-700 font-medium mt-1 mb-2 text-left w-full line-clamp-2">
                    {product.description || ""}
                  </p>

                  {/* Price */}
                  <p
                    className="font-bold text-xl text-[#1c1c1c] mb-4 w-full text-left"
                    style={{ fontFamily: "Oswald, sans-serif" }}
                  >
                    S/ {Number(product.price).toFixed(2)}
                  </p>

                  {/* Add to cart */}
                  <button
                    onClick={() => handleAdd(product)}
                    className="w-full bg-[#1c1c1c] text-white py-3 rounded-lg text-lg flex items-center justify-center gap-2 hover:bg-white hover:text-[#1c1c1c] border-2 border-[#1c1c1c] transition-colors"
                    style={{ fontFamily: "Oswald, sans-serif" }}
                  >
                    AÑADIR AL CARRITO
                    <span className="material-symbols-outlined">add_shopping_cart</span>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {filtered.length === 0 && !loading && (
          <div className="text-center py-20 text-gray-400">
            <span className="text-6xl">🍽️</span>
            <p className="mt-4 text-xl" style={{ fontFamily: "Oswald, sans-serif" }}>
              SIN PLATOS EN ESTA CATEGORÍA
            </p>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <Toast key={toast.key} message={toast.msg} onDone={() => setToast(null)} />
      )}
    </section>
  );
}
