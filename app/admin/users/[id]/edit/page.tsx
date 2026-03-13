"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Loader2,
  User,
  Mail,
  Shield,
  Eye,
  EyeOff,
  Lock,
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
  password?: string;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE" | "BANNED";
  emailVerified: Date | null;
  image: string | null;
}

interface PasswordChangeData {
  newPassword: string;
  confirmPassword: string;
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    role: "USER",
    status: "ACTIVE",
    emailVerified: null,
    image: null,
  });

  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/admin/users/${params.id}`);
        const data = await response.json();

        setFormData({
          name: data.name,
          email: data.email,
          role: data.role,
          status: data.status,
          emailVerified: data.emailVerified,
          image: data.image,
        });
      } catch {
        toast({
          title: "Erreur",
          description: "Impossible de charger l'utilisateur",
          variant: "destructive",
        });
        router.push("/admin/users");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchUser();
  }, [params.id, router, toast]);

  const handleInputChange = (
    field: keyof UserFormData,
    value: string | boolean | Date | null,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (
    field: keyof PasswordChangeData,
    value: string,
  ) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
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

    if (showPasswordSection) {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast({
          title: "Erreur",
          description: "Les mots de passe ne correspondent pas",
          variant: "destructive",
        });
        return false;
      }
      if (passwordData.newPassword && passwordData.newPassword.length < 8) {
        toast({
          title: "Erreur",
          description: "Le mot de passe doit contenir au moins 8 caractères",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);

    try {
      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: formData.status,
          emailVerified: formData.emailVerified,
          image: formData.image,
          password: showPasswordSection ? passwordData.newPassword : undefined,
        }),
      });

      if (response.ok) {
        toast({
          title: "Utilisateur mis à jour",
          description: `L'utilisateur ${formData.name} a été mis à jour avec succès${showPasswordSection && passwordData.newPassword ? ". Le mot de passe a été modifié." : "."}`,
        });
        router.push("/admin/users");
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la mise à jour",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-green mx-auto mb-4" />
          <p className="text-gris2 text-sm">
            Chargement de l&apos;utilisateur...
          </p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-navy">
            Modifier l&apos;utilisateur
          </h1>
          <p className="text-gris2 text-xs mt-0.5">ID: {params.id}</p>
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
                  Nom *
                </label>
                <input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Nom"
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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-navy mb-1.5">
                  URL de l&apos;image de profil
                </label>
                <input
                  type="url"
                  value={formData.image || ""}
                  onChange={(e) =>
                    handleInputChange("image", e.target.value || null)
                  }
                  placeholder="https://exemple.com/photo.jpg"
                  className="w-full h-10 px-4 rounded-xl border border-gris4 bg-bg text-sm text-navy placeholder:text-gris3 focus:outline-none focus:border-green focus:ring-1 focus:ring-green/20"
                />
              </div>
            </div>
          </div>

          {/* Rôle et permissions */}
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-green" />
              <h3 className="text-sm font-semibold text-navy">
                Rôle et permissions
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">Utilisateur</SelectItem>
                    <SelectItem value="ADMIN">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-4 pb-0.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.status === "ACTIVE"}
                    onChange={(e) =>
                      handleInputChange(
                        "status",
                        e.target.checked ? "ACTIVE" : "INACTIVE",
                      )
                    }
                    className="h-4 w-4 rounded border-gris4 text-green focus:ring-green/20"
                  />
                  <span className="text-sm text-navy">Compte actif</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
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
            </div>
          </div>

          {/* Mot de passe */}
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="h-5 w-5 text-green" />
              <h3 className="text-sm font-semibold text-navy">Mot de passe</h3>
            </div>
            <p className="text-xs text-gris2 mb-4">
              Laissez vide pour conserver le mot de passe actuel
            </p>

            <label className="flex items-center gap-2 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={showPasswordSection}
                onChange={(e) => {
                  setShowPasswordSection(e.target.checked);
                  if (!e.target.checked) {
                    setPasswordData({ newPassword: "", confirmPassword: "" });
                  }
                }}
                className="h-4 w-4 rounded border-gris4 text-green focus:ring-green/20"
              />
              <span className="text-sm text-navy">
                Modifier le mot de passe
              </span>
            </label>

            {showPasswordSection && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gris4/50">
                <div>
                  <label className="block text-sm font-medium text-navy mb-1.5">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        handlePasswordChange("newPassword", e.target.value)
                      }
                      placeholder="Min. 8 caractères"
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
                    Confirmer le nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        handlePasswordChange("confirmPassword", e.target.value)
                      }
                      placeholder="Confirmer le mot de passe"
                      className="w-full h-10 px-4 pr-10 rounded-xl border border-gris4 bg-bg text-sm text-navy placeholder:text-gris3 focus:outline-none focus:border-green focus:ring-1 focus:ring-green/20"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
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
            )}
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
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Sauvegarder les modifications
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
