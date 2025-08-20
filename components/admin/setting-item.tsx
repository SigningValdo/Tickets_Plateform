'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Setting } from '@prisma/client';
import { toast } from 'sonner';
import { Loader2, Save, X, Edit } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { settingSchema, SettingFormValues } from '@/lib/validations/setting';

interface SettingItemProps {
  setting: Setting;
  onUpdate: (updatedSetting: Setting) => void;
  onDelete: (id: string) => void;
}

export function SettingItem({ setting, onUpdate, onDelete }: SettingItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SettingFormValues>({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      ...setting,
      options: setting.options as Record<string, unknown> || {},
    },
  });

  const renderInput = (field: any) => {
    const { type, options } = form.getValues();

    switch (type) {
      case 'boolean':
        return (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">{setting.label}</FormLabel>
              <FormDescription>{setting.helpText}</FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value === 'true'}
                onCheckedChange={(checked) => field.onChange(checked.toString())}
              />
            </FormControl>
          </FormItem>
        );
      
      case 'select':
        return (
          <FormItem>
            <FormLabel>{setting.label}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une option" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.entries(options || {}).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {String(label)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {setting.helpText && (
              <FormDescription>{setting.helpText}</FormDescription>
            )}
          </FormItem>
        );

      case 'textarea':
        return (
          <FormItem>
            <FormLabel>{setting.label}</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            {setting.helpText && (
              <FormDescription>{setting.helpText}</FormDescription>
            )}
          </FormItem>
        );

      default:
        return (
          <FormItem>
            <FormLabel>{setting.label}</FormLabel>
            <FormControl>
              <Input type={type} {...field} />
            </FormControl>
            {setting.helpText && (
              <FormDescription>{setting.helpText}</FormDescription>
            )}
          </FormItem>
        );
    }
  };

  const onSubmit = async (values: SettingFormValues) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/settings/${setting.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du paramètre');
      }

      const updatedSetting = await response.json();
      onUpdate(updatedSetting);
      setIsEditing(false);
      toast.success('Paramètre mis à jour avec succès');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour du paramètre');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce paramètre ?')) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/settings/${setting.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du paramètre');
      }

      onDelete(setting.id);
      toast.success('Paramètre supprimé avec succès');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression du paramètre');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <h4 className="font-medium">{setting.label}</h4>
          <p className="text-sm text-muted-foreground">
            {setting.key} • {setting.value}
          </p>
          {setting.helpText && (
            <p className="text-sm text-muted-foreground mt-1">
              {setting.helpText}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            disabled={isLoading}
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-lg">
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => renderInput(field)}
        />
        
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditing(false)}
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Enregistrer
          </Button>
        </div>
      </form>
    </Form>
  );
}
