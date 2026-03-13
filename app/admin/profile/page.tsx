"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { isValidCameroonPhone } from "@/lib/sanitize";
import {
  User,
  Shield,
  Bell,
  Camera,
  Loader2,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  ChevronRight,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type ProfileTab = "info" | "security" | "notifications";

export default function AdminProfilePage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ProfileTab>("info");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    eventReminders: true,
    marketingEmails: false,
  });

  useEffect(() => {
    if (session?.user) {
      setUserData({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: session.user.phone || "",
      });
      setIsLoading(false);
    }
  }, [session]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userData.phone && !isValidCameroonPhone(userData.phone)) {
      toast({
        title: "Erreur",
        description:
          "Numéro de téléphone invalide. Format attendu : 6XXXXXXXX ou +237 6XXXXXXXX",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userData.name,
          phone: userData.phone,
        }),
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour");

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      });
    } catch {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 8 caractères.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }

      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été modifié avec succès.",
      });
      form.reset();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotificationUpdate = (key: string, value: boolean) => {
    setNotifications({ ...notifications, [key]: value });
    toast({
      title: "Préférences mises à jour",
      description: "Vos préférences de notification ont été mises à jour.",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const userInitials = userData.name
    ? userData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  const profileNavItems = [
    {
      key: "info" as ProfileTab,
      label: "Informations personnelles",
      icon: User,
    },
    { key: "security" as ProfileTab, label: "Sécurité", icon: Shield },
    {
      key: "notifications" as ProfileTab,
      label: "Notifications",
      icon: Bell,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-green mx-auto mb-4" />
          <p className="text-gris2 text-sm">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy">Mon profil</h1>
        <p className="text-gris2 text-sm mt-0.5">
          Gérez vos informations personnelles et vos préférences
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Sidebar */}
        <div className="bg-white rounded-2xl p-6">
          {/* Avatar */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-3">
              <div className="w-20 h-20 rounded-full bg-green/10 flex items-center justify-center text-green text-xl font-bold">
                {userInitials}
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-green flex items-center justify-center text-white shadow-md hover:bg-green/90 transition-colors">
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <h2 className="text-base font-bold text-navy">{userData.name}</h2>
            <p className="text-gris2 text-xs">{userData.email}</p>
            <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green/10 text-green">
              Administrateur
            </span>
          </div>

          {/* Navigation */}
          <div className="space-y-1">
            {profileNavItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={cn(
                  "flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  activeTab === item.key
                    ? "bg-green/10 text-green"
                    : "text-gris2 hover:bg-gray-50 hover:text-navy"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-2">
          {/* Info tab */}
          {activeTab === "info" && (
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <User className="h-5 w-5 text-green" />
                <h3 className="text-sm font-semibold text-navy">
                  Informations personnelles
                </h3>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-navy mb-1.5">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      className="w-full h-10 px-4 rounded-xl border border-gris4 bg-bg text-sm text-navy placeholder:text-gris3 focus:outline-none focus:border-green focus:ring-1 focus:ring-green/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy mb-1.5">
                      Adresse email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      disabled
                      className="w-full h-10 px-4 rounded-xl border border-gris4 bg-bg text-sm text-gris2 cursor-not-allowed"
                    />
                    <p className="text-xs text-gris3 mt-1">
                      L&apos;adresse email ne peut pas être modifiée.
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-navy mb-1.5">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={userData.phone}
                      onChange={handleInputChange}
                      placeholder="+237 6XX XXX XXX"
                      className="w-full h-10 px-4 rounded-xl border border-gris4 bg-bg text-sm text-navy placeholder:text-gris3 focus:outline-none focus:border-green focus:ring-1 focus:ring-green/20"
                    />
                    {userData.phone && !isValidCameroonPhone(userData.phone) && (
                      <p className="text-red text-xs mt-1">
                        Format invalide. Ex: 6XXXXXXXX ou +237 6XXXXXXXX
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-green text-white text-sm font-medium rounded-xl hover:bg-green/90 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Mise à jour...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Enregistrer
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Security tab */}
          {activeTab === "security" && (
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="h-5 w-5 text-green" />
                <h3 className="text-sm font-semibold text-navy">
                  Changer le mot de passe
                </h3>
              </div>

              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-1.5">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      required
                      className="w-full h-10 px-4 pr-10 rounded-xl border border-gris4 bg-bg text-sm text-navy placeholder:text-gris3 focus:outline-none focus:border-green focus:ring-1 focus:ring-green/20"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gris3 hover:text-gris2"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-navy mb-1.5">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        required
                        placeholder="Min. 8 caractères"
                        className="w-full h-10 px-4 pr-10 rounded-xl border border-gris4 bg-bg text-sm text-navy placeholder:text-gris3 focus:outline-none focus:border-green focus:ring-1 focus:ring-green/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gris3 hover:text-gris2"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy mb-1.5">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        required
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

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-green text-white text-sm font-medium rounded-xl hover:bg-green/90 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Mise à jour...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        Changer le mot de passe
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Notifications tab */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Bell className="h-5 w-5 text-green" />
                <h3 className="text-sm font-semibold text-navy">
                  Préférences de notification
                </h3>
              </div>

              <div className="space-y-0">
                {[
                  {
                    id: "emailNotifications",
                    label: "Notifications par email",
                    desc: "Recevez des notifications par email concernant les événements et les billets.",
                  },
                  {
                    id: "smsNotifications",
                    label: "Notifications par SMS",
                    desc: "Recevez des alertes par SMS pour les actions importantes.",
                  },
                  {
                    id: "eventReminders",
                    label: "Rappels d'événements",
                    desc: "Soyez notifié avant le début des événements.",
                  },
                  {
                    id: "marketingEmails",
                    label: "Emails marketing",
                    desc: "Recevez des offres spéciales et des recommandations.",
                  },
                ].map((item, index, arr) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center justify-between py-4",
                      index < arr.length - 1 && "border-b border-gris4/30"
                    )}
                  >
                    <div>
                      <p className="text-sm font-medium text-navy">
                        {item.label}
                      </p>
                      <p className="text-xs text-gris2 mt-0.5">{item.desc}</p>
                    </div>
                    <Switch
                      id={item.id}
                      checked={
                        notifications[item.id as keyof typeof notifications]
                      }
                      onCheckedChange={(checked) =>
                        handleNotificationUpdate(item.id, checked)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
