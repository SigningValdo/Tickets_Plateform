"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Settings as SettingsIcon, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SettingsGroup } from "@/components/admin/settings-group";
import { Setting } from "@prisma/client";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/settings");

      if (!response.ok) {
        throw new Error("Échec du chargement des paramètres");
      }

      const data = await response.json();
      setSettings(data);
    } catch (err) {
      console.error("Erreur lors du chargement des paramètres:", err);
      setError("Impossible de charger les paramètres. Veuillez réessayer.");
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingUpdated = (updatedSetting: Setting) => {
    setSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.id === updatedSetting.id ? updatedSetting : setting
      )
    );
  };

  const handleSettingDeleted = (deletedId: string) => {
    setSettings((prevSettings) =>
      prevSettings.filter((setting) => setting.id !== deletedId)
    );
  };

  const handleSettingCreated = (newSetting: Setting) => {
    setSettings((prevSettings) => [...prevSettings, newSetting]);
  };

  return (
    <div>
      <div>
        <main className="p-4 lg:p-6">
          <div className="mx-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <X className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            ) : (
              <SettingsGroup
                initialSettings={settings}
                // @ts-ignore
                onSettingUpdated={handleSettingUpdated}
                onSettingDeleted={handleSettingDeleted}
                onSettingCreated={handleSettingCreated}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
