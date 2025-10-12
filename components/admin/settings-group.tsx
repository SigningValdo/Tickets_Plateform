"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Settings as SettingsIcon } from "lucide-react";
import { SettingItem } from "./setting-item";
import { Setting } from "@prisma/client";
import { CreateSettingDialog } from "./create-setting-dialog";

const groupLabels = {
  general: "Général",
  notifications: "Notifications",
  payments: "Paiements",
  security: "Sécurité",
} as const;

type GroupKey = keyof typeof groupLabels;

interface SettingsGroupProps {
  initialSettings: Setting[];
}

export function SettingsGroup({ initialSettings }: SettingsGroupProps) {
  const [settings, setSettings] = useState<Setting[]>(initialSettings);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<GroupKey>("general");

  const groupedSettings = settings.reduce<Record<GroupKey, Setting[]>>(
    (acc, setting) => {
      if (groupLabels[setting.group as GroupKey]) {
        acc[setting.group as GroupKey].push(setting);
      }
      return acc;
    },
    {
      general: [],
      notifications: [],
      payments: [],
      security: [],
    }
  );

  const handleSettingUpdated = (updatedSetting: Setting) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === updatedSetting.id ? updatedSetting : setting
      )
    );
  };

  const handleSettingDeleted = (deletedId: string) => {
    setSettings((prev) => prev.filter((setting) => setting.id !== deletedId));
  };

  const handleSettingCreated = (newSetting: Setting) => {
    setSettings((prev) => [...prev, newSetting]);
    setActiveGroup(newSetting.group as GroupKey);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Paramètres</h2>
          <p className="text-sm text-muted-foreground">
            Gérez les paramètres de l'application
          </p>
        </div>
        <CreateSettingDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSettingCreated={handleSettingCreated}
        >
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau paramètre
          </Button>
        </CreateSettingDialog>
      </div>

      <Tabs
        value={activeGroup}
        onValueChange={(value) => setActiveGroup(value as GroupKey)}
        className="space-y-4"
      >
        <TabsList>
          {Object.entries(groupLabels).map(([key, label]) => (
            <TabsTrigger key={key} value={key}>
              <SettingsIcon className="h-4 w-4 mr-2" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(groupedSettings).map(([group, groupSettings]) => (
          <TabsContent key={group} value={group} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{groupLabels[group as GroupKey]}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {groupSettings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucun paramètre dans cette catégorie
                  </div>
                ) : (
                  groupSettings.map((setting) => (
                    <SettingItem
                      key={setting.id}
                      setting={setting}
                      onUpdate={handleSettingUpdated}
                      onDelete={handleSettingDeleted}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
