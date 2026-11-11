"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, Mail, ShieldAlert } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/admin");
    }
  }, [user, loading, router]);

  const mapAuthError = (errCode?: string) => {
    switch (errCode) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Credenciales incorrectas. Verifica el correo y la contraseña.";
      case "auth/invalid-email":
        return "El formato del correo electrónico no es válido.";
      case "auth/user-disabled":
        return "Esta cuenta ha sido inhabilitada.";
      case "auth/too-many-requests":
        return "Demasiados intentos fallidos. Intenta nuevamente en unos minutos.";
      case "auth/operation-not-allowed":
        return "El método de autenticación no está habilitado.";
      default:
        return "Error al iniciar sesión. Verifica tus credenciales y conexión.";
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push("/admin");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(mapAuthError(err.code));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-4 text-white relative">
      {/* Back button */}
      <div className="w-full max-w-sm mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Volver al portafolio
        </Link>
      </div>

      <div className="max-w-sm w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-8 relative">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 mb-4 shadow-sm">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Panel de Administración
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestión interna de contenidos del portafolio
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-3 rounded-xl mb-5 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ejemplo.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs"
                required
                disabled={submitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs"
                required
                disabled={submitting}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none text-xs"
          >
            {submitting ? "Accediendo..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
