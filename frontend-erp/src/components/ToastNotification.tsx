"use client";

import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

interface ToastProps {
  message: string;
  visible: boolean;
  onDone: () => void;
}

export default function ToastNotification({ message, visible, onDone }: ToastProps) {
  const [animClass, setAnimClass] = useState("");

  useEffect(() => {
    if (visible) {
      setAnimClass("toast-enter");
      const timer = setTimeout(() => {
        setAnimClass("toast-exit");
        setTimeout(onDone, 300);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [visible, onDone]);

  if (!visible && !animClass) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 bg-zinc-900 text-white px-5 py-4 rounded-2xl shadow-xl ${animClass}`}
      style={{ border: "2px solid #DE7645" }}
    >
      <CheckCircle size={20} className="text-green-400 shrink-0" />
      <span className="font-bold text-sm">{message}</span>
    </div>
  );
}
