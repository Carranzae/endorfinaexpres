"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import {
    Gift,
    Star,
    Trophy,
    Award,
    Sparkles,
    TrendingUp,
    ChevronRight,
    LogOut,
} from "lucide-react";

interface Customer {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    points: number;
    totalPointsEarned: number;
    // allow snake_case from backend
    first_name?: string;
    last_name?: string;
    total_points_earned?: number;
}

interface Reward {
    id: string;
    name: string;
    description: string;
    pointsRequired: number;
    points_required?: number;
    isActive: boolean;
}

interface Transaction {
    id: string;
    points: number;
    description: string;
    createdAt: string;
    created_at?: string;
    transactionType: string;
    transaction_type?: string;
}

interface RedemptionTicket {
    code: string;
    customerName: string;
    rewardName: string;
    rewardDescription: string;
    pointsUsed: number;
    date: string;
}

export default function RewardsCustomerPage() {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [catalog, setCatalog] = useState<Reward[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [showLogin, setShowLogin] = useState(true);
    const [ticket, setTicket] = useState<RedemptionTicket | null>(null);

    // Check for existing session
    useEffect(() => {
        const loadSession = async () => {
            try {
                const raw = localStorage.getItem("rewards_customer_session");
                if (!raw) return;
                const { customerId, sessionTimestamp } = JSON.parse(raw);
                if (Date.now() - sessionTimestamp > 24 * 60 * 60 * 1000) {
                    localStorage.removeItem("rewards_customer_session");
                    return;
                }
                const { data } = await api.get(`/rewards/customers/${customerId}`);
                if (!data) { localStorage.removeItem("rewards_customer_session"); return; }
                setCustomer(data);
                setShowLogin(false);
                loadCatalogAndHistory(data.id);
            } catch {
                localStorage.removeItem("rewards_customer_session");
            }
        };
        loadSession();
    }, []);

    const loadCatalogAndHistory = async (customerId: string) => {
        try {
            const [catRes, txRes] = await Promise.all([
                api.get("/rewards/catalog").catch(() => ({ data: [] })),
                api.get(`/rewards/transactions/${customerId}`).catch(() => ({ data: [] })),
            ]);
            setCatalog(Array.isArray(catRes.data) ? catRes.data : []);
            setTransactions(Array.isArray(txRes.data) ? txRes.data : []);
        } catch (e) {
            console.error("Error loading catalog/history", e);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !firstName.trim() || !lastName.trim()) return;
        setLoading(true);
        try {
            // Try to find or create the customer
            const { data } = await api.post("/rewards/customers/login", {
                email: email.trim().toLowerCase(),
                firstName: firstName.trim(),
                lastName: lastName.trim(),
            });
            if (!data) throw new Error("No data returned");

            localStorage.setItem(
                "rewards_customer_session",
                JSON.stringify({ customerId: data.id, sessionTimestamp: Date.now() })
            );
            setCustomer(data);
            setShowLogin(false);
            loadCatalogAndHistory(data.id);
        } catch (e: any) {
            alert(e?.response?.data?.message || "Error al verificar. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("rewards_customer_session");
        setCustomer(null);
        setCatalog([]);
        setTransactions([]);
        setShowLogin(true);
        setEmail("");
        setFirstName("");
        setLastName("");
        setTicket(null);
    };

    const handleRedeem = async (reward: Reward) => {
        if (!customer) return;
        const pts = customer.points;
        const required = reward.pointsRequired || reward.points_required || 0;
        if (pts < required) {
            alert(`Puntos insuficientes. Necesitas ${required} pts; tienes ${pts}.`);
            return;
        }
        try {
            const code = `RWD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            await api.post("/rewards/redeem", {
                customerId: customer.id,
                rewardId: reward.id,
                pointsUsed: required,
                code,
            });
            setCustomer({ ...customer, points: pts - required });
            setTicket({
                code,
                customerName: `${customer.firstName || customer.first_name} ${customer.lastName || customer.last_name}`,
                rewardName: reward.name,
                rewardDescription: reward.description,
                pointsUsed: required,
                date: new Date().toLocaleString("es-PE"),
            });
        } catch (e) {
            console.error("Redeem error", e);
            alert("Error al canjear. Intenta de nuevo.");
        }
    };

    const getName = () => `${customer?.firstName || customer?.first_name || ""} ${customer?.lastName || customer?.last_name || ""}`;
    const getPoints = () => customer?.points || 0;
    const getTotalEarned = () => customer?.totalPointsEarned || customer?.total_points_earned || 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 relative">
            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 15 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 2}s`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-4 py-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="w-24 h-24 mx-auto rounded-2xl bg-white/20 backdrop-blur border-4 border-white/30 flex items-center justify-center mb-4 shadow-2xl">
                        <span className="text-4xl font-black text-white">E</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-lg">PROGRAMA REWARDS</h1>
                    <p className="text-lg text-white/80">Acumula puntos y obtén recompensas increíbles</p>
                </div>

                {showLogin ? (
                    /* ===== LOGIN / REGISTER ===== */
                    <div className="max-w-md mx-auto">
                        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
                            <div className="p-8">
                                <div className="flex justify-center mb-5">
                                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3.5 rounded-full">
                                        <Gift className="w-10 h-10 text-white" />
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-center text-gray-800 mb-1">Accede a tus Recompensas</h2>
                                <p className="text-center text-sm text-gray-500 mb-6">Si es tu primera vez, se creará tu cuenta automáticamente.</p>

                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                                        <input type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none text-gray-800" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">Nombre</label>
                                        <input type="text" placeholder="Tu nombre" value={firstName} onChange={(e) => setFirstName(e.target.value)} required
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none text-gray-800" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">Apellido</label>
                                        <input type="text" placeholder="Tu apellido" value={lastName} onChange={(e) => setLastName(e.target.value)} required
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none text-gray-800" />
                                    </div>
                                    <button type="submit" disabled={loading}
                                        className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl text-lg disabled:opacity-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                        {loading ? "Verificando..." : "Acceder"} <ChevronRight className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ===== REWARDS DASHBOARD ===== */
                    <div className="space-y-6">
                        {/* User header */}
                        <div className="flex items-center justify-between">
                            <div className="text-white">
                                <p className="text-sm opacity-80">Hola,</p>
                                <p className="text-2xl font-bold">{getName()}</p>
                            </div>
                            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-xl border border-white/30 text-sm font-medium hover:bg-white/30">
                                <LogOut className="w-4 h-4" /> Cerrar Sesión
                            </button>
                        </div>

                        {/* Points cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-5 text-white shadow-xl">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold opacity-90">Puntos Actuales</h3>
                                    <Star className="w-6 h-6 opacity-70" />
                                </div>
                                <p className="text-4xl font-black">{getPoints()}</p>
                                <p className="text-xs opacity-70 mt-1">pts disponibles</p>
                            </div>
                            <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-5 text-white shadow-xl">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold opacity-90">Total Acumulado</h3>
                                    <Trophy className="w-6 h-6 opacity-70" />
                                </div>
                                <p className="text-4xl font-black">{getTotalEarned()}</p>
                                <p className="text-xs opacity-70 mt-1">pts ganados</p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-5 text-white shadow-xl">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold opacity-90">Recompensas</h3>
                                    <Award className="w-6 h-6 opacity-70" />
                                </div>
                                <p className="text-4xl font-black">{catalog.length}</p>
                                <p className="text-xs opacity-70 mt-1">disponibles</p>
                            </div>
                        </div>

                        {/* Catalog */}
                        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
                            <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-purple-500" /> Recompensas Disponibles
                            </h2>
                            {catalog.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No hay recompensas disponibles ahora</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {catalog.map((reward) => {
                                        const req = reward.pointsRequired || reward.points_required || 0;
                                        const canRedeem = getPoints() >= req;
                                        return (
                                            <div key={reward.id} className="border-2 border-gray-100 rounded-xl p-4 hover:border-purple-200 hover:shadow-md transition-all">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h3 className="font-bold text-gray-800">{reward.name}</h3>
                                                    <span className="px-2.5 py-1 bg-purple-100 text-purple-600 text-xs font-bold rounded-lg">{req} pts</span>
                                                </div>
                                                <p className="text-sm text-gray-500 mb-4">{reward.description}</p>
                                                <button
                                                    onClick={() => handleRedeem(reward)}
                                                    disabled={!canRedeem}
                                                    className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all active:scale-[0.97] ${canRedeem
                                                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                                                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                        }`}
                                                >
                                                    {canRedeem ? "Canjear ✨" : "Puntos insuficientes"}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* History */}
                        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
                            <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-orange-500" /> Historial de Puntos
                            </h2>
                            {transactions.length === 0 ? (
                                <p className="text-gray-500 text-center py-6 text-sm">Aún no tienes transacciones</p>
                            ) : (
                                <div className="space-y-2">
                                    {transactions.map((tx) => (
                                        <div key={tx.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{tx.description || "Transacción"}</p>
                                                <p className="text-xs text-gray-400">{new Date(tx.createdAt || tx.created_at || "").toLocaleString("es-PE")}</p>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${tx.points > 0 ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
                                                {tx.points > 0 ? "+" : ""}{tx.points} pts
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Redemption Ticket Modal */}
            {ticket && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setTicket(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="text-center mb-6">
                            <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Gift className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">¡Canje Exitoso! 🎉</h2>
                            <p className="text-gray-500 text-sm">Presenta este ticket en el restaurante</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 mb-5 border-2 border-dashed border-purple-200 space-y-3">
                            <div className="text-center">
                                <p className="text-xs text-gray-500">Código de Canje</p>
                                <p className="text-xl font-bold text-purple-600 font-mono tracking-wider">{ticket.code}</p>
                            </div>
                            <div className="border-t border-purple-200 pt-2">
                                <p className="text-xs text-gray-500">Cliente</p>
                                <p className="font-semibold text-gray-800">{ticket.customerName}</p>
                            </div>
                            <div className="border-t border-purple-200 pt-2">
                                <p className="text-xs text-gray-500">Recompensa</p>
                                <p className="font-semibold text-gray-800">{ticket.rewardName}</p>
                                <p className="text-xs text-gray-500">{ticket.rewardDescription}</p>
                            </div>
                            <div className="border-t border-purple-200 pt-2">
                                <p className="text-xs text-gray-500">Puntos Utilizados</p>
                                <p className="font-semibold text-purple-600">{ticket.pointsUsed} pts</p>
                            </div>
                            <div className="border-t border-purple-200 pt-2">
                                <p className="text-xs text-gray-500">Fecha</p>
                                <p className="text-sm text-gray-700">{ticket.date}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <button onClick={() => window.print()} className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl">
                                Imprimir Ticket
                            </button>
                            <button onClick={() => setTicket(null)} className="w-full py-2.5 border-2 border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50">
                                Cerrar
                            </button>
                        </div>
                        <p className="text-[11px] text-gray-400 text-center mt-3">Guarda este código para reclamar tu recompensa</p>
                    </div>
                </div>
            )}
        </div>
    );
}
