"use client";

import type React from "react";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
    });

    if (result?.error) {
      setIsLoading(false);
      toast.error("Erreur de connexion", {
        description: "Email ou mot de passe incorrect.",
      });
    } else {
      toast.success("Connexion réussie", {
        description: "Bienvenue ! Redirection en cours...",
      });

      // If there's a callback URL, use it
      if (callbackUrl) {
        router.push(callbackUrl);
        return;
      }

      // Fetch the session to get user role
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      // Redirect based on role
      if (session?.user?.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/account/tickets");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg py-12 px-4">
      <div className="w-full max-w-xl space-y-8">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.06)] px-8 py-10 space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src="/logo/logo-green.svg"
              alt="Fanzone Tickets"
              width={139}
              height={103}
              priority
            />
          </div>

          {/* Header */}
          <div className="text-center space-y-1">
            <h1 className="text-xl font-semibold text-black">
              Connectez-vous à votre compte
            </h1>
            <p className="text-sm text-gris2">
              Entrez vos identifiants pour accéder à votre espace
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gris2" />
              <input
                type="email"
                placeholder="Adresse mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-gris4 bg-bg text-sm text-black placeholder:text-gris2 focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gris2" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-12 pl-12 pr-12 rounded-xl border border-gris4 bg-bg text-sm text-black placeholder:text-gris2 focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gris2 hover:text-black transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-red hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-green hover:bg-green/90 text-white font-medium rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          {/* Register link */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gris2">
              Vous n&apos;avez pas encore de compte ?
            </p>
            <Link
              href="/auth/register"
              className="text-sm font-medium text-green hover:underline"
            >
              Créer mon compte
            </Link>
          </div>
        </div>

        {/* Social login */}
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gris4" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-bg text-gris2">Ou continuez avec</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 h-12 bg-white border border-gris4 rounded-xl text-sm font-medium text-black hover:bg-gray-50 transition-colors">
              <Image
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                width={20}
                height={20}
              />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 h-12 bg-white border border-gris4 rounded-xl text-sm font-medium text-black hover:bg-gray-50 transition-colors">
              <svg
                className="h-5 w-5 text-[#1877F2]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-bg">
          <Loader2 className="h-8 w-8 animate-spin text-green" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
