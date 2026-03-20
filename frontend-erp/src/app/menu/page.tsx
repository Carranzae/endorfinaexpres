"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/axios";
import { Search, ShoppingBag, Plus, Minus, X, ArrowLeft, MessageCircle, ExternalLink, ArrowRight, Send } from "lucide-react";
import { useRouter } from "next/navigation";

interface Product { id: string; name: string; description?: string; price: number; imageUrl?: string; categoryId?: string; }
interface CartItem extends Product { quantity: number; }
interface Category { id: string; name: string; }

const CAT_COLORS = ["#5bcbf5", "#eef316", "#86efac", "#fcd3b6", "#5bcbf5", "#fcd3b6", "#eef316"];

export default function DigitalMenuPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeCat, setActiveCat] = useState("all");
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showCart, setShowCart] = useState(false);
    const [loading, setLoading] = useState(true);
    const [cartMsg, setCartMsg] = useState("");
    const [sending, setSending] = useState(false);
    const [confetti, setConfetti] = useState(false);

    const CART_MSGS = ["¡Falta poco!", "¡Tu pedido está casi listo!", "¡Buena elección!", "¡Ñam ñam! 🤤", "¡Excelente gusto!"];
    const showCartMessage = useCallback((msg?: string) => {
        setCartMsg(msg || CART_MSGS[Math.floor(Math.random() * CART_MSGS.length)]);
        setTimeout(() => setCartMsg(""), 2200);
    }, []);

    const launchConfetti = () => {
        setConfetti(true);
        setTimeout(() => setConfetti(false), 3000);
    };

    useEffect(() => {
        Promise.all([api.get("/products").catch(() => ({ data: [] })), api.get("/categories").catch(() => ({ data: [] }))])
            .then(([p, c]) => { setProducts(Array.isArray(p.data) ? p.data : []); setCategories(Array.isArray(c.data) ? c.data : []); })
            .finally(() => setLoading(false));
    }, []);

    const filtered = products.filter(p => (activeCat === "all" || p.categoryId === activeCat) && (!search || p.name.toLowerCase().includes(search.toLowerCase())));
    const addToCart = (p: Product) => { setCart(prev => { const ex = prev.find(i => i.id === p.id); return ex ? prev.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i) : [...prev, { ...p, quantity: 1 }]; }); showCartMessage(); };
    const removeFromCart = (id: string) => setCart(prev => { const ex = prev.find(i => i.id === id); return ex && ex.quantity > 1 ? prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i) : prev.filter(i => i.id !== id); });
    const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

    const sendOrder = async () => {
        if (cart.length === 0 || sending) return;
        setSending(true);
        try {
            // Dual action: POST to system + open WA
            const items = cart.map(i => ({ productId: i.id, quantity: i.quantity, notes: "" }));
            await api.post("/orders", { items, type: "DELIVERY", notes: "Pedido desde menú digital" }).catch(() => {});

            let msg = `🛒 *PEDIDO — ENDORFINA EXPRESS*\n\n📋 *DETALLE:*\n`;
            cart.forEach(i => { msg += `  • ${i.quantity}x ${i.name} — S/ ${(i.price * i.quantity).toFixed(2)}\n`; });
            msg += `\n💰 *TOTAL: S/ ${cartTotal.toFixed(2)}*\n\n✨ Pedido desde menú digital`;
            window.open(`https://wa.me/51994466800?text=${encodeURIComponent(msg)}`, "_blank");

            launchConfetti();
            setCart([]);
            setShowCart(false);
            showCartMessage("¡Pedido enviado! 🎉");
        } catch { alert("Error al enviar pedido"); } finally { setSending(false); }
    };

    return (
        <div style={{ minHeight: "100vh", background: "#fffaf0", fontFamily: "'Inter', sans-serif" }}>
            <style jsx global>{`
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap');
              .cat-box { transition: transform 0.2s; cursor: pointer; }
              .cat-box:hover { transform: scale(1.02); }
              .plate-img { animation: float-plate 6s ease-in-out infinite; }
              @keyframes float-plate { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
              @keyframes cart-msg-in { 0% { opacity: 0; transform: translateY(20px) scale(0.8); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
              @keyframes cart-msg-out { 0% { opacity: 1; transform: translateY(0) scale(1); } 100% { opacity: 0; transform: translateY(-20px) scale(0.8); } }
              @keyframes confetti-fall { 0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
              .confetti-piece { position: fixed; top: -10px; z-index: 9999; pointer-events: none; animation: confetti-fall 3s ease-out forwards; }
            `}</style>
            
            {/* Header Pickadeli Style */}
            <div style={{ position: "sticky", top: 0, zIndex: 40, background: "#fffaf0", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "2px solid #000" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                        <ArrowLeft style={{ width: 24, height: 24, color: "#000" }} />
                    </button>
                    <h1 style={{ fontSize: 24, fontWeight: 900, color: "#000", margin: 0, letterSpacing: -1 }}>ENDORFINA</h1>
                </div>
                <button onClick={() => setShowCart(true)} style={{ position: "relative", padding: "8px 16px", borderRadius: 8, background: "#000", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontWeight: 800 }}>
                    <ShoppingBag style={{ width: 18, height: 18 }} /> CART
                    {cartCount > 0 && <span style={{ position: "absolute", top: -8, right: -8, width: 24, height: 24, borderRadius: "50%", background: "#facc15", color: "#000", fontSize: 12, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #000" }}>{cartCount}</span>}
                </button>
            </div>

            <div style={{ maxWidth: 1000, margin: "0 auto", padding: "20px" }}>
                {/* Search Bar */}
                <div style={{ position: "relative", marginBottom: 24, maxWidth: 600, margin: "0 auto 30px" }}>
                    <Search style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 20, height: 20, color: "#000" }} />
                    <input placeholder="¿Qué vas a pedir hoy?" value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", padding: "16px 16px 16px 48px", borderRadius: 12, border: "2px solid #000", fontSize: 16, fontWeight: 600, outline: "none", background: "#fff", boxShadow: "4px 4px 0px #000" }} />
                </div>

                {/* Categories Grid (Pickadeli Style) */}
                {!search && activeCat === "all" && categories.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20, marginBottom: 40 }}>
                        {categories.map((c, i) => (
                            <div key={c.id} className="cat-box" onClick={() => setActiveCat(c.id)} style={{ background: CAT_COLORS[i % CAT_COLORS.length], border: "2px solid #000", borderRadius: 16, padding: "24px 16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 180, boxShadow: "4px 4px 0px #000" }}>
                                <h3 style={{ fontSize: 22, fontWeight: 900, color: "#000", textAlign: "center", textTransform: "uppercase", margin: "0 0 16px", lineHeight: 1.1 }}>{c.name}</h3>
                                <div style={{ width: 100, height: 100, borderRadius: "50%", background: "rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }} className="plate-img">🍽️</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Active Category Header */}
                {activeCat !== "all" && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, borderBottom: "3px solid #000", paddingBottom: 10 }}>
                        <h2 style={{ fontSize: 32, fontWeight: 900, color: "#000", textTransform: "uppercase", margin: 0 }}>
                            {categories.find(c => c.id === activeCat)?.name || "Resultados"}
                        </h2>
                        <button onClick={() => setActiveCat("all")} style={{ background: "none", border: "none", fontSize: 14, fontWeight: 800, textDecoration: "underline", cursor: "pointer", color: "#000" }}>VER TODO</button>
                    </div>
                )}

                {/* Products Grid */}
                {loading ? <div style={{ textAlign: "center", padding: 60, fontWeight: 800 }}>Cargando carta...</div> : filtered.length === 0 ? <p style={{ textAlign: "center", padding: 60, fontWeight: 800 }}>No hay productos</p> : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
                        {filtered.map(p => { const inCart = cart.find(i => i.id === p.id); return (
                            <div key={p.id} style={{ background: "#fff", borderRadius: 20, overflow: "hidden", border: "2px solid #000", display: "flex", flexDirection: "column", boxShadow: "4px 4px 0px #000" }}>
                                <div style={{ height: 200, background: "#f5f6fa", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", borderBottom: "2px solid #000" }}>
                                    {p.imageUrl ? <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 60 }}>🍔</span>}
                                    <div style={{ position: "absolute", top: 12, right: 12, background: "#facc15", color: "#000", padding: "6px 14px", borderRadius: 20, fontSize: 16, fontWeight: 900, border: "2px solid #000" }}>S/ {Number(p.price).toFixed(2)}</div>
                                </div>
                                <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column" }}>
                                    <h3 style={{ fontSize: 18, fontWeight: 900, color: "#000", margin: "0 0 8px", textTransform: "uppercase" }}>{p.name}</h3>
                                    <p style={{ fontSize: 13, color: "#333", margin: "0 0 20px", lineHeight: 1.4, flex: 1, fontWeight: 600 }}>{p.description || "Delicioso producto de la casa reparado con los mejores ingredientes."}</p>
                                    
                                    {inCart ? (
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f5f6fa", border: "2px solid #000", borderRadius: 12, padding: "4px" }}>
                                            <button onClick={() => removeFromCart(p.id)} style={{ width: 40, height: 40, borderRadius: 8, background: "#fff", border: "2px solid #000", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Minus style={{ width: 16, height: 16, color: "#000" }} /></button>
                                            <span style={{ fontSize: 18, fontWeight: 900, color: "#000" }}>{inCart.quantity}</span>
                                            <button onClick={() => addToCart(p)} style={{ width: 40, height: 40, borderRadius: 8, background: "#facc15", border: "2px solid #000", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Plus style={{ width: 16, height: 16, color: "#000" }} /></button>
                                        </div>
                                    ) : (
                                        <button onClick={() => addToCart(p)} style={{ width: "100%", padding: "14px", borderRadius: 12, background: "#000", color: "#fff", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 900, textTransform: "uppercase", transition: "transform 0.1s" }} onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"} onMouseUp={e => e.currentTarget.style.transform = "scale(1)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                                            COMPRAR
                                        </button>
                                    )}
                                </div>
                            </div>
                        ); })}
                    </div>
                )}
            </div>

            {/* Animated Cart Message */}
            {cartMsg && (
                <div style={{ position: "fixed", bottom: 100, left: "50%", transform: "translateX(-50%)", zIndex: 200, background: "#000", color: "#facc15", padding: "14px 28px", borderRadius: 16, fontSize: 18, fontWeight: 900, boxShadow: "0 8px 30px rgba(0,0,0,0.3)", animation: "cart-msg-in 0.3s ease forwards", border: "2px solid #facc15" }}>
                    {cartMsg}
                </div>
            )}

            {/* Confetti */}
            {confetti && Array.from({ length: 50 }).map((_, i) => (
                <div key={i} className="confetti-piece" style={{ left: `${Math.random() * 100}vw`, animationDelay: `${Math.random() * 1.5}s`, animationDuration: `${2 + Math.random() * 2}s`, width: 10, height: 10, borderRadius: Math.random() > 0.5 ? "50%" : "2px", background: ["#facc15", "#f97316", "#22c55e", "#3b82f6", "#ef4444", "#a855f7"][i % 6] }} />
            ))}

            {/* Cart Drawer */}
            {showCart && (
                <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} onClick={() => setShowCart(false)}>
                    <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "100%", maxWidth: 420, background: "#fff", borderLeft: "4px solid #000", display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "2px solid #000", background: "#facc15" }}>
                            <h2 style={{ fontSize: 24, fontWeight: 900, color: "#000", margin: 0, textTransform: "uppercase" }}>🛒 TU PEDIDO</h2>
                            <button onClick={() => setShowCart(false)} style={{ background: "#fff", border: "2px solid #000", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X style={{ width: 20, height: 20, color: "#000" }} /></button>
                        </div>
                        
                        <div style={{ flex: 1, overflow: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                            {cart.length === 0 ? (
                                <div style={{ textAlign: "center", padding: 40, opacity: 0.5 }}>
                                    <ShoppingBag style={{ width: 64, height: 64, margin: "0 auto 16px" }} />
                                    <p style={{ fontSize: 18, fontWeight: 800 }}>Tu carrito está vacío</p>
                                </div>
                            ) : cart.map(item => (
                                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, background: "#fffaf0", borderRadius: 16, border: "2px solid #000" }}>
                                    <div style={{ flex: 1 }}><p style={{ fontSize: 16, fontWeight: 800, color: "#000", margin: "0 0 4px", textTransform: "uppercase" }}>{item.name}</p><p style={{ fontSize: 14, color: "#555", margin: 0, fontWeight: 600 }}>S/ {Number(item.price).toFixed(2)}</p></div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <button onClick={() => removeFromCart(item.id)} style={{ width: 28, height: 28, borderRadius: 6, background: "#fff", border: "2px solid #000", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Minus style={{ width: 14, height: 14, color: "#000" }} /></button>
                                        <span style={{ fontSize: 16, fontWeight: 900, width: 20, textAlign: "center" }}>{item.quantity}</span>
                                        <button onClick={() => addToCart(item)} style={{ width: 28, height: 28, borderRadius: 6, background: "#facc15", border: "2px solid #000", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Plus style={{ width: 14, height: 14, color: "#000" }} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {cart.length > 0 && (
                            <div style={{ padding: 24, borderTop: "2px solid #000", background: "#f5f6fa" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                                    <span style={{ fontSize: 18, fontWeight: 800, color: "#000", textTransform: "uppercase" }}>Total</span>
                                    <span style={{ fontSize: 32, fontWeight: 900, color: "#000" }}>S/ {cartTotal.toFixed(2)}</span>
                                </div>
                                <button onClick={sendOrder} disabled={sending} style={{ width: "100%", padding: "18px", background: "#25D366", color: "#fff", border: "2px solid #000", borderRadius: 12, fontSize: 16, fontWeight: 900, cursor: sending ? "not-allowed" : "pointer", opacity: sending ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12, boxShadow: "4px 4px 0px #000", transition: "transform 0.1s" }} onMouseDown={e => {if(!sending){e.currentTarget.style.transform = "translate(2px, 2px)"; e.currentTarget.style.boxShadow = "2px 2px 0px #000"}}} onMouseUp={e => {e.currentTarget.style.transform = "translate(0, 0)"; e.currentTarget.style.boxShadow = "4px 4px 0px #000"}}>
                                    <Send style={{ width: 20, height: 20 }} /> {sending ? "ENVIANDO..." : "ENVIAR PEDIDO + WHATSAPP"}
                                </button>
                                <button onClick={() => window.open("https://www.pedidosya.com.pe", "_blank")} style={{ width: "100%", padding: "18px", background: "#FF1744", color: "#fff", border: "2px solid #000", borderRadius: 12, fontSize: 16, fontWeight: 900, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "4px 4px 0px #000", transition: "transform 0.1s" }} onMouseDown={e => {e.currentTarget.style.transform = "translate(2px, 2px)"; e.currentTarget.style.boxShadow = "2px 2px 0px #000"}} onMouseUp={e => {e.currentTarget.style.transform = "translate(0, 0)"; e.currentTarget.style.boxShadow = "4px 4px 0px #000"}}>
                                    <ExternalLink style={{ width: 20, height: 20 }} /> PEDIR POR PEDIDOSYA
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
