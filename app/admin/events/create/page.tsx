"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  CalendarIcon,
  PlusCircle,
  Trash2,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { EventWithTicketTypes } from "@/components/admin-event-list";
import { useEffect, useState } from "react";
import Link from "next/link";

const ticketTypeSchema = z.object({
  name: z.string().min(1, "Le nom du type de ticket est requis."),
  price: z.coerce.number().min(0, "Le prix doit être positif."),
  quantity: z.coerce
    .number()
    .int()
    .min(1, "La quantité doit être d'au moins 1."),
});

const formSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères."),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères."),
  date: z.date({ required_error: "La date de l'événement est requise." }),
  location: z.string().min(3, "Le lieu doit contenir au moins 3 caractères."),
  address: z.string().min(3, "L'adresse doit contenir au moins 3 caractères."),
  city: z.string().min(2, "La ville est requise."),
  country: z.string().min(2, "Le pays est requis."),
  organizer: z.string().min(2, "L'organisateur est requis."),
  imageUrl: z.string().optional().or(z.literal("")),
  categoryId: z.string().min(1, "La catégorie est requise."),
  ticketTypes: z
    .array(ticketTypeSchema)
    .min(1, "Vous devez ajouter au moins un type de ticket."),
});

export default function CreateEventPage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [categories, setCategories] = useState<any[]>([]);
  useEffect(() => {
    axios.get("/api/admin/event-categories").then((res) => {
      setCategories(res.data);
    });
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      date: undefined,
      location: "",
      address: "",
      city: "",
      country: "",
      organizer: "",
      imageUrl: "",
      categoryId: "",
      ticketTypes: [{ name: "Standard", price: 25, quantity: 100 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ticketTypes",
  });

  const mutation = useMutation<
    EventWithTicketTypes,
    Error,
    z.infer<typeof formSchema>
  >({
    mutationFn: (newEvent) => {
      return axios
        .post("/api/admin/events", {
          ...newEvent,
          date:
            newEvent.date instanceof Date
              ? newEvent.date.toISOString()
              : newEvent.date,
        })
        .then((res) => res.data);
    },
    onSuccess: (data) => {
      toast({
        title: "Événement créé !",
        description: `L'événement "${data.title}" a été créé avec succès.`,
      });
      queryClient.invalidateQueries({ queryKey: ["adminEvents"] });
      router.push("/admin/events");
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Une erreur est survenue: ${error.message}`,
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
          href="/admin/events"
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gris2 border border-gris4 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </Link>
        <h1 className="text-2xl font-bold text-navy">
          Créer un nouvel événement
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-6">
            {/* General info */}
            <div className="bg-white rounded-2xl p-6 space-y-5">
              <h2 className="text-sm font-semibold text-navy">
                Informations générales
              </h2>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-navy">
                      Titre de l&apos;événement
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Concert de Rock"
                        className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-navy">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez l'événement..."
                        className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20 min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm text-navy">
                        Date de l&apos;événement
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal rounded-xl border-gris4 bg-bg",
                                !field.value && "text-gris3",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: fr })
                              ) : (
                                <span>Choisissez une date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 text-gris3" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-navy">Lieu</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Le Zénith, Paris"
                          className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-navy">
                      Catégorie
                    </FormLabel>
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20">
                          <SelectValue placeholder="Sélectionnez une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories &&
                          categories.map((cat: any) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location details */}
            <div className="bg-white rounded-2xl p-6 space-y-5">
              <h2 className="text-sm font-semibold text-navy">
                Adresse de l&apos;événement
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-navy">
                        Adresse
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Adresse complète"
                          className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-navy">Ville</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ville"
                          className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-navy">Pays</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Pays"
                          className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="organizer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-navy">
                        Organisateur
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nom de l'organisateur"
                          className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Image */}
            <div className="bg-white rounded-2xl p-6 space-y-5">
              <h2 className="text-sm font-semibold text-navy">
                Image de l&apos;événement
              </h2>

              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  className="text-sm text-gris2 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-green/10 file:text-green hover:file:bg-green/20 file:cursor-pointer"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const fd = new FormData();
                      fd.append("file", file);
                      const res = await fetch("/api/upload", {
                        method: "POST",
                        body: fd,
                      });
                      if (!res.ok) throw new Error("Upload échoué");
                      const data = await res.json();
                      if (data?.url) {
                        form.setValue("imageUrl", data.url, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                />
                {form.watch("imageUrl") ? (
                  <div className="h-16 w-28 relative overflow-hidden rounded-xl border border-gris4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.watch("imageUrl") || "/placeholder.svg"}
                      alt="Aperçu"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}
              </div>
              <p className="text-xs text-gris3">
                Vous pouvez téléverser une image ou fournir un lien ci-dessous.
              </p>

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-navy">
                      URL de l&apos;image
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://... ou /uploads/xxx.jpg"
                        className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Ticket types */}
            <div className="bg-white rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-navy">
                  Types de tickets
                </h2>
                <button
                  type="button"
                  onClick={() => append({ name: "", price: 0, quantity: 50 })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green border border-green/30 rounded-lg hover:bg-green/5 transition-colors"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  Ajouter
                </button>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex flex-col sm:flex-row sm:items-end gap-4 p-4 bg-bg rounded-xl"
                  >
                    <FormField
                      control={form.control}
                      name={`ticketTypes.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-xs text-gris2">
                            Nom du ticket
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Ex: VIP, Early Bird"
                              className="rounded-xl border-gris4 bg-white text-sm focus:border-green focus:ring-1 focus:ring-green/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`ticketTypes.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-gris2">
                            Prix (FCFA)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              placeholder="Ex: 50"
                              className="rounded-xl border-gris4 bg-white text-sm focus:border-green focus:ring-1 focus:ring-green/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`ticketTypes.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-gris2">
                            Quantité
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              placeholder="Ex: 200"
                              className="rounded-xl border-gris4 bg-white text-sm focus:border-green focus:ring-1 focus:ring-green/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      disabled={fields.length <= 1}
                      className="p-2 rounded-lg text-red hover:bg-red/5 disabled:text-gris3 disabled:hover:bg-transparent transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green text-white text-sm font-medium rounded-xl hover:bg-green/90 transition-colors disabled:opacity-50"
            >
              {mutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {mutation.isPending
                ? "Création en cours..."
                : "Créer l'événement"}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}
