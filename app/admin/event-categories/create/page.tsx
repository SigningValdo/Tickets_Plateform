"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, Tag } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  description: z.string().optional(),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
      message: "La couleur doit être au format hexadécimal (ex: #ff0000)",
    })
    .optional(),
});

export default function CreateEventCategoryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      color: "#3b82f6",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await fetch("/api/admin/event-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Une erreur est survenue");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Catégorie créée",
        description: "La catégorie a été créée avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["event-categories"] });
      router.push("/admin/event-categories");
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description:
          error.message ||
          "Une erreur est survenue lors de la création de la catégorie.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/event-categories"
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gris2 border border-gris4 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-navy">Nouvelle catégorie</h1>
          <p className="text-gris2 text-sm mt-0.5">
            Créez une nouvelle catégorie pour organiser vos événements
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Détails */}
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-5 w-5 text-green" />
              <h3 className="text-sm font-semibold text-navy">
                Détails de la catégorie
              </h3>
            </div>
            <p className="text-xs text-gris2 mb-4">
              Les champs marqués d&apos;un astérisque (*) sont obligatoires.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <label className="block text-sm font-medium text-navy mb-1.5">
                      Nom de la catégorie *
                    </label>
                    <FormControl>
                      <input
                        placeholder="Ex: Musique, Sport, Conférence..."
                        className="w-full h-10 px-4 rounded-xl border border-gris4 bg-bg text-sm text-navy placeholder:text-gris3 focus:outline-none focus:border-green focus:ring-1 focus:ring-green/20"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-gris3 mt-1">
                      Le nom qui sera affiché pour cette catégorie.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <label className="block text-sm font-medium text-navy mb-1.5">
                      Couleur
                    </label>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-xl border border-gris4 flex-shrink-0"
                        style={{ backgroundColor: field.value }}
                      />
                      <FormControl>
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-gris2">#</span>
                          <input
                            className="w-24 h-10 px-3 rounded-xl border border-gris4 bg-bg text-sm text-navy focus:outline-none focus:border-green focus:ring-1 focus:ring-green/20"
                            placeholder="3b82f6"
                            value={field.value?.replace("#", "")}
                            onChange={(e) =>
                              field.onChange("#" + e.target.value)
                            }
                          />
                        </div>
                      </FormControl>
                    </div>
                    <p className="text-xs text-gris3 mt-1">
                      La couleur associée à cette catégorie (format hexadécimal).
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <label className="block text-sm font-medium text-navy mb-1.5">
                      Description
                    </label>
                    <FormControl>
                      <textarea
                        placeholder="Décrivez cette catégorie..."
                        className="w-full min-h-[100px] px-4 py-3 rounded-xl border border-gris4 bg-bg text-sm text-navy placeholder:text-gris3 focus:outline-none focus:border-green focus:ring-1 focus:ring-green/20 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-gris3 mt-1">
                      Une brève description de cette catégorie (optionnelle).
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/event-categories")}
              disabled={mutation.isPending}
              className="px-5 py-2.5 border border-gris4 text-navy text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green text-white text-sm font-medium rounded-xl hover:bg-green/90 transition-colors disabled:opacity-50"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Créer la catégorie
                </>
              )}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}
