"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { isValidCameroonPhone } from "@/lib/sanitize";
import {
  User,
  Ticket,
  Bell,
  Shield,
  ChevronRight,
  Camera,
  Loader2,
  Pencil,
  Phone,
  Mail,
  Lock,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ProfileTab = "info" | "security" | "notifications";

export default function ProfilePage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ProfileTab>("info");

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
    : "U";

  const profileNavItems = [
    {
      key: "info" as ProfileTab,
      label: "Informations personnelles",
      icon: User,
    },
    { key: "security" as ProfileTab, label: "Sécurité", icon: Shield },
    { key: "notifications" as ProfileTab, label: "Notifications", icon: Bell },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green" />
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">Mon profil</h1>
          <p className="text-gris2 text-sm mt-1">
            Gérez vos informations personnelles et vos préférences
          </p>
        </div>
        <button
          onClick={() => setActiveTab("info")}
          className="hidden sm:flex items-center gap-2 px-5 h-10 rounded-2xl border border-green text-green text-sm font-medium hover:bg-green/5 transition-colors"
        >
          <Pencil className="h-4 w-4" />
          Editer mon profil
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left card - Profile sidebar */}
        <div className="w-full shrink-0">
          <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6">
            {/* Avatar */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-green/10 flex items-center justify-center text-green text-2xl font-bold">
                  {userInitials}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-green flex items-center justify-center text-white shadow-lg hover:bg-green/90 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <h2 className="text-lg font-bold text-navy">{userData.name}</h2>
              <p className="text-gris2 text-sm">{userData.email}</p>
            </div>

            {/* Profile nav */}
            <div className="space-y-2">
              {profileNavItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={cn(
                    "flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    activeTab === item.key
                      ? "bg-green/10 text-green"
                      : "text-gris2 hover:bg-gray-50 hover:text-navy",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ))}
              <Link
                href="/account/tickets"
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium text-gris2 hover:bg-gray-50 hover:text-navy transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Ticket className="h-4 w-4" />
                  <span>Mes billets</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right content */}
        <div className=" col-span-2 min-w-0">
          {/* Info tab */}
          {activeTab === "info" && (
            <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6">
              <h3 className="text-lg font-bold text-navy mb-6">
                Informations personnelles
              </h3>
              <form onSubmit={handleProfileUpdate} className="space-y-5">
                {/* Nom complet */}
                <div>
                  <label className="block text-sm font-medium text-gris2 mb-2">
                    Nom complet
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gris3" />
                    <input
                      type="text"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      className="w-full h-12 pl-11 pr-4 rounded-2xl border border-gris4 bg-white text-sm text-navy placeholder:text-gris3 focus:outline-none focus:border-green focus:ring-1 focus:ring-green/20"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gris2 mb-2">
                    Adresse mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gris3" />
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      disabled
                      className="w-full h-12 pl-11 pr-4 rounded-2xl border border-gris4 bg-bg text-sm text-gris2 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gris3 mt-1.5">
                    L&apos;adresse email ne peut pas être modifiée.
                  </p>
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-medium text-gris2 mb-2">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gris3" />
                    <input
                      type="tel"
                      name="phone"
                      value={userData.phone}
                      onChange={handleInputChange}
                      placeholder="+237 6XX XXX XXX"
                      className="w-full h-12 pl-11 pr-4 rounded-2xl border border-gris4 bg-white text-sm text-navy placeholder:text-gris3 focus:outline-none focus:border-green focus:ring-1 focus:ring-green/20"
                    />
                  </div>
                  {userData.phone && !isValidCameroonPhone(userData.phone) && (
                    <p className="text-red text-xs mt-1.5">
                      Format invalide. Ex: 6XXXXXXXX ou +237 6XXXXXXXX
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 px-8 rounded-2xl bg-green text-white text-sm font-semibold hover:bg-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Mise à jour...
                    </>
                  ) : (
                    "Enregistrer les modifications"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Security tab */}
          {activeTab === "security" && (
            <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6">
              <h3 className="text-lg font-bold text-navy mb-6">Sécurité</h3>
              <form onSubmit={handlePasswordUpdate} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gris2 mb-2">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gris3" />
                    <input
                      type="password"
                      name="currentPassword"
                      required
                      className="w-full h-12 pl-11 pr-4 rounded-2xl border border-gris4 bg-white text-sm text-navy placeholder:text-gris3 focus:outline-none focus:border-green focus:ring-1 focus:ring-green/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gris2 mb-2">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gris3" />
                    <input
                      type="password"
                      name="newPassword"
                      required
                      className="w-full h-12 pl-11 pr-4 rounded-2xl border border-gris4 bg-white text-sm text-navy placeholder:text-gris3 focus:outline-none focus:border-green focus:ring-1 focus:ring-green/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gris2 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gris3" />
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      className="w-full h-12 pl-11 pr-4 rounded-2xl border border-gris4 bg-white text-sm text-navy placeholder:text-gris3 focus:outline-none focus:border-green focus:ring-1 focus:ring-green/20"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 px-8 rounded-2xl bg-green text-white text-sm font-semibold hover:bg-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Mise à jour...
                    </>
                  ) : (
                    "Changer le mot de passe"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Notifications tab */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6">
              <h3 className="text-lg font-bold text-navy mb-6">
                Préférences de notification
              </h3>
              <div className="space-y-6">
                {[
                  {
                    id: "emailNotifications",
                    label: "Notifications par email",
                    desc: "Recevez des notifications par email concernant vos billets et événements.",
                  },
                  {
                    id: "smsNotifications",
                    label: "Notifications par SMS",
                    desc: "Recevez des notifications par SMS concernant vos billets et événements.",
                  },
                  {
                    id: "eventReminders",
                    label: "Rappels d'événements",
                    desc: "Recevez des rappels avant les événements auxquels vous participez.",
                  },
                  {
                    id: "marketingEmails",
                    label: "Emails marketing",
                    desc: "Recevez des offres spéciales et des recommandations d'événements.",
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 border-b border-gris4/30 last:border-0"
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
