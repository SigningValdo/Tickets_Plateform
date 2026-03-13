"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Loader2,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Image as ImageIcon,
  Trash2,
  Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface TicketType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
}

interface EventFormData {
  title: string;
  description: string;
  date: string;
  location: string;
  address: string;
  city: string;
  country: string;
  organizer: string;
  imageUrl: string;
  maxAttendees?: number;
  categoryId: string;
  image: string;
  time: string;
  ticketTypes: TicketType[];
  status: "UPCOMING" | "ACTIVE" | "PAST";
}

type Category = { id: string; name: string };

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    date: "",
    location: "",
    address: "",
    city: "",
    country: "",
    organizer: "",
    imageUrl: "",
    maxAttendees: 100,
    categoryId: "",
    ticketTypes: [],
    image: "",
    time: "",
    status: "UPCOMING",
  });
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchEventAndCategories = async () => {
      try {
        const [eventRes, catRes] = await Promise.all([
          fetch(`/api/admin/events/${params.id}`),
          fetch("/api/admin/event-categories"),
        ]);
        if (!eventRes.ok) throw new Error("Event not found");
        if (!catRes.ok) throw new Error("Categories fetch failed");
        const event = await eventRes.json();
        const categories: Category[] = await catRes.json();
        setCategories(categories);
        setFormData({
          title: event.title,
          description: event.description,
          date: event.date?.slice(0, 10) || "",
          location: event.location || "",
          address: event.address || "",
          city: event.city || "",
          country: event.country || "",
          organizer: event.organizer || "",
          imageUrl: event.imageUrl || "",
          maxAttendees: 100,
          categoryId: event.categoryId || "",
          image: event.image || "",
          time: event.time || "",
          ticketTypes: event.ticketTypes || [],
          status:
            (event.status as "UPCOMING" | "ACTIVE" | "PAST") || "UPCOMING",
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger l'événement ou les catégories",
          variant: "destructive",
        });
        router.push("/admin/events");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEventAndCategories();
    }
  }, [params.id, router, toast]);

  const handleInputChange = (
    field: keyof EventFormData,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTicketTypeChange = (
    index: number,
    field: keyof TicketType,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      ticketTypes: prev.ticketTypes.map((ticket, i) =>
        i === index ? { ...ticket, [field]: value } : ticket,
      ),
    }));
  };

  const addTicketType = () => {
    const newTicketType: TicketType = {
      id: Date.now().toString(),
      name: "",
      price: 0,
      quantity: 0,
      description: "",
    };
    setFormData((prev) => ({
      ...prev,
      ticketTypes: [...prev.ticketTypes, newTicketType],
    }));
  };

  const removeTicketType = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ticketTypes: prev.ticketTypes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.date ||
      !formData.location ||
      !formData.categoryId
    ) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    if (formData.ticketTypes.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez ajouter au moins un type de billet",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const { image, maxAttendees, time, ...rest } = formData;

      let isoDate: string | undefined = undefined;
      if (rest.date) {
        const datePart = rest.date;
        const timePart =
          formData.time && formData.time.length >= 4 ? formData.time : "00:00";
        const composed = new Date(`${datePart}T${timePart}`);
        if (!isNaN(composed.getTime())) {
          isoDate = composed.toISOString();
        }
      }

      const res = await fetch(`/api/admin/events/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...rest,
          date: isoDate ?? undefined,
          ticketTypes: formData.ticketTypes,
        }),
      });
      if (!res.ok) throw new Error("Erreur lors de la sauvegarde");
      toast({
        title: "Événement mis à jour",
        description: "L'événement a été mis à jour avec succès",
      });
      router.push("/admin/events");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-green mx-auto mb-4" />
          <p className="text-gris2 text-sm">
            Chargement de l&apos;événement...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/events"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gris2 border border-gris4 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Retour
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-navy">
              Modifier l&apos;événement
            </h1>
            <p className="text-xs text-gris3 mt-0.5">ID: {params.id}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* General info */}
          <div className="bg-white rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green" />
              <h2 className="text-sm font-semibold text-navy">
                Informations générales
              </h2>
            </div>
            <p className="text-xs text-gris3 -mt-3">
              Informations de base sur l&apos;événement
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-navy mb-1.5"
                >
                  Titre de l&apos;événement *
                </label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Nom de l'événement"
                  className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-navy mb-1.5"
                >
                  Date *
                </label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-navy mb-1.5"
                >
                  Heure *
                </label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                  className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="categoryId"
                  className="block text-sm font-medium text-navy mb-1.5"
                >
                  Catégorie
                </label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    handleInputChange("categoryId", value)
                  }
                >
                  <SelectTrigger className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-navy mb-1.5"
                >
                  Statut
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    handleInputChange(
                      "status",
                      value as "UPCOMING" | "ACTIVE" | "PAST",
                    )
                  }
                >
                  <SelectTrigger className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UPCOMING">À venir</SelectItem>
                    <SelectItem value="ACTIVE">En cours</SelectItem>
                    <SelectItem value="PAST">Passé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-navy mb-1.5"
                >
                  Description
                </label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Description de l'événement"
                  rows={4}
                  className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green" />
              <h2 className="text-sm font-semibold text-navy">
                Lieu de l&apos;événement
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-navy mb-1.5"
                >
                  Nom du lieu *
                </label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  placeholder="Ex: Palais des Congrès"
                  className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="maxAttendees"
                  className="block text-sm font-medium text-navy mb-1.5"
                >
                  Capacité maximale
                </label>
                <Input
                  id="maxAttendees"
                  type="number"
                  value={formData.maxAttendees}
                  onChange={(e) =>
                    handleInputChange(
                      "maxAttendees",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  placeholder="Nombre maximum de participants"
                  className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-navy mb-1.5"
                >
                  Adresse complète
                </label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Adresse complète du lieu"
                  className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20"
                />
              </div>
            </div>
          </div>

          {/* Ticket types */}
          <div className="bg-white rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green" />
                <h2 className="text-sm font-semibold text-navy">
                  Types de billets
                </h2>
              </div>
              <button
                type="button"
                onClick={addTicketType}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green border border-green/30 rounded-lg hover:bg-green/5 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Ajouter un type
              </button>
            </div>

            <div className="space-y-3">
              {formData.ticketTypes.map((ticket, index) => (
                <div key={ticket.id} className="bg-bg rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-navy">
                      Type de billet #{index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeTicketType(index)}
                      className="p-1.5 rounded-lg text-red hover:bg-red/5 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gris2 mb-1">
                        Nom du type
                      </label>
                      <Input
                        value={ticket.name}
                        onChange={(e) =>
                          handleTicketTypeChange(index, "name", e.target.value)
                        }
                        placeholder="Ex: Standard, VIP"
                        className="rounded-xl border-gris4 bg-white text-sm focus:border-green focus:ring-1 focus:ring-green/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gris2 mb-1">
                        Prix (FCFA)
                      </label>
                      <Input
                        type="number"
                        value={ticket.price}
                        onChange={(e) =>
                          handleTicketTypeChange(
                            index,
                            "price",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        placeholder="Prix en FCFA"
                        className="rounded-xl border-gris4 bg-white text-sm focus:border-green focus:ring-1 focus:ring-green/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gris2 mb-1">
                        Quantité
                      </label>
                      <Input
                        type="number"
                        value={ticket.quantity}
                        onChange={(e) =>
                          handleTicketTypeChange(
                            index,
                            "quantity",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        placeholder="Nombre de billets"
                        className="rounded-xl border-gris4 bg-white text-sm focus:border-green focus:ring-1 focus:ring-green/20"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-xs text-gris2 mb-1">
                        Description
                      </label>
                      <Input
                        value={ticket.description}
                        onChange={(e) =>
                          handleTicketTypeChange(
                            index,
                            "description",
                            e.target.value,
                          )
                        }
                        placeholder="Description du type de billet"
                        className="rounded-xl border-gris4 bg-white text-sm focus:border-green focus:ring-1 focus:ring-green/20"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {formData.ticketTypes.length === 0 && (
                <div className="text-center py-10">
                  <Users className="h-10 w-10 text-gris3 mx-auto mb-3" />
                  <p className="text-sm text-gris2">
                    Aucun type de billet configuré
                  </p>
                  <p className="text-xs text-gris3 mt-1">
                    Cliquez sur &quot;Ajouter un type&quot; pour commencer
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Image */}
          <div className="bg-white rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-green" />
              <h2 className="text-sm font-semibold text-navy">
                Image de l&apos;événement
              </h2>
            </div>

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
                      setFormData((prev) => ({
                        ...prev,
                        imageUrl: data.url,
                        image: data.url,
                      }));
                    }
                  } catch (err) {
                    console.error(err);
                  }
                }}
              />
              {formData.image || formData.imageUrl ? (
                <div className="h-16 w-28 relative overflow-hidden rounded-xl border border-gris4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      formData.image || formData.imageUrl || "/placeholder.svg"
                    }
                    alt="Aperçu"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}
            </div>
            <p className="text-xs text-gris3">
              Vous pouvez téléverser une image ou fournir un lien ci-dessous.
            </p>
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-navy mb-1.5"
              >
                URL de l&apos;image
              </label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    image: val,
                    imageUrl: val,
                  }));
                }}
                placeholder="https://... ou /uploads/xxx.jpg"
                className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20"
              />
            </div>
          </div>
        </div>
        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/events")}
            disabled={saving}
            className="px-5 py-2.5 text-sm font-medium text-gris2 border border-gris4 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-green text-white text-sm font-medium rounded-xl hover:bg-green/90 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Sauvegarder les modifications
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
