import { z } from 'zod';

export const settingSchema = z.object({
  id: z.string().optional(),
  key: z.string().min(1, 'La clé est requise'),
  value: z.string(),
  type: z.enum(['string', 'number', 'boolean', 'json']),
  group: z.enum(['general', 'notifications', 'payments', 'security']),
  label: z.string().min(1, 'Le libellé est requis'),
  helpText: z.string().optional(),
  options: z.record(z.unknown()).optional(),
  order: z.number().int().min(0, 'L\'ordre doit être un nombre positif'),
});

export type SettingFormValues = z.infer<typeof settingSchema>;
