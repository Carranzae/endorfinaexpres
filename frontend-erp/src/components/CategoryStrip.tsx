"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

interface Category {
  id: string;
  name: string;
}

const FALLBACK_CATEGORIES = [
  "FONDOS", "PASTAS", "ENSALADAS", "WRAPS", "POSTRES", "BEBIDAS", "COMBOS"
];

export default function CategoryStrip() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api.get("/categories")
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        setCategories(data);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const displayCategories = categories.length > 0
    ? categories.map(c => ({ id: c.id, name: c.name }))
    : FALLBACK_CATEGORIES.map(name => ({ id: name.toLowerCase(), name }));

  return (
    <div className="sticky top-[73px] lg:top-[85px] z-40 w-full bg-[#E6FF00] border-b border-[#111]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex overflow-x-auto no-scrollbar py-3 lg:py-4 gap-8 lg:gap-14 items-center justify-between lg:justify-center">
          {displayCategories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.name.toLowerCase()}`}
              className="text-[#111] font-bold text-sm lg:text-base tracking-widest whitespace-nowrap hover:text-gray-600 transition-colors uppercase"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              {cat.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
