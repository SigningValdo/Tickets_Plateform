"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Erreur", {
        description: "Veuillez entrer votre adresse email",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch (error) {
      toast.error("Erreur", {
        description:
          "Une erreur est survenue lors de l'envoi de l'email de réinitialisation",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg py-12 px-4">
      <div className="w-full max-w-[460px]">
        <div className="bg-white rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.06)] px-8 py-10">
          {!isSubmitted ? (
            <div className="space-y-8">
              {/* Illustration */}
              <div className="flex justify-center">
                <div className="w-[148px] h-[148px] bg-bg rounded-full flex items-center justify-center">
                  <Image
                    src="/gifs/restore-password.gif"
                    alt="Restore password"
                    width={103}
                    height={103}
                  />
                </div>
              </div>

              {/* Header */}
              <div className="text-center space-y-2">
                <h1 className="text-xl font-semibold text-black">
                  Mot de passe oublié ?
                </h1>
                <p className="text-sm text-gris2 leading-relaxed">
                  Entrez votre adresse mail pour recevoir un lien de
                  réinitialisation
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-green hover:bg-green/90 text-white font-medium rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    "Recevoir le lien"
                  )}
                </button>
              </form>

              {/* Login link */}
              <div className="text-center space-y-2">
                <p className="text-sm text-gris2">
                  Vous vous souvenez de votre mot de passe ?
                </p>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-green hover:underline"
                >
                  Me connecter
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Success icon */}
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-green/10 rounded-full flex items-center justify-center">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 24L22 32L34 16"
                      stroke="#008D50"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Header */}
              <div className="text-center space-y-2">
                <h1 className="text-xl font-semibold text-black">
                  Email envoyé
                </h1>
                <p className="text-sm text-gris2 leading-relaxed">
                  Si un compte existe avec l&apos;adresse{" "}
                  <span className="font-medium text-black">{email}</span>, vous
                  recevrez un lien de réinitialisation.
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full h-12 border border-gris4 text-black font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Essayer avec une autre adresse
                </button>
                <Link
                  href="/auth/login"
                  className="w-full h-12 bg-green hover:bg-green/90 text-white font-medium rounded-xl transition-colors flex items-center justify-center"
                >
                  Retour à la connexion
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
