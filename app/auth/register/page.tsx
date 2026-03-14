"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { isValidCameroonPhone } from "@/lib/sanitize";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  Phone,
  CircleUserRound,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account/tickets";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast.error("Erreur", {
        description: "Veuillez remplir tous les champs",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Erreur", {
        description: "Les mots de passe ne correspondent pas",
      });
      return;
    }

    if (phone && !isValidCameroonPhone(phone)) {
      toast.error("Erreur", {
        description:
          "Numéro de téléphone invalide. Format attendu : 6XXXXXXXX ou +237 6XXXXXXXX",
      });
      return;
    }

    if (!acceptTerms) {
      toast.error("Erreur", {
        description: "Vous devez accepter les conditions d'utilisation",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          address,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'inscription");
      }

      // Auto-login après inscription
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        // Inscription réussie mais connexion échouée, rediriger vers login
        toast.success("Inscription réussie", {
          description: "Votre compte a été créé. Veuillez vous connecter.",
        });
        router.push("/auth/login");
        return;
      }

      toast.success("Bienvenue !", {
        description:
          "Votre compte a été créé et vous êtes maintenant connecté.",
      });

      router.push(callbackUrl);
    } catch (error: any) {
      toast.error("Erreur d'inscription", {
        description:
          error.message || "Une erreur est survenue lors de l'inscription",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full h-12 pl-12 pr-4 rounded-xl border border-gris4 bg-bg text-sm text-black placeholder:text-gris2 focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors";

  const iconClass =
    "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gris2";

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
              Créer mon compte
            </h1>
            <p className="text-sm text-gris2">
              Créer un compte pour acheter des billet et gérer mes évènements
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom & Prénom */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <CircleUserRound className={iconClass} />
                <input
                  type="text"
                  placeholder="Nom"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div className="relative">
                <CircleUserRound className={iconClass} />
                <input
                  type="text"
                  placeholder="Prénom"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* Téléphone */}
            <div className="relative">
              <Phone className={iconClass} />
              <input
                type="tel"
                placeholder="Ex: +237 6XX XXX XXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
              />
              {phone && !isValidCameroonPhone(phone) && (
                <p className="text-red text-xs mt-1">
                  Format invalide. Ex: 6XXXXXXXX ou +237 6XXXXXXXX
                </p>
              )}
            </div>

            {/* Quartier */}
            <div className="relative">
              <MapPin className={iconClass} />
              <input
                type="text"
                placeholder="Quartier (ex: Bonamoussadi)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className={iconClass} />
              <input
                type="email"
                placeholder="Adresse mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            {/* Mot de passe */}
            <div className="relative">
              <Lock className={iconClass} />
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

            {/* Confirmer mot de passe */}
            <div className="relative">
              <Lock className={iconClass} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmer mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full h-12 pl-12 pr-12 rounded-xl border border-gris4 bg-bg text-sm text-black placeholder:text-gris2 focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gris2 hover:text-black transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* CGU */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gris4 text-green focus:ring-green accent-green cursor-pointer"
              />
              <label
                htmlFor="terms"
                className="text-sm text-black leading-relaxed cursor-pointer"
              >
                J&apos;ai lu et j&apos;accepte les{" "}
                <Link href="/terms" className="text-green hover:underline">
                  Conditions Générales d&apos;Utilisation
                </Link>{" "}
                et la{" "}
                <Link href="/privacy" className="text-green hover:underline">
                  Politique de Confidentialité
                </Link>{" "}
                de la plateforme
              </label>
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
                  Inscription en cours...
                </>
              ) : (
                "S'inscrire"
              )}
            </button>
          </form>

          {/* Login link */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gris2">Vous avez déjà un compte ?</p>
            <Link
              href="/auth/login"
              className="text-sm font-medium text-green hover:underline"
            >
              Me connecter
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
