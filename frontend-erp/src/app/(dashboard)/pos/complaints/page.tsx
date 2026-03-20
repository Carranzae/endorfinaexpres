"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { MessageSquareWarning } from "lucide-react";

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await api.get("/complaints");
      setComplaints(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/complaints/${id}/status`, { status });
      fetchComplaints(); // refresh
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  if (loading) return <div style={{ padding: 20 }}>Cargando reclamos...</div>;

  return (
    <div style={{ padding: "24px 40px", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "#f97316", padding: 8, borderRadius: 8, display: "flex" }}>
           <MessageSquareWarning color="white" />
        </div>
        <h1 style={{ margin: 0, fontFamily: "Oswald, sans-serif", fontSize: 24, textTransform: "uppercase" }}>
          Reclamos y Sugerencias de Clientes
        </h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {complaints.length === 0 ? (
          <p>No hay reclamos registrados.</p>
        ) : (
          complaints.map(complaint => (
            <div key={complaint.id} style={{
              background: "#fff",
              border: "2px solid #e5e7eb",
              borderRadius: 12,
              padding: 24,
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                 <div>
                    <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700 }}>{complaint.name}</h3>
                    <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>Tel: {complaint.phone} {complaint.email && `| Correo: ${complaint.email}`}</p>
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "#9ca3af" }}>
                       {new Date(complaint.createdAt).toLocaleString()}
                    </p>
                 </div>
                 <select 
                   value={complaint.status} 
                   onChange={(e) => updateStatus(complaint.id, e.target.value)}
                   style={{
                     padding: "6px 12px",
                     borderRadius: 6,
                     border: "1px solid #d1d5db",
                     fontSize: 12,
                     fontWeight: 600,
                     backgroundColor: complaint.status === 'PENDING' ? '#fee2e2' : complaint.status === 'RESOLVED' ? '#dcfce7' : '#fef3c7',
                     color: complaint.status === 'PENDING' ? '#991b1b' : complaint.status === 'RESOLVED' ? '#166534' : '#92400e',
                     outline: "none",
                     cursor: "pointer"
                   }}
                 >
                    <option value="PENDING">Pendiente</option>
                    <option value="REVIEWING">En Revisión</option>
                    <option value="RESOLVED">Resuelto</option>
                 </select>
              </div>
              <div style={{ background: "#f3f4f6", padding: 16, borderRadius: 8, fontSize: 14 }}>
                <strong>Detalle:</strong><br/>
                {complaint.issue}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
