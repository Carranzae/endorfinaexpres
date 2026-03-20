"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import {
    Sparkles, Star, Heart, Gift, Clock, Users, ArrowRight, Coffee,
    ShoppingBag, Calendar, ArrowLeft, Check, Search, Plus, Minus,
    X, MapPin, Phone, Send, ExternalLink, MessageCircle, Truck,
} from "lucide-react";

/* ===== TYPES ===== */
type FlowStep = "welcome" | "customer-info" | "table-select" | "menu" | "cart" | "checkout";
type OrderType = "DINE_IN" | "TAKEAWAY" | "DELIVERY";

interface CartItem { id: string; name: string; price: number; quantity: number; imageUrl?: string; }

/* ===== MAIN COMPONENT ===== */
export default function QRCustomerFlowPage() {
    const params = useParams();
    const router = useRouter();
    const token = params.token as string;
    const [step, setStep] = useState<FlowStep>("welcome");
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [orderType, setOrderType] = useState<OrderType>("DINE_IN");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [deliveryNotes, setDeliveryNotes] = useState("");

    useEffect(() => {
        if (!token) { setError("Token no válido"); setLoading(false); return; }
        api.get(`/qr-sessions/validate/${token}`)
            .then(({ data }) => {
                if (!data || (data.status !== "active" && data.status !== "ACTIVE")) { setError("El código QR no existe o ha expirado"); }
                else if (new Date(data.expiresAt) < new Date()) { setError("El código QR ha expirado. Solicita uno nuevo."); }
                else setSession(data);
            })
            .catch(() => setError("Error validando el código QR"))
            .finally(() => setLoading(false));
    }, [token]);

    const addToCart = (p: any) => setCart(prev => { const ex = prev.find(i => i.id === p.id); return ex ? prev.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i) : [...prev, { id: p.id, name: p.name, price: Number(p.price), quantity: 1, imageUrl: p.imageUrl }]; });
    const removeFromCart = (id: string) => setCart(prev => { const ex = prev.find(i => i.id === id); return ex && ex.quantity > 1 ? prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i) : prev.filter(i => i.id !== id); });
    const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

    if (loading) return <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ textAlign: "center", color: "#fff" }}><div style={{ width: 48, height: 48, border: "3px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} /><p>Validando sesión...</p><style jsx>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div></div>;
    if (error || !session) return <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #ef4444, #dc2626)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}><div style={{ textAlign: "center", color: "#fff", maxWidth: 400 }}><div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div><h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Error de Sesión</h1><p style={{ marginBottom: 24, opacity: 0.9 }}>{error || "Sesión no válida"}</p><button onClick={() => router.push("/")} style={{ padding: "12px 28px", background: "#fff", color: "#ef4444", borderRadius: 12, fontWeight: 700, border: "none", cursor: "pointer" }}>Volver al inicio</button></div></div>;

    switch (step) {
        case "welcome": return <WelcomeScreen onContinue={() => setStep("customer-info")} />;
        case "customer-info": return <CustomerInfoScreen onBack={() => setStep("welcome")} onSubmit={(name, phone, type) => { setCustomerName(name); setCustomerPhone(phone); setOrderType(type); setStep(type === "DINE_IN" && !session.tableId ? "table-select" : "menu"); }} />;
        case "table-select": return <TableSelectScreen onBack={() => setStep("customer-info")} onSelect={(id) => { session.tableId = id; setStep("menu"); }} />;
        case "menu": return <MenuScreen cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} cartTotal={cartTotal} cartCount={cartCount} customerName={customerName} onBack={() => setStep("customer-info")} onGoToCart={() => setStep("cart")} />;
        case "cart": return <CartScreen cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} cartTotal={cartTotal} onBack={() => setStep("menu")} onCheckout={() => setStep("checkout")} />;
        case "checkout": return <CheckoutScreen cart={cart} cartTotal={cartTotal} customerName={customerName} customerPhone={customerPhone} orderType={orderType} deliveryAddress={deliveryAddress} setDeliveryAddress={setDeliveryAddress} deliveryNotes={deliveryNotes} setDeliveryNotes={setDeliveryNotes} onBack={() => setStep("cart")} sessionId={session.id} tableId={session.tableId} />;
    }
}

/* ===== 1. WELCOME ===== */
function WelcomeScreen({ onContinue }: { onContinue: () => void }) {
    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f97316, #ea580c, #dc2626)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, textAlign: "center", color: "#fff", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "20%", left: "10%", width: 200, height: 200, background: "rgba(255,255,255,0.1)", borderRadius: "50%", filter: "blur(60px)" }} />
            <div style={{ position: "absolute", bottom: "20%", right: "10%", width: 250, height: 250, background: "rgba(255,200,0,0.15)", borderRadius: "50%", filter: "blur(80px)" }} />

            <div style={{ position: "relative", zIndex: 10, maxWidth: 480 }}>
                <div style={{ width: 120, height: 120, borderRadius: 28, background: "rgba(255,255,255,0.2)", backdropFilter: "blur(12px)", border: "3px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
                    <span style={{ fontSize: 56 }}>☕</span>
                </div>
                <h1 style={{ fontSize: 48, fontWeight: 900, margin: 0, letterSpacing: -1 }}>ENDORFINA</h1>
                <p style={{ fontSize: 28, fontWeight: 700, margin: "4px 0 16px", opacity: 0.9 }}>EXPRESS</p>
                <p style={{ fontSize: 18, opacity: 0.85, marginBottom: 32, lineHeight: 1.5 }}>Masas artesanales · Sabores explosivos · Experiencia única</p>

                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 32 }}>
                    {["☕ Café Premium", "🍕 Masas Artesanales", "🎁 Rewards", "⚡ Express"].map((t, i) => (
                        <span key={i} style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", padding: "8px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, border: "1px solid rgba(255,255,255,0.25)" }}>{t}</span>
                    ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 36 }}>
                    {[{ icon: "⭐", title: "ÚNICOS", sub: "Sabores inigualables" }, { icon: "⏱", title: "RÁPIDO", sub: "Express delivery" }, { icon: "🐾", title: "PET FRIENDLY", sub: "Trae a tu mascota" }, { icon: "🎁", title: "REWARDS", sub: "Acumula puntos" }].map((f, i) => (
                        <div key={i} style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", borderRadius: 16, padding: 16, border: "1px solid rgba(255,255,255,0.2)" }}>
                            <span style={{ fontSize: 28 }}>{f.icon}</span>
                            <p style={{ fontSize: 12, fontWeight: 800, margin: "6px 0 2px" }}>{f.title}</p>
                            <p style={{ fontSize: 11, opacity: 0.7 }}>{f.sub}</p>
                        </div>
                    ))}
                </div>

                <button onClick={onContinue} style={{ background: "rgba(255,255,255,0.95)", color: "#ea580c", border: "none", borderRadius: 16, padding: "16px 48px", fontSize: 18, fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 30px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: 10, margin: "0 auto" }}>
                    VER CARTA <ArrowRight style={{ width: 20, height: 20 }} />
                </button>
            </div>
        </div>
    );
}

/* ===== 2. CUSTOMER INFO ===== */
function CustomerInfoScreen({ onBack, onSubmit }: { onBack: () => void; onSubmit: (name: string, phone: string, type: OrderType) => void }) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [type, setType] = useState<OrderType>("DINE_IN");
    const options: { value: OrderType; label: string; desc: string; icon: string }[] = [
        { value: "DINE_IN", label: "Comer en el local", desc: "Disfruta en nuestro restaurante", icon: "🍽️" },
        { value: "TAKEAWAY", label: "Para llevar", desc: "Recoge tu pedido", icon: "🛍️" },
        { value: "DELIVERY", label: "Delivery", desc: "Lo llevamos a tu puerta", icon: "🛵" },
    ];

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #7c3aed, #6d28d9)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ width: "100%", maxWidth: 440, background: "#fff", borderRadius: 24, boxShadow: "0 25px 60px rgba(0,0,0,0.2)", overflow: "hidden" }}>
                <div style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", padding: "24px 28px", textAlign: "center", color: "#fff", position: "relative" }}>
                    <button onClick={onBack} style={{ position: "absolute", left: 16, top: 16, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ArrowLeft style={{ width: 18, height: 18 }} /></button>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", fontSize: 24 }}>👤</div>
                    <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Información Personal</h2>
                    <p style={{ fontSize: 13, opacity: 0.8, margin: "4px 0 0" }}>Cuéntanos un poco sobre ti ✨</p>
                </div>
                <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                    <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>NOMBRE COMPLETO</label><input value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" required style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "2px solid #e8eaf0", fontSize: 14, outline: "none" }} /></div>
                    <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>TELÉFONO</label><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="999 999 999" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "2px solid #e8eaf0", fontSize: 14, outline: "none" }} /></div>
                    <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 10 }}>¿QUÉ DESEAS HACER?</label>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {options.map(o => (
                                <button key={o.value} type="button" onClick={() => setType(o.value)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 14, border: type === o.value ? "2px solid #7c3aed" : "2px solid #e8eaf0", background: type === o.value ? "#ede9fe" : "#fff", cursor: "pointer", textAlign: "left" }}>
                                    <span style={{ fontSize: 24 }}>{o.icon}</span>
                                    <div><p style={{ fontSize: 14, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>{o.label}</p><p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{o.desc}</p></div>
                                    {type === o.value && <Check style={{ width: 18, height: 18, color: "#7c3aed", marginLeft: "auto" }} />}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                        <button onClick={onBack} style={{ flex: 1, padding: "14px", borderRadius: 12, border: "2px solid #e8eaf0", background: "#fff", fontWeight: 600, cursor: "pointer", color: "#64748b" }}>Atrás</button>
                        <button onClick={() => name.trim() && onSubmit(name.trim(), phone.trim(), type)} disabled={!name.trim()} style={{ flex: 1, padding: "14px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "#fff", fontWeight: 700, cursor: "pointer", opacity: name.trim() ? 1 : 0.5 }}>Continuar →</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ===== 3. TABLE SELECT ===== */
function TableSelectScreen({ onBack, onSelect }: { onBack: () => void; onSelect: (id: string) => void }) {
    const [tables, setTables] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => { api.get("/tables").then(({ data }) => { setTables((Array.isArray(data) ? data : []).filter((t: any) => t.status === "AVAILABLE")); setLoading(false); }).catch(() => setLoading(false)); }, []);

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #7c3aed, #6d28d9)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ width: "100%", maxWidth: 500, background: "#fff", borderRadius: 24, boxShadow: "0 25px 60px rgba(0,0,0,0.2)", overflow: "hidden" }}>
                <div style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", padding: "24px 28px", textAlign: "center", color: "#fff", position: "relative" }}>
                    <button onClick={onBack} style={{ position: "absolute", left: 16, top: 16, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ArrowLeft style={{ width: 18, height: 18 }} /></button>
                    <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Selecciona tu Mesa</h2>
                </div>
                <div style={{ padding: 24 }}>
                    {loading ? <div style={{ textAlign: "center", padding: 40 }}>Cargando...</div> : tables.length === 0 ? <p style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>No hay mesas disponibles</p> : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                            {tables.map((t: any) => (
                                <button key={t.id} onClick={() => onSelect(t.id)} style={{ padding: 20, background: "#f0fdf4", border: "2px solid #bbf7d0", borderRadius: 16, cursor: "pointer", textAlign: "center" }}>
                                    <p style={{ fontSize: 24, fontWeight: 800, color: "#1e1b4b", margin: 0 }}>{t.number}</p>
                                    <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{t.capacity} pers.</p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ===== 4. MENU ===== */
function MenuScreen({ cart, addToCart, removeFromCart, cartTotal, cartCount, customerName, onBack, onGoToCart }: any) {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [activeCat, setActiveCat] = useState("all");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => { Promise.all([api.get("/products").catch(() => ({ data: [] })), api.get("/categories").catch(() => ({ data: [] }))]).then(([p, c]) => { setProducts(Array.isArray(p.data) ? p.data : []); setCategories(Array.isArray(c.data) ? c.data : []); }).finally(() => setLoading(false)); }, []);

    const filtered = products.filter(p => (activeCat === "all" || p.categoryId === activeCat) && (!search || p.name?.toLowerCase().includes(search.toLowerCase())));

    return (
        <div style={{ minHeight: "100vh", background: "#f5f6fa" }}>
            {/* Header */}
            <div style={{ position: "sticky", top: 0, zIndex: 40, background: "#fff", borderBottom: "1px solid #e8eaf0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ maxWidth: 700, margin: "0 auto", padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <button onClick={onBack} style={{ width: 34, height: 34, borderRadius: 10, background: "#f5f6fa", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ArrowLeft style={{ width: 16, height: 16, color: "#64748b" }} /></button>
                            <div><h1 style={{ fontSize: 16, fontWeight: 800, color: "#1e1b4b", margin: 0 }}>Endorfina Express</h1><p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>Hola, {customerName} 👋</p></div>
                        </div>
                        <button onClick={onGoToCart} style={{ position: "relative", width: 40, height: 40, borderRadius: 12, background: "#ede9fe", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <ShoppingBag style={{ width: 18, height: 18, color: "#7c3aed" }} />
                            {cartCount > 0 && <span style={{ position: "absolute", top: -4, right: -4, width: 20, height: 20, borderRadius: "50%", background: "#f97316", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
                        </button>
                    </div>
                    <div style={{ position: "relative" }}><Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#94a3b8" }} /><input placeholder="Buscar platos..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", padding: "10px 10px 10px 38px", borderRadius: 10, border: "1.5px solid #e8eaf0", fontSize: 13, outline: "none", background: "#f8f9fb" }} /></div>
                    <div style={{ display: "flex", gap: 8, marginTop: 10, overflowX: "auto", paddingBottom: 4 }}>
                        <button onClick={() => setActiveCat("all")} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", whiteSpace: "nowrap", background: activeCat === "all" ? "#7c3aed" : "#f5f6fa", color: activeCat === "all" ? "#fff" : "#64748b" }}>Todos</button>
                        {categories.map((c: any) => <button key={c.id} onClick={() => setActiveCat(c.id)} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", whiteSpace: "nowrap", background: activeCat === c.id ? "#7c3aed" : "#f5f6fa", color: activeCat === c.id ? "#fff" : "#64748b" }}>{c.name}</button>)}
                    </div>
                </div>
            </div>

            {/* Products */}
            <div style={{ maxWidth: 700, margin: "0 auto", padding: 16 }}>
                {loading ? <div style={{ textAlign: "center", padding: 60 }}>Cargando...</div> : filtered.length === 0 ? <p style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>No se encontraron productos</p> : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                        {filtered.map((p: any) => { const inCart = cart.find((i: CartItem) => i.id === p.id); return (
                            <div key={p.id} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #e8eaf0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                                <div style={{ height: 140, background: "#f8f9fb", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                                    {p.imageUrl ? <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 40 }}>🍽️</span>}
                                    <span style={{ position: "absolute", bottom: 8, left: 8, background: "#7c3aed", color: "#fff", padding: "3px 10px", borderRadius: 8, fontSize: 13, fontWeight: 800 }}>S/ {Number(p.price).toFixed(2)}</span>
                                </div>
                                <div style={{ padding: 12 }}>
                                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>{p.name}</h3>
                                    {p.description && <p style={{ fontSize: 11, color: "#94a3b8", margin: "4px 0 0", lineHeight: 1.3 }}>{p.description}</p>}
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginTop: 10 }}>
                                        {inCart ? (
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <button onClick={() => removeFromCart(p.id)} style={{ width: 28, height: 28, borderRadius: 8, background: "#f5f6fa", border: "1px solid #e8eaf0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Minus style={{ width: 14, height: 14, color: "#64748b" }} /></button>
                                                <span style={{ fontSize: 14, fontWeight: 700, color: "#1e1b4b", width: 16, textAlign: "center" }}>{inCart.quantity}</span>
                                                <button onClick={() => addToCart(p)} style={{ width: 28, height: 28, borderRadius: 8, background: "#7c3aed", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Plus style={{ width: 14, height: 14, color: "#fff" }} /></button>
                                            </div>
                                        ) : (
                                            <button onClick={() => addToCart(p)} style={{ width: 34, height: 34, borderRadius: 10, background: "#f97316", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(249,115,22,0.3)" }}><Plus style={{ width: 16, height: 16, color: "#fff" }} /></button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ); })}
                    </div>
                )}
            </div>

            {/* FAB */}
            {cartCount > 0 && (
                <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 50 }}>
                    <button onClick={onGoToCart} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 28px", background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "#fff", borderRadius: 16, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14, boxShadow: "0 8px 30px rgba(124,58,237,0.4)" }}>
                        <ShoppingBag style={{ width: 18, height: 18 }} /> Ver Carrito ({cartCount}) · S/ {cartTotal.toFixed(2)}
                    </button>
                </div>
            )}
        </div>
    );
}

/* ===== 5. CART ===== */
function CartScreen({ cart, addToCart, removeFromCart, cartTotal, onBack, onCheckout }: any) {
    return (
        <div style={{ minHeight: "100vh", background: "#f5f6fa" }}>
            <div style={{ maxWidth: 500, margin: "0 auto", padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 10, background: "#fff", border: "1px solid #e8eaf0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ArrowLeft style={{ width: 16, height: 16, color: "#64748b" }} /></button>
                    <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e1b4b", margin: 0 }}>Tu Pedido 🛒</h1>
                </div>

                {cart.length === 0 ? (
                    <div style={{ background: "#fff", borderRadius: 20, padding: 48, textAlign: "center" }}>
                        <span style={{ fontSize: 48 }}>🛒</span>
                        <p style={{ fontSize: 16, fontWeight: 600, color: "#1e1b4b", marginTop: 12 }}>Tu carrito está vacío</p>
                        <button onClick={onBack} style={{ marginTop: 16, padding: "10px 24px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 12, fontWeight: 600, cursor: "pointer" }}>Ver Menú</button>
                    </div>
                ) : (
                    <>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                            {cart.map((item: CartItem) => (
                                <div key={item.id} style={{ background: "#fff", borderRadius: 14, padding: 14, display: "flex", alignItems: "center", gap: 12, border: "1px solid #e8eaf0" }}>
                                    <div style={{ width: 50, height: 50, borderRadius: 10, background: "#f8f9fb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>🍽️</div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: 14, fontWeight: 600, color: "#1e1b4b", margin: 0 }}>{item.name}</p>
                                        <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>S/ {item.price.toFixed(2)} c/u</p>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <button onClick={() => removeFromCart(item.id)} style={{ width: 28, height: 28, borderRadius: 8, background: "#f5f6fa", border: "1px solid #e8eaf0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Minus style={{ width: 12, height: 12, color: "#64748b" }} /></button>
                                        <span style={{ fontSize: 14, fontWeight: 700, width: 16, textAlign: "center", color: "#1e1b4b" }}>{item.quantity}</span>
                                        <button onClick={() => addToCart(item)} style={{ width: 28, height: 28, borderRadius: 8, background: "#7c3aed", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Plus style={{ width: 12, height: 12, color: "#fff" }} /></button>
                                    </div>
                                    <p style={{ fontSize: 14, fontWeight: 700, color: "#1e1b4b", width: 60, textAlign: "right" }}>S/ {(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #e8eaf0", marginBottom: 16 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: 15, color: "#64748b" }}>Total del pedido</span>
                                <span style={{ fontSize: 28, fontWeight: 800, color: "#7c3aed" }}>S/ {cartTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button onClick={onCheckout} style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                            Continuar al Checkout <ArrowRight style={{ width: 18, height: 18 }} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

/* ===== 6. CHECKOUT — WhatsApp + PedidosYa ===== */
function CheckoutScreen({ cart, cartTotal, customerName, customerPhone, orderType, deliveryAddress, setDeliveryAddress, deliveryNotes, setDeliveryNotes, onBack, sessionId, tableId }: any) {
    const [sent, setSent] = useState(false);

    const buildWhatsAppMessage = () => {
        let msg = `🛒 *NUEVO PEDIDO — ENDORFINA EXPRESS*\n\n`;
        msg += `👤 *Cliente:* ${customerName}\n`;
        if (customerPhone) msg += `📱 *Teléfono:* ${customerPhone}\n`;
        msg += `📍 *Tipo:* ${orderType === "DINE_IN" ? "Comer en local" : orderType === "TAKEAWAY" ? "Para llevar" : "Delivery"}\n`;
        if (orderType === "DELIVERY" && deliveryAddress) msg += `🏠 *Dirección:* ${deliveryAddress}\n`;
        if (deliveryNotes) msg += `📝 *Notas:* ${deliveryNotes}\n`;
        msg += `\n━━━━━━━━━━━━━━━━━━\n`;
        msg += `📋 *DETALLE DEL PEDIDO:*\n\n`;
        cart.forEach((item: CartItem) => {
            msg += `  • ${item.quantity}x ${item.name} — S/ ${(item.price * item.quantity).toFixed(2)}\n`;
        });
        msg += `\n━━━━━━━━━━━━━━━━━━\n`;
        msg += `💰 *TOTAL: S/ ${cartTotal.toFixed(2)}*\n\n`;
        msg += `✨ ¡Gracias por tu pedido!`;
        return msg;
    };

    const sendWhatsApp = () => {
        const whatsappNumber = "51999999999"; // TODO: read from settings
        const msg = encodeURIComponent(buildWhatsAppMessage());
        window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, "_blank");
        setSent(true);
        // Also save to backend
        api.post("/orders", {
            qrSessionId: sessionId, tableId: tableId || undefined, customerName, orderType,
            items: cart.map((i: CartItem) => ({ productId: i.id, quantity: i.quantity, unitPrice: i.price })),
            total: cartTotal, notes: deliveryNotes || undefined,
        }).catch(console.error);
    };

    const openPedidosYa = () => {
        window.open("https://www.pedidosya.com.pe", "_blank"); // TODO: read from settings
    };

    if (sent) {
        return (
            <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, textAlign: "center", color: "#fff" }}>
                <div style={{ maxWidth: 400 }}>
                    <span style={{ fontSize: 72 }}>🎉</span>
                    <h1 style={{ fontSize: 28, fontWeight: 800, margin: "16px 0 8px" }}>¡Pedido Enviado!</h1>
                    <p style={{ fontSize: 16, opacity: 0.9, marginBottom: 8 }}>{customerName}</p>
                    <p style={{ fontSize: 14, opacity: 0.7, marginBottom: 24 }}>Tu pedido ha sido enviado por WhatsApp. ¡Pronto estará listo!</p>
                    <div style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", borderRadius: 16, padding: 20, marginBottom: 24 }}>
                        <p style={{ fontSize: 13, opacity: 0.8 }}>Total</p>
                        <p style={{ fontSize: 36, fontWeight: 800 }}>S/ {cartTotal.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "#f5f6fa" }}>
            <div style={{ maxWidth: 500, margin: "0 auto", padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 10, background: "#fff", border: "1px solid #e8eaf0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ArrowLeft style={{ width: 16, height: 16, color: "#64748b" }} /></button>
                    <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e1b4b", margin: 0 }}>Confirmar Pedido</h1>
                </div>

                {/* Order Summary */}
                <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #e8eaf0", marginBottom: 16 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e1b4b", marginBottom: 12 }}>📋 Resumen del Pedido</h3>
                    {cart.map((item: CartItem) => (
                        <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, color: "#64748b" }}>
                            <span>{item.quantity}x {item.name}</span>
                            <span style={{ fontWeight: 600, color: "#1e1b4b" }}>S/ {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div style={{ borderTop: "2px solid #e8eaf0", marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: "#1e1b4b" }}>Total</span>
                        <span style={{ fontSize: 22, fontWeight: 800, color: "#7c3aed" }}>S/ {cartTotal.toFixed(2)}</span>
                    </div>
                </div>

                {/* Delivery Form */}
                {orderType === "DELIVERY" && (
                    <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #e8eaf0", marginBottom: 16 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e1b4b", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}><Truck style={{ width: 16, height: 16, color: "#f97316" }} /> Datos de Delivery</h3>
                        <div style={{ marginBottom: 12 }}><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>DIRECCIÓN DE ENTREGA</label><input value={deliveryAddress} onChange={(e: any) => setDeliveryAddress(e.target.value)} placeholder="Av. Principal 123, Lima" style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e8eaf0", fontSize: 14, outline: "none" }} /></div>
                        <div><label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>NOTAS ADICIONALES</label><textarea value={deliveryNotes} onChange={(e: any) => setDeliveryNotes(e.target.value)} placeholder="Instrucciones especiales..." style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e8eaf0", fontSize: 14, outline: "none", minHeight: 60, resize: "vertical" }} /></div>
                    </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                    <button onClick={sendWhatsApp} style={{ width: "100%", padding: "16px 24px", background: "#25D366", color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "0 4px 16px rgba(37,211,102,0.3)" }}>
                        <MessageCircle style={{ width: 22, height: 22 }} /> Enviar Pedido por WhatsApp
                    </button>
                    <button onClick={openPedidosYa} style={{ width: "100%", padding: "14px 24px", background: "#FF1744", color: "#fff", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "0 4px 16px rgba(255,23,68,0.3)" }}>
                        <ExternalLink style={{ width: 18, height: 18 }} /> Pedir por PedidosYa
                    </button>
                </div>

                <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8" }}>✨ Tu pedido también se registrará en nuestro sistema</p>
            </div>
        </div>
    );
}
