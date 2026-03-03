"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Globe,
  Moon,
  Sun,
  Bell,
  Shield,
  Loader2,
  LogOut,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function AccountSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [language, setLanguage] = useState("fr");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    eventReminders: true,
    marketingEmails: false,
  });

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-fanzone-orange" />
      </div>
    );
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
    toast({
      title: "Préférences mises à jour",
      description: "Vos préférences de notification ont été enregistrées.",
    });
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-gray-500">
          Gérez vos préférences et paramètres de compte
        </p>
      </div>

      <div className="space-y-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-fanzone-orange" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications par email</Label>
                <p className="text-sm text-gray-500">
                  Recevez des emails pour vos billets et événements.
                </p>
              </div>
              <Switch
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) =>
                  handleNotificationChange("emailNotifications", checked)
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications par SMS</Label>
                <p className="text-sm text-gray-500">
                  Recevez des SMS pour les mises à jour importantes.
                </p>
              </div>
              <Switch
                checked={notifications.smsNotifications}
                onCheckedChange={(checked) =>
                  handleNotificationChange("smsNotifications", checked)
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Rappels d'événements</Label>
                <p className="text-sm text-gray-500">
                  Recevez un rappel avant chaque événement auquel vous
                  participez.
                </p>
              </div>
              <Switch
                checked={notifications.eventReminders}
                onCheckedChange={(checked) =>
                  handleNotificationChange("eventReminders", checked)
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Emails marketing</Label>
                <p className="text-sm text-gray-500">
                  Recevez des offres spéciales et recommandations.
                </p>
              </div>
              <Switch
                checked={notifications.marketingEmails}
                onCheckedChange={(checked) =>
                  handleNotificationChange("marketingEmails", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Apparence & Langue */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-fanzone-orange" />
              Apparence & Langue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Langue</Label>
                <p className="text-sm text-gray-500">
                  Choisissez la langue de l'interface.
                </p>
              </div>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 flex items-center gap-3">
                {darkMode ? (
                  <Moon className="h-5 w-5 text-gray-500" />
                ) : (
                  <Sun className="h-5 w-5 text-yellow-500" />
                )}
                <div>
                  <Label>Mode sombre</Label>
                  <p className="text-sm text-gray-500">
                    Basculer entre le thème clair et sombre.
                  </p>
                </div>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={(checked) => {
                  setDarkMode(checked);
                  toast({
                    title: "Thème mis à jour",
                    description: checked
                      ? "Mode sombre activé."
                      : "Mode clair activé.",
                  });
                }}
              />
            </div>
          </CardContent>
        </Card> */}

        {/* Sécurité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-fanzone-orange" />
              Sécurité & Compte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Changer le mot de passe</p>
                <p className="text-sm text-gray-500">
                  Modifiez votre mot de passe depuis votre profil.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/account/profile")}
              >
                Modifier
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Informations du compte</p>
                <p className="text-sm text-gray-500">
                  {session?.user?.email || "—"}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/account/profile")}
              >
                Voir le profil
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Zone de danger */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Zone dangereuse
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Déconnexion</p>
                <p className="text-sm text-gray-500">
                  Vous serez déconnecté de votre compte.
                </p>
              </div>
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Se déconnecter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
