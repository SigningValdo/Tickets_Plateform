"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Loader2, Lock, CheckCircle } from "lucide-react"
import { toast } from "sonner"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [isValidToken, setIsValidToken] = useState(true)

  useEffect(() => {
    const tokenParam = searchParams.get("token")
    if (tokenParam) {
      setToken(tokenParam)
    } else {
      setIsValidToken(false)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password || !confirmPassword) {
      toast.error("Erreur", {
        description: "Veuillez remplir tous les champs",
      })
      return
    }

    if (password !== confirmPassword) {
      toast.error("Erreur", {
        description: "Les mots de passe ne correspondent pas",
      })
      return
    }

    if (password.length < 8) {
      toast.error("Erreur", {
        description: "Le mot de passe doit contenir au moins 8 caractères",
      })
      return
    }

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsSuccess(true)
      toast.success("Mot de passe réinitialisé", {
        description: "Votre mot de passe a été réinitialisé avec succès",
      })

      setTimeout(() => {
        router.push("/auth/login")
      }, 3000)
    } catch (error) {
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la réinitialisation du mot de passe",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Invalid token state
  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg py-12 px-4">
        <div className="w-full max-w-[460px]">
          <div className="bg-white rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.06)] px-8 py-10 space-y-8">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-red/10 rounded-full flex items-center justify-center">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 16L32 32M32 16L16 32" stroke="#FF3D3D" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-xl font-semibold text-black">Lien invalide</h1>
              <p className="text-sm text-gris2 leading-relaxed">
                Le lien de réinitialisation est invalide ou a expiré
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/auth/forgot-password"
                className="w-full h-12 bg-green hover:bg-green/90 text-white font-medium rounded-xl transition-colors flex items-center justify-center"
              >
                Demander un nouveau lien
              </Link>
              <Link
                href="/auth/login"
                className="w-full h-12 border border-gris4 text-black font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg py-12 px-4">
        <div className="w-full max-w-[460px]">
          <div className="bg-white rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.06)] px-8 py-10 space-y-8">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-green/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-xl font-semibold text-black">
                Mot de passe réinitialisé
              </h1>
              <p className="text-sm text-gris2 leading-relaxed">
                Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Reset form
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg py-12 px-4">
      <div className="w-full max-w-[460px]">
        <div className="bg-white rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.06)] px-8 py-10 space-y-8">
          {/* Illustration */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="20" width="32" height="18" rx="3" fill="#2D2D2D" />
                <circle cx="20" cy="29" r="3" fill="#FFC300" />
                <path d="M20 29V33" stroke="#FFC300" strokeWidth="2" strokeLinecap="round" />
                <rect x="6" y="24" width="2" height="2" rx="1" fill="#FFC300" />
                <rect x="10" y="24" width="2" height="2" rx="1" fill="#FFC300" />
                <rect x="14" y="24" width="2" height="2" rx="1" fill="#FFC300" />
                <rect x="18" y="24" width="2" height="2" rx="1" fill="#FFC300" />
                <path d="M32 26C32 26 38 22 40 18C42 14 40 10 36 10C32 10 32 14 32 14" stroke="#FFC300" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="38" cy="12" r="2" fill="#FFC300" />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-xl font-semibold text-black">
              Nouveau mot de passe
            </h1>
            <p className="text-sm text-gris2 leading-relaxed">
              Choisissez un nouveau mot de passe sécurisé
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gris2" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nouveau mot de passe"
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
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gris2" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmer le mot de passe"
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
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="text-xs text-gris2 space-y-1">
              <p>Le mot de passe doit contenir :</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Au moins 8 caractères</li>
                <li>Une lettre majuscule et une minuscule</li>
                <li>Un chiffre</li>
                <li>Un caractère spécial</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-green hover:bg-green/90 text-white font-medium rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Réinitialisation...
                </>
              ) : (
                "Réinitialiser le mot de passe"
              )}
            </button>
          </form>

          {/* Login link */}
          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-green hover:underline"
            >
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-bg">
          <Loader2 className="h-8 w-8 animate-spin text-green" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
