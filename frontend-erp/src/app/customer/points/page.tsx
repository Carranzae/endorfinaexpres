"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Star, Gift } from "lucide-react";

const BG_BEIGE = "#e3d2be";
const ACCENT_ORANGE = "#f97316";

export default function CustomerPointsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("customerData");
    if (!data) {
      router.push("/customer/login");
      return;
    }
    setUser(JSON.parse(data));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customerData");
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="points-container">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Inter:wght@400;600;700;800;900&display=swap');

        body {
          margin: 0;
          font-family: 'Inter', sans-serif;
          background-color: ${BG_BEIGE};
          color: #111;
        }

        .points-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Navbar */
        .navbar {
          background-color: ${BG_BEIGE};
          padding: 16px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 3px solid #111;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }
        
        .nav-brand-box {
          background: ${ACCENT_ORANGE};
          color: white;
          padding: 8px;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          line-height: 1;
          border: 2px solid #111;
        }
        .nav-brand-icon { font-size: 20px; margin-bottom: 4px; }
        .nav-brand-text { font-size: 8px; font-weight: 800; letter-spacing: 1px; }

        .btn-logout {
          background: #fff;
          color: #111;
          border: 3px solid #111;
          border-radius: 6px;
          padding: 8px 16px;
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 4px 4px 0px #111;
          transition: all 0.1s;
        }
        .btn-logout:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0px #111; }
        .btn-logout:active { transform: translate(2px, 2px); box-shadow: 0px 0px 0px #111; }

        /* Dashboard */
        .dashboard {
          padding: 60px 20px;
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
          flex: 1;
        }

        .welcome-title {
          font-family: 'Oswald', sans-serif;
          font-size: 48px;
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 8px;
          line-height: 1.1;
        }

        .welcome-subtitle {
          font-size: 16px;
          color: #444;
          font-weight: 600;
          margin: 0 0 40px;
        }

        .points-card {
          background: ${ACCENT_ORANGE};
          border: 4px solid #111;
          border-radius: 16px;
          padding: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow: 12px 12px 0px #111;
          background-image: radial-gradient(rgba(0,0,0,0.1) 2px, transparent 2px);
          background-size: 20px 20px;
        }

        .points-icon {
          background: #fff;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 4px solid #111;
          margin-bottom: 24px;
        }

        .points-number {
          font-family: 'Oswald', sans-serif;
          font-size: 80px;
          font-weight: 700;
          color: #fff;
          line-height: 1;
          text-shadow: 4px 4px 0px #111;
          margin: 0;
        }

        .points-label {
          font-size: 20px;
          font-weight: 900;
          color: #111;
          text-transform: uppercase;
          margin: 8px 0 0;
          background: #fff;
          padding: 4px 16px;
          border: 3px solid #111;
          border-radius: 8px;
        }

        .rewards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-top: 40px;
        }

        .reward-card {
          background: #fff;
          border: 4px solid #111;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 6px 6px 0px #111;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .reward-icon {
          font-size: 32px;
        }

        .reward-info h4 {
          font-family: 'Oswald', sans-serif;
          font-size: 20px;
          margin: 0 0 4px;
          text-transform: uppercase;
        }
        .reward-info p {
          font-size: 14px;
          color: #555;
          margin: 0;
          font-weight: 600;
        }

        @media (max-width: 600px) {
          .rewards-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Navbar */}
      <header className="navbar">
        <div className="nav-brand" onClick={() => router.push("/")}>
          <div className="nav-brand-box">
            <span className="nav-brand-icon">🍽️</span>
            <span className="nav-brand-text">ENDORFINA</span>
            <span className="nav-brand-text">EXPRESS</span>
          </div>
        </div>
        
        <button className="btn-logout" onClick={handleLogout}>
          <LogOut size={16} strokeWidth={3} /> SALIR
        </button>
      </header>

      <main className="dashboard">
        <h1 className="welcome-title">¡HOLA, {user.fullName.split(" ")[0]}!</h1>
        <p className="welcome-subtitle">Bienvenido al Club Endorfina. Aquí están tus recompensas.</p>

        <div className="points-card">
          <div className="points-icon">
            <Star size={40} className="text-black" strokeWidth={3} fill="#facc15" />
          </div>
          <h2 className="points-number">{user.points || 0}</h2>
          <div className="points-label">PUNTOS ACUMULADOS</div>
        </div>

        <div className="rewards-grid">
          <div className="reward-card">
            <div className="reward-icon">🍔</div>
            <div className="reward-info">
              <h4>HAMBURGUESA GRATIS</h4>
              <p>Canjeable con 150 puntos</p>
            </div>
          </div>
          <div className="reward-card">
            <div className="reward-icon">🥤</div>
            <div className="reward-info">
              <h4>BEBIDA AGRANDADA</h4>
              <p>Canjeable con 50 puntos</p>
            </div>
          </div>
        </div>

      </main>

    </div>
  );
}
