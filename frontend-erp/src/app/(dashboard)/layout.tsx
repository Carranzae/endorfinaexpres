"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import {
    LayoutDashboard, ShoppingCart, Users, QrCode, UtensilsCrossed, Package,
    Tag, FileText, UserCheck, Shield, Gift, Mail, Settings, LogOut, ChefHat,
    Activity, Menu, X, Image, Megaphone,
} from "lucide-react";

// Dynamic import for routes prefetcher
const CriticalRoutesPrefetcher = dynamic(() => import("@/components/CriticalRoutesPrefetcher"), {
  ssr: false,
});

const MENU_ITEMS = [
    { id: "dashboard", label: "Dashboard", href: "/pos", icon: LayoutDashboard, roles: ["ADMINISTRATOR", "CASHIER"] },
    { id: "system", label: "Estado Sistema", href: "/pos/system", icon: Activity, roles: ["ADMINISTRATOR"] },
    { id: "orders", label: "Pedidos", href: "/pos/orders", icon: ShoppingCart, roles: ["ADMINISTRATOR", "CASHIER", "WAITER"] },
    { id: "waiter", label: "Tablet Mesero", href: "/pos/waiter", icon: UtensilsCrossed, roles: ["ADMINISTRATOR", "WAITER"] },
    { id: "kds", label: "Cocina KDS", href: "/kds", icon: ChefHat, roles: ["ADMINISTRATOR", "KITCHEN"] },
    { id: "tables", label: "Mesas", href: "/pos/tables", icon: Users, roles: ["ADMINISTRATOR", "CASHIER", "WAITER"] },
    { id: "qr", label: "Códigos QR", href: "/pos/qr", icon: QrCode, roles: ["ADMINISTRATOR"] },
    { id: "menu", label: "Menú", href: "/pos/menu", icon: UtensilsCrossed, roles: ["ADMINISTRATOR"] },
    { id: "inventory", label: "Inventario", href: "/pos/inventory", icon: Package, roles: ["ADMINISTRATOR"] },
    { id: "categories", label: "Categorías", href: "/pos/categories", icon: Tag, roles: ["ADMINISTRATOR"] },
    { id: "billing", label: "Facturación", href: "/pos/billing", icon: FileText, roles: ["ADMINISTRATOR", "CASHIER"] },
    { id: "users", label: "Gestión Usuarios", href: "/pos/users", icon: Users, roles: ["ADMINISTRATOR"] },
    { id: "attendance", label: "Asistencias", href: "/pos/attendance", icon: UserCheck, roles: ["ADMINISTRATOR"] },
    { id: "security", label: "Seguridad", href: "/pos/security", icon: Shield, roles: ["ADMINISTRATOR"] },
    { id: "rewards", label: "Rewards", href: "/pos/rewards", icon: Gift, roles: ["ADMINISTRATOR"] },
    { id: "newsletter", label: "Newsletter", href: "/pos/newsletter", icon: Mail, roles: ["ADMINISTRATOR"] },
    { id: "promotions", label: "Promociones", href: "/pos/promotions", icon: Megaphone, roles: ["ADMINISTRATOR"] },
    { id: "banners", label: "Banners", href: "/pos/banners", icon: Image, roles: ["ADMINISTRATOR"] },
    { id: "settings", label: "Configuración", href: "/pos/settings", icon: Settings, roles: ["ADMINISTRATOR"] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, isLoading, profile, logout, checkSession } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => { checkSession(); }, [checkSession]);
    useEffect(() => { if (!isLoading && !isAuthenticated) router.push("/"); }, [isLoading, isAuthenticated, router]);
    useEffect(() => { setSidebarOpen(false); }, [pathname]); // Close sidebar on navigate

    if (isLoading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f6fa" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ width: 44, height: 44, border: "3px solid #ede9fe", borderTopColor: "#7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
                    <p style={{ color: "#94a3b8", fontSize: 14 }}>Cargando sistema...</p>
                    <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    const userRole = profile?.role || "CUSTOMER";
    const visibleItems = MENU_ITEMS.filter((item) => item.roles.includes(userRole));
    const handleLogout = () => { logout(); router.push("/"); };

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}>☕</div>
                    <div>
                        <h1 style={{ fontSize: 16, fontWeight: 700, color: "#fff", lineHeight: 1.2, margin: 0 }}>Endorfina Express</h1>
                        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: 0, marginTop: 2 }}>Sistema de Gestión</p>
                    </div>
                </div>
            </div>
            {/* Navigation */}
            <nav style={{ flex: 1, overflowY: "auto", padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
                {visibleItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/pos" && pathname.startsWith(item.href + "/"));
                    const exactActive = pathname === item.href;
                    const active = item.id === "dashboard" ? exactActive : isActive;
                    return (
                        <Link key={item.id} href={item.href} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: active ? 600 : 500, color: active ? "#fff" : "rgba(255,255,255,0.65)", background: active ? "rgba(255,255,255,0.18)" : "transparent", textDecoration: "none", transition: "all 0.2s", backdropFilter: active ? "blur(4px)" : "none" }}>
                            <item.icon style={{ width: 18, height: 18, opacity: active ? 1 : 0.7 }} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
            {/* User Section */}
            <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", marginBottom: 6 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700 }}>{profile?.fullName?.charAt(0).toUpperCase() || "U"}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: "#fff", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile?.fullName || "Usuario"}</p>
                        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile?.role || ""}</p>
                    </div>
                </div>
                <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 10, fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.06)", border: "none", cursor: "pointer", transition: "all 0.2s" }}>
                    <LogOut style={{ width: 15, height: 15 }} /> Cerrar Sesión
                </button>
            </div>
        </>
    );

    return (
        <div style={{ display: "flex", height: "100vh", background: "#f5f6fa" }}>
            <CriticalRoutesPrefetcher />
            {/* ===== DESKTOP SIDEBAR ===== */}
            <aside className="desktop-sidebar" style={{
                width: 240, display: "flex", flexDirection: "column",
                background: "linear-gradient(180deg, #7c3aed 0%, #6d28d9 45%, #5b21b6 100%)",
                boxShadow: "4px 0 24px rgba(91, 33, 182, 0.15)", position: "relative", zIndex: 20,
            }}>
                <SidebarContent />
            </aside>

            {/* ===== MOBILE OVERLAY ===== */}
            {sidebarOpen && (
                <div className="mobile-overlay" style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex" }}>
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} onClick={() => setSidebarOpen(false)} />
                    <aside style={{
                        width: 260, display: "flex", flexDirection: "column", position: "relative", zIndex: 10,
                        background: "linear-gradient(180deg, #7c3aed 0%, #6d28d9 45%, #5b21b6 100%)",
                        boxShadow: "4px 0 24px rgba(91, 33, 182, 0.3)",
                    }}>
                        <button onClick={() => setSidebarOpen(false)} style={{ position: "absolute", right: -44, top: 12, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <X style={{ width: 18, height: 18, color: "#64748b" }} />
                        </button>
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* ===== MAIN CONTENT ===== */}
            <main style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
                {/* Mobile Header */}
                <div className="mobile-header" style={{ display: "none", alignItems: "center", gap: 12, padding: "12px 16px", background: "#fff", borderBottom: "1px solid #e8eaf0" }}>
                    <button onClick={() => setSidebarOpen(true)} style={{ width: 38, height: 38, borderRadius: 10, background: "#ede9fe", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Menu style={{ width: 18, height: 18, color: "#7c3aed" }} />
                    </button>
                    <h1 style={{ fontSize: 16, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>☕ Endorfina Express</h1>
                </div>
                <div style={{ padding: 28, minHeight: "100%", flex: 1 }}>
                    {children}
                </div>
            </main>

            {/* Responsive CSS */}
            <style jsx global>{`
                @media (max-width: 768px) {
                    .desktop-sidebar { display: none !important; }
                    .mobile-header { display: flex !important; }
                }
                @media (min-width: 769px) {
                    .mobile-overlay { display: none !important; }
                }
            `}</style>
        </div>
    );
}
