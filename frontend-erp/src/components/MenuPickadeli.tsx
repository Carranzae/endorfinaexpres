"use client";

import { useCartStore } from "@/store/cartStore";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/axios";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId?: string;
  imageUrl?: string;
}

interface Category {
  id: string;
  name: string;
}

const DEMO_PRODUCTS: Product[] = [
  { id: "1", name: "LOMO SALTADO", categoryId: "FONDOS", price: 24.9, description: "Clásico wok peruano con lomo de res, tomate y papas fritas.", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC32PEJIkLDpoLRCf0yZI9PiENzEEuqFeA8wsizC0Eu3-N3PMtNqcIfyOER8Log6hO6oQ39WIcPJC5FEwU5V7HEZN45GZ9Fic1gc_LQCcYQopCHZ5pjespV2BEjOlBfxFwhjlMMy0D9TL8ZzO1P6DSV5-7Iz7_XL0aa1gYnwNAejJa7XkxRKXC0W-WyR1eqllKQbkXK-7BF-TweXViJTiN2AVinLKQqNTcqAoA7W_b-CQDb92BWL6YZr5ysPJUMPZF7bQHxS2oJ7Wo" },
  { id: "2", name: "AJÍ DE GALLINA", categoryId: "FONDOS", price: 21.0, description: "Cremosa salsa de ají amarillo con pollo desmenuzado.", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkI9nL4SSPS3Ra_gAruqQ8DTfsNL7eQGlt7JRqgZYcyyta_BT1-4yYkmorKnOruKrKyKFX2OykKoXkb0Mf4fXCrVYk3EN8dNhUR92Q1dmQ7kfEBdvnjB2h30wI_aWpPV6IwpYA3byklrMYi5jHDI7UZBwEOhHhOTDbf2kgEmAYW7WGQL3NQtILBGJgnokPGT8THZPyhlaUQlKKodYtcWsJRaCWmruRhdgQ8uOm_N35jRXmaSMHmBuQpbxikd3RwJPUxWUpw5UVB_Y" },
  { id: "3", name: "ARROZ CON POLLO", categoryId: "FONDOS", price: 19.5, description: "Arroz verde con culantro, pollo tierno y ensalada criolla.", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4bbwq9l34foDBS9piUP1qgJqxKvFwag2U_77ah6wzT1J57UqTBShz8zuioa9D3NJi_pW7yJHljXsiZ1kOg6Tw-NUw6_LmZLqFr1mCaATnRuGNjT-OZ7bqu8oi7vArhV9EDtuN9geBR7uJItS06sxog-wSaSA0XP26sbbzkE8GKPcqBF1iT2DdCtiilNFqA61CE2Pm9Yfa3Tq7Op6beEFXlN7vbhtn6dzwSbA7iePpAkaKnIln5TOb1ixWYvSpEFxfBeLIVOsQEjU" },
  { id: "4", name: "TALLARINES ROJOS", categoryId: "PASTAS", price: 18.0, description: "Pasta en salsa criolla de tomate con carne molida.", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAl3Xo7UDkASog_gcNVz8JAXYY28VFKQSWaIXqxlYoCOpgd_Bjj9zY6GzdB9y3vavopkCNB_eEej5NH-u1CuZhMtkHPZXxLgE8tFzuFVIfi_44MoGBZXBtpgj3AhhDSXRDoMGEqFtG2Nu1wXBRYqG_qnQOyPgLcsB8rbqbas5VXZ8J7bsFaf3tidnwvH-9dKMua_JOpLS7fVlOTt132UUvWcXbRRPifLQueQIUa6GN7J-4addq_HKaO3Rfu5sI1FBz1SdjbMWVQ4f0" },
];

export default function MenuPickadeli() {
  const { addItem } = useCartStore();
  const [adding, setAdding] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/products").catch(() => ({ data: [] })),
      api.get("/categories").catch(() => ({ data: [] })),
    ]).then(([pRes, cRes]) => {
      const apiProducts = Array.isArray(pRes.data) ? pRes.data : [];
      const apiCategories = Array.isArray(cRes.data) ? cRes.data : [];
      setProducts(apiProducts.length > 0 ? apiProducts : DEMO_PRODUCTS);
      setCategories(apiCategories.length > 0 ? apiCategories : [
        { id: "FONDOS", name: "FONDOS" },
        { id: "PASTAS", name: "PASTAS" },
      ]);
    }).finally(() => setLoading(false));
  }, []);

  const handleAdd = useCallback((product: Product) => {
    setAdding(product.id);
    addItem(product);
    setTimeout(() => setAdding(null), 600);
  }, [addItem]);

  // Group products by category
  const grouped = categories.map(cat => ({
    category: cat,
    products: products.filter(p => p.categoryId === cat.id),
  })).filter(g => g.products.length > 0);

  if (loading) {
    return (
      <div id="menu" className="w-full bg-[#FDF9F6] py-16 lg:py-24">
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-[#E6FF00] border-t-[#111] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div id="menu" className="w-full bg-[#FDF9F6] py-16 lg:py-24">
      {grouped.map(({ category, products: catProducts }) => (
        <section key={category.id} className="max-w-7xl mx-auto px-6 lg:px-12 mb-20 last:mb-0">
          {/* Massive Heading */}
          <h2 className="text-5xl lg:text-[80px] text-center uppercase tracking-tighter mb-12 text-[#111]" style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700 }}>
            {category.name}
          </h2>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {catProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-[10px] overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform border border-gray-100/50" style={{ boxShadow: "0px 10px 25px -5px rgba(0,0,0,0.05)" }}>
                
                {/* Top: Image container */}
                <div className="w-full h-56 bg-[#f4f3f1] p-6 flex justify-center items-center relative">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <span className="material-symbols-outlined text-7xl text-gray-300">dinner_dining</span>
                  )}
                </div>

                {/* Bottom: Text & Button */}
                <div className="p-5 lg:p-6 flex flex-col flex-1 bg-white">
                  <h3 className="text-xl lg:text-2xl uppercase tracking-tight text-[#111] mb-1" style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700 }}>
                    {p.name}
                  </h3>
                  <p className="text-sm text-gray-400 font-medium mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
                    {p.description || "Sabor clásico peruano."}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-bold text-xl lg:text-2xl text-[#111]" style={{ fontFamily: "Oswald, sans-serif" }}>
                      S/ {Number(p.price).toFixed(2)}
                    </span>
                    
                    <button 
                      onClick={() => handleAdd(p)}
                      className={`w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full transition-colors ${
                        adding === p.id ? "bg-[#22C55E] text-white" : "bg-[#E6FF00] hover:bg-[#d4eb00] text-[#111]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl lg:text-2xl">
                        {adding === p.id ? "check" : "add"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {grouped.length === 0 && !loading && (
        <div className="text-center py-20 text-gray-400">
          <span className="text-6xl">🍽️</span>
          <p className="mt-4 text-xl" style={{ fontFamily: "Oswald, sans-serif" }}>
            CARTA EN PREPARACIÓN
          </p>
        </div>
      )}
    </div>
  );
}
