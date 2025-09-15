"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { EventWithTicketTypes } from "@/components/admin-event-list";
import { useEffect, useState } from "react";

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
  // Autorise les URLs relatives (ex: /uploads/xxx.jpg) renvoyées par l'API d'upload
  imageUrl: z
    .string()
    .optional()
    .or(z.literal("")),
  categoryId: z.string().min(1, "La catégorie est requise."),
  ticketTypes: z
    .array(ticketTypeSchema)
    .min(1, "Vous devez ajouter au moins un type de ticket."),
});

export default function CreateEventPage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State pour les catégories
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
      // On prépare le payload pour matcher le backend
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Créer un nouvel événement
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre de l'événement</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Concert de Rock" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez l'événement..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de l'événement</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: fr })
                            ) : (
                              <span>Choisissez une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
                    <FormLabel>Lieu</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Le Zénith, Paris" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Adresse complète de l'événement"
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
                    <FormLabel>Ville</FormLabel>
                    <FormControl>
                      <Input placeholder="Ville" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pays</FormLabel>
                    <FormControl>
                      <Input placeholder="Pays" {...field} />
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
                    <FormLabel>Organisateur</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de l'organisateur" {...field} />
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
                  <FormLabel>Catégorie</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="input input-bordered w-full"
                      value={field.value || ""}
                      onChange={field.onChange}
                    >
                      <option value="">Sélectionnez une catégorie</option>
                      {categories &&
                        categories.map((cat: any) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Upload d'image depuis l'appareil */}
            <div className="space-y-3">
              <FormLabel>Image de l'événement</FormLabel>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const fd = new FormData();
                      fd.append("file", file);
                      const res = await fetch("/api/upload", { method: "POST", body: fd });
                      if (!res.ok) throw new Error("Upload échoué");
                      const data = await res.json();
                      if (data?.url) {
                        form.setValue("imageUrl", data.url, { shouldValidate: true, shouldDirty: true });
                      }
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                />
                {form.watch("imageUrl") ? (
                  <div className="h-16 w-28 relative overflow-hidden rounded border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.watch("imageUrl") || "/placeholder.svg"}
                      alt="Aperçu"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}
              </div>
              <p className="text-xs text-gray-500">Vous pouvez téléverser une image ou fournir un lien ci-dessous.</p>
            </div>

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de l'image</FormLabel>
                  <FormControl>
                    <Input placeholder="https://... ou /uploads/xxx.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    Lien vers l'image promotionnelle de l'événement.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <h3 className="text-lg font-medium mb-4">Types de tickets</h3>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-end gap-4 p-4 border rounded-md relative"
                  >
                    <FormField
                      control={form.control}
                      name={`ticketTypes.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Nom du ticket</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Ex: VIP, Early Bird"
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
                          <FormLabel>Prix (€)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              placeholder="Ex: 50"
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
                          <FormLabel>Quantité</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              placeholder="Ex: 200"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={fields.length <= 1}
                      className="text-red-500 hover:text-red-700 disabled:text-gray-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => append({ name: "", price: 0, quantity: 50 })}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Ajouter un type de ticket
              </Button>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending
                  ? "Création en cours..."
                  : "Créer l'événement"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
