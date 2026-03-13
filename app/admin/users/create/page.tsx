"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Loader2,
  User,
  Mail,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE" | "BANNED";
  emailVerified?: Date | null;
  image?: string | null;
}

export default function CreateUserPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    password: "",
    role: "USER",
    status: "ACTIVE",
    emailVerified: null,
    image: null,
  });

  const handleInputChange = (
    field: keyof UserFormData,
    value: string | boolean | Date | null,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 8 caractères",
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir une adresse email valide",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) return;

    const { emailVerified, ...userData } = formData;
    const dataToSend = {
      ...userData,
      emailVerified: emailVerified
        ? new Date(emailVerified).toISOString()
        : null,
    };

    setSaving(true);

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la création de l'utilisateur",
        );
      }

      const newUser = await response.json();

      toast({
        title: "Utilisateur créé",
        description: `L'utilisateur ${newUser.name} a été créé avec succès`,
      });

      router.push("/admin/users");
    } catch (error) {
      toast({
        title: "Erreur",
        description:
          error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gris2 border border-gris4 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-navy">Créer un utilisateur</h1>
          <p className="text-gris2 text-sm mt-0.5">
            Ajouter un nouvel utilisateur au système
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Informations personnelles + Contact */}
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-green" />
              <h3 className="text-sm font-semibold text-navy">
                Informations personnelles
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">
                  Nom complet *
                </label>
                <input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Nom complet"
                  required
                  className="w-full h-10 px-4 rounded-xl border border-gris4 bg-bg text-sm text-navy placeholder:text-gris3 focus:outline-none focus:border-green focus:ring-1 focus:ring-green/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">
                  Adresse email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="email@exemple.com"
                  required
                  className="w-full h-10 px-4 rounded-xl border border-gris4 bg-bg text-sm text-navy placeholder:text-gris3 focus:outline-none focus:border-green focus:ring-1 focus:ring-green/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">
                  Rôle
                </label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    handleInputChange("role", value as UserFormData["role"])
                  }
                >
                  <SelectTrigger className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">Utilisateur</SelectItem>
                    <SelectItem value="ADMIN">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">
                  Statut du compte
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    handleInputChange("status", value as UserFormData["status"])
                  }
                >
                  <SelectTrigger className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Actif</SelectItem>
                    <SelectItem value="INACTIVE">Inactif</SelectItem>
                    <SelectItem value="BANNED">Banni</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer mt-4">
              <input
                type="checkbox"
                checked={!!formData.emailVerified}
                onChange={(e) =>
                  handleInputChange(
                    "emailVerified",
                    e.target.checked ? new Date() : null,
                  )
                }
                className="h-4 w-4 rounded border-gris4 text-green focus:ring-green/20"
              />
              <span className="text-sm text-navy">Email vérifié</span>
            </label>
          </div>

          {/* Sécurité */}
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-green" />
              <h3 className="text-sm font-semibold text-navy">
                Sécurité et accès
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">
                  Mot de passe *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder="Mot de passe (min. 8 caractères)"
                    required
                    className="w-full h-10 px-4 pr-10 rounded-xl border border-gris4 bg-bg text-sm text-navy placeholder:text-gris3 focus:outline-none focus:border-green focus:ring-1 focus:ring-green/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gris3 hover:text-gris2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">
                  Confirmer le mot de passe *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmer le mot de passe"
                    required
                    className="w-full h-10 px-4 pr-10 rounded-xl border border-gris4 bg-bg text-sm text-navy placeholder:text-gris3 focus:outline-none focus:border-green focus:ring-1 focus:ring-green/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gris3 hover:text-gris2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/users")}
            disabled={saving}
            className="px-5 py-2.5 border border-gris4 text-navy text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green text-white text-sm font-medium rounded-xl hover:bg-green/90 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Création...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Créer l&apos;utilisateur
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
