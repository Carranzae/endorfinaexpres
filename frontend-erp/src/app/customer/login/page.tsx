"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { ArrowLeft } from "lucide-react";

const BG_BEIGE = "#e3d2be";
const ACCENT_ORANGE = "#f97316";

export default function CustomerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", {
        email: email,
        password: phone, // phone is used as password for customers
      });
      
      // We can store token if needed, or if we have a robust store, we use it.
      // But let's assume we store it in localStorage for this customer flow
      localStorage.setItem("customerToken", data.access_token);
      localStorage.setItem("customerData", JSON.stringify(data.user));
      
      router.push("/customer/points");
    } catch (err: any) {
      setError("Credenciales incorrectas. Verifica tu correo y celular.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Inter:wght@400;600;700;800;900&display=swap');

        body {
          margin: 0;
          font-family: 'Inter', sans-serif;
          background-color: ${BG_BEIGE};
          color: #111;
        }

        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background-image: radial-gradient(rgba(0,0,0,0.05) 2px, transparent 2px);
          background-size: 20px 20px;
        }

        .login-box {
          background: #fff;
          border: 4px solid #111;
          border-radius: 12px;
          padding: 40px;
          width: 100%;
          max-width: 450px;
          box-shadow: 12px 12px 0px #111;
          position: relative;
        }

        .btn-back {
          position: absolute;
          top: -24px;
          left: -24px;
          background: ${ACCENT_ORANGE};
          border: 3px solid #111;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #111;
          box-shadow: 4px 4px 0px #111;
          transition: transform 0.1s;
        }
        .btn-back:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0px #111; }
        .btn-back:active { transform: translate(2px, 2px); box-shadow: 0px 0px 0px #111; }

        .brand {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }
        .brand-icon {
          font-size: 32px;
          background: ${ACCENT_ORANGE};
          border: 3px solid #111;
          border-radius: 8px;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 4px 4px 0px #111;
        }

        .title {
          font-family: 'Oswald', sans-serif;
          font-size: 36px;
          font-weight: 700;
          text-align: center;
          text-transform: uppercase;
          margin: 0 0 8px;
          line-height: 1.1;
        }
        
        .subtitle {
          text-align: center;
          font-size: 14px;
          color: #555;
          margin: 0 0 32px;
          font-weight: 600;
        }

        .error-message {
          background: #ffcccc;
          border: 2px solid red;
          color: red;
          padding: 12px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 24px;
        }
        .label {
          display: block;
          font-family: 'Oswald', sans-serif;
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .input {
          width: 100%;
          padding: 14px 16px;
          border: 3px solid #111;
          border-radius: 8px;
          font-size: 16px;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          outline: none;
          transition: box-shadow 0.1s;
        }
        .input:focus {
          box-shadow: 4px 4px 0px ${ACCENT_ORANGE};
        }

        .btn-submit {
          width: 100%;
          background: #111;
          color: #fff;
          border: none;
          padding: 16px;
          border-radius: 8px;
          font-family: 'Oswald', sans-serif;
          font-size: 20px;
          font-weight: 700;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.1s;
          margin-top: 8px;
          box-shadow: 4px 4px 0px #888;
        }
        .btn-submit:hover:not(:disabled) {
          background: #333;
        }
        .btn-submit:active:not(:disabled) {
          transform: translate(2px, 2px);
          box-shadow: 0px 0px 0px #111;
        }
        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .signup-link {
          text-align: center;
          margin-top: 24px;
          font-size: 14px;
          font-weight: 600;
        }
        .signup-link span {
          color: ${ACCENT_ORANGE};
          font-weight: 800;
          text-decoration: underline;
          cursor: pointer;
        }
      `}</style>

      <div className="login-box">
        <button className="btn-back" onClick={() => router.push("/")} title="Volver al inicio">
          <ArrowLeft size={24} strokeWidth={3} />
        </button>

        <div className="brand">
          <div className="brand-icon">🍽️</div>
        </div>
        
        <h1 className="title">MI CUENTA</h1>
        <p className="subtitle">Ingresa para ver tus puntos y recompensas.</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="label">Correo Electrónico</label>
            <input 
              type="email" 
              className="input" 
              placeholder="tu@correo.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label className="label">Celular (Contraseña)</label>
            <input 
              type="tel" 
              className="input" 
              placeholder="999 999 999" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "VERIFICANDO..." : "INGRESAR"}
          </button>
        </form>

        <div className="signup-link">
          ¿Aún no eres parte del Club? <br/>
          <span onClick={() => router.push("/")}>Regístrate en inicio</span>
        </div>
      </div>
    </div>
  );
}
