"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";

const BG_IMAGE = "data:image/jpeg;base64,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";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, checkSession } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tab, setTab] = useState<"admin" | "worker">("admin");

  useEffect(() => { checkSession(); }, [checkSession]);

  useEffect(() => {
    if (isAuthenticated) {
      const role = useAuthStore.getState().profile?.role;
      if (role === "CUSTOMER") router.push("/menu");
      else if (role === "KITCHEN") router.push("/kds");
      else router.push("/pos");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data.access_token, data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || "Credenciales inválidas");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="login-loading">
        <div className="login-spinner" />
        <p className="login-loading-text">Cargando Endorfina...</p>
        <style jsx>{`
          .login-loading { min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#1a0f00 0%,#2d1810 50%,#0d0906 100%);gap:20px; }
          .login-spinner { width:50px;height:50px;border:3px solid rgba(212,168,83,0.2);border-top-color:#d4a853;border-radius:50%;animation:spin 0.8s linear infinite; }
          .login-loading-text { color:#d4a853;font-size:14px;letter-spacing:3px;text-transform:uppercase;font-weight:300; }
          @keyframes spin { to { transform:rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');

        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        .login-bg {
          position: absolute;
          inset: 0;
          background-image: url('${BG_IMAGE}');
          background-size: cover;
          background-position: center;
          filter: brightness(0.35) saturate(1.2);
        }

        .login-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(15, 8, 0, 0.75) 0%,
            rgba(30, 15, 5, 0.6) 40%,
            rgba(10, 5, 0, 0.8) 100%
          );
        }

        .login-vignette {
          position: absolute;
          inset: 0;
          box-shadow: inset 0 0 200px rgba(0,0,0,0.8);
          pointer-events: none;
        }

        .login-particles {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .login-particles::before,
        .login-particles::after {
          content: '';
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          animation: float 8s ease-in-out infinite;
        }
        .login-particles::before {
          top: -100px;
          right: -50px;
          background: radial-gradient(circle, rgba(212,168,83,0.08) 0%, transparent 70%);
        }
        .login-particles::after {
          bottom: -80px;
          left: -30px;
          background: radial-gradient(circle, rgba(180,134,11,0.06) 0%, transparent 70%);
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -30px) scale(1.1); }
        }

        .login-container {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 480px;
          padding: 20px;
        }

        .login-brand {
          text-align: center;
          margin-bottom: 40px;
        }

        .login-logo {
          width: 90px;
          height: 90px;
          margin: 0 auto 24px;
          border-radius: 24px;
          background: linear-gradient(145deg, #d4a853, #8b6914);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 42px;
          box-shadow:
            0 20px 50px rgba(180,134,11,0.35),
            0 0 80px rgba(212,168,83,0.15),
            inset 0 1px 0 rgba(255,255,255,0.25);
          border: 2px solid rgba(255,215,0,0.2);
          animation: logo-glow 3s ease-in-out infinite;
        }

        @keyframes logo-glow {
          0%, 100% { box-shadow: 0 20px 50px rgba(180,134,11,0.35), 0 0 80px rgba(212,168,83,0.15); }
          50% { box-shadow: 0 20px 60px rgba(180,134,11,0.45), 0 0 100px rgba(212,168,83,0.25); }
        }

        .login-title {
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          font-weight: 700;
          letter-spacing: 6px;
          background: linear-gradient(135deg, #f5d78e, #d4a853, #a67c2e, #d4a853, #f5d78e);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
          margin: 0;
          line-height: 1.2;
        }

        @keyframes shimmer {
          to { background-position: 200% center; }
        }

        .login-subtitle {
          color: rgba(212,168,83,0.5);
          font-size: 11px;
          letter-spacing: 5px;
          text-transform: uppercase;
          margin-top: 8px;
          font-weight: 300;
        }

        .login-card {
          background: rgba(20, 12, 5, 0.65);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border-radius: 28px;
          padding: 40px 36px;
          border: 1px solid rgba(212,168,83,0.15);
          box-shadow:
            0 30px 80px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(212,168,83,0.1);
        }

        .login-tabs {
          display: flex;
          gap: 4px;
          margin-bottom: 32px;
          background: rgba(212,168,83,0.06);
          border-radius: 16px;
          padding: 5px;
          border: 1px solid rgba(212,168,83,0.08);
        }

        .login-tab {
          flex: 1;
          padding: 13px 0;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          letter-spacing: 0.5px;
          background: transparent;
          color: rgba(212,168,83,0.4);
        }
        .login-tab.active {
          background: linear-gradient(145deg, #d4a853, #a67c2e);
          color: #fff;
          box-shadow: 0 6px 20px rgba(180,134,11,0.35);
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        .login-tab:not(.active):hover {
          color: rgba(212,168,83,0.7);
          background: rgba(212,168,83,0.06);
        }

        .login-error {
          margin-bottom: 24px;
          padding: 14px 18px;
          background: rgba(220,53,69,0.1);
          border: 1px solid rgba(220,53,69,0.2);
          border-radius: 14px;
          color: #ff6b6b;
          font-size: 13px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }

        .login-field {
          margin-bottom: 22px;
        }

        .login-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: rgba(212,168,83,0.6);
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .login-input-wrap {
          position: relative;
        }

        .login-input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          opacity: 0.4;
          transition: opacity 0.3s;
          pointer-events: none;
        }

        .login-input-wrap:focus-within .login-input-icon {
          opacity: 0.8;
        }

        .login-input {
          width: 100%;
          padding: 16px 16px 16px 48px;
          background: rgba(212,168,83,0.04);
          border: 1.5px solid rgba(212,168,83,0.12);
          border-radius: 14px;
          font-size: 15px;
          color: #f5d78e;
          outline: none;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
        }
        .login-input::placeholder {
          color: rgba(212,168,83,0.2);
        }
        .login-input:focus {
          border-color: rgba(212,168,83,0.4);
          background: rgba(212,168,83,0.07);
          box-shadow: 0 0 0 4px rgba(212,168,83,0.08);
        }

        .login-toggle-pw {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(212,168,83,0.3);
          font-size: 18px;
          padding: 6px;
          border-radius: 8px;
          transition: all 0.3s;
        }
        .login-toggle-pw:hover {
          color: rgba(212,168,83,0.7);
          background: rgba(212,168,83,0.06);
        }

        .login-submit {
          width: 100%;
          padding: 16px 24px;
          background: linear-gradient(145deg, #d4a853, #a67c2e);
          color: #fff;
          border: none;
          border-radius: 16px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 2px;
          text-transform: uppercase;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow:
            0 10px 30px rgba(180,134,11,0.3),
            inset 0 1px 0 rgba(255,255,255,0.2);
          position: relative;
          overflow: hidden;
          margin-top: 8px;
        }
        .login-submit::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(145deg, rgba(255,255,255,0.1), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .login-submit:hover:not(:disabled)::before {
          opacity: 1;
        }
        .login-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow:
            0 15px 40px rgba(180,134,11,0.4),
            inset 0 1px 0 rgba(255,255,255,0.2);
        }
        .login-submit:active:not(:disabled) {
          transform: translateY(0) scale(0.98);
        }
        .login-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-submit-spinner {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 10px;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .login-footer {
          text-align: center;
          margin-top: 32px;
          color: rgba(212,168,83,0.2);
          font-size: 11px;
          letter-spacing: 2px;
        }

        .login-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 28px 0 0;
        }
        .login-divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(212,168,83,0.15), transparent);
        }
        .login-divider-text {
          font-size: 10px;
          color: rgba(212,168,83,0.3);
          text-transform: uppercase;
          letter-spacing: 2px;
          white-space: nowrap;
        }

        .login-role-hint {
          margin-top: 16px;
          text-align: center;
          font-size: 12px;
          color: rgba(212,168,83,0.25);
          line-height: 1.6;
        }
      `}</style>

      <main className="login-page">
        <div className="login-bg" />
        <div className="login-overlay" />
        <div className="login-vignette" />
        <div className="login-particles" />

        <div className="login-container">
          {/* Brand */}
          <div className="login-brand">
            <div className="login-logo">☕</div>
            <h1 className="login-title">ENDORFINA</h1>
            <p className="login-subtitle">Experiencia Gastronómica</p>
          </div>

          {/* Card */}
          <div className="login-card">
            {/* Tabs */}
            <div className="login-tabs">
              <button
                className={`login-tab ${tab === "admin" ? "active" : ""}`}
                onClick={() => { setTab("admin"); setError(""); }}
              >
                👑 Administrador
              </button>
              <button
                className={`login-tab ${tab === "worker" ? "active" : ""}`}
                onClick={() => { setTab("worker"); setError(""); }}
              >
                🏢 Equipo
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="login-error">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="login-field">
                <label className="login-label" htmlFor="email">
                  Correo Electrónico
                </label>
                <div className="login-input-wrap">
                  <span className="login-input-icon">✉</span>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="correo@endorfina.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="login-input"
                  />
                </div>
              </div>

              <div className="login-field">
                <label className="login-label" htmlFor="password">
                  Contraseña
                </label>
                <div className="login-input-wrap">
                  <span className="login-input-icon">🔒</span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                    style={{ paddingRight: 52 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="login-toggle-pw"
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="login-submit"
              >
                {isSubmitting ? (
                  <><span className="login-submit-spinner" /> Verificando...</>
                ) : (
                  "Ingresar al Sistema"
                )}
              </button>
            </form>

            {/* Role hint */}
            <div className="login-divider">
              <div className="login-divider-line" />
              <span className="login-divider-text">
                {tab === "admin" ? "Acceso Gerencial" : "Acceso Operativo"}
              </span>
              <div className="login-divider-line" />
            </div>
            <p className="login-role-hint">
              {tab === "admin"
                ? "Ingresa con tu cuenta de administrador para acceso completo al sistema."
                : "Cajeros, meseros y cocina. Contacta a tu administrador si no tienes acceso."
              }
            </p>
          </div>

          {/* Footer */}
          <p className="login-footer">
            © 2026 ENDORFINA EXPRESS · v2.0
          </p>
        </div>
      </main>
    </>
  );
}
