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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
          status: (event.status as "UPCOMING" | "ACTIVE" | "PAST") || "UPCOMING",
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
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTicketTypeChange = (
    index: number,
    field: keyof TicketType,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      ticketTypes: prev.ticketTypes.map((ticket, i) =>
        i === index ? { ...ticket, [field]: value } : ticket
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
      const {
        image, // exclude temp field
        maxAttendees, // not in schema
        time, // not in schema
        ...rest
      } = formData;

      // Compose ISO date from date (YYYY-MM-DD) and optional time (HH:mm)
      let isoDate: string | undefined = undefined;
      if (rest.date) {
        const datePart = rest.date; // string 'YYYY-MM-DD'
        const timePart = (formData.time && formData.time.length >= 4) ? formData.time : "00:00";
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement de l'événement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              {/* <Button
                onClick={() => router.push("/admin/events")}
                variant="outline"
                className="mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux événements
              </Button> */}
              <h1 className="text-3xl font-bold text-gray-900">
                Modifier l'événement
              </h1>
              <p className="text-gray-600">ID: {params.id}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Informations générales
              </CardTitle>
              <CardDescription>
                Informations de base sur l'événement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Titre de l'événement *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Nom de l'événement"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="time">Heure *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="categoryId">Catégorie</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) =>
                      handleInputChange("categoryId", value)
                    }
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="status">Statut</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleInputChange(
                        "status",
                        value as "UPCOMING" | "ACTIVE" | "PAST"
                      )
                    }
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Description de l'événement"
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lieu */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Lieu de l'événement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Nom du lieu *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    placeholder="Ex: Palais des Congrès"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="maxAttendees">Capacité maximale</Label>
                  <Input
                    id="maxAttendees"
                    type="number"
                    value={formData.maxAttendees}
                    onChange={(e) =>
                      handleInputChange(
                        "maxAttendees",
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="Nombre maximum de participants"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="address">Adresse complète</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Adresse complète du lieu"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Types de billets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Types de billets
                </div>
                <Button
                  type="button"
                  onClick={addTicketType}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un type
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.ticketTypes.map((ticket, index) => (
                <div
                  key={ticket.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Type de billet #{index + 1}</h4>
                    <Button
                      type="button"
                      onClick={() => removeTicketType(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Nom du type</Label>
                      <Input
                        value={ticket.name}
                        onChange={(e) =>
                          handleTicketTypeChange(index, "name", e.target.value)
                        }
                        placeholder="Ex: Standard, VIP"
                      />
                    </div>

                    <div>
                      <Label>Prix (FCFA)</Label>
                      <Input
                        type="number"
                        value={ticket.price}
                        onChange={(e) =>
                          handleTicketTypeChange(
                            index,
                            "price",
                            parseInt(e.target.value) || 0
                          )
                        }
                        placeholder="Prix en FCFA"
                      />
                    </div>

                    <div>
                      <Label>Quantité</Label>
                      <Input
                        type="number"
                        value={ticket.quantity}
                        onChange={(e) =>
                          handleTicketTypeChange(
                            index,
                            "quantity",
                            parseInt(e.target.value) || 0
                          )
                        }
                        placeholder="Nombre de billets"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <Label>Description</Label>
                      <Input
                        value={ticket.description}
                        onChange={(e) =>
                          handleTicketTypeChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Description du type de billet"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {formData.ticketTypes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun type de billet configuré</p>
                  <p className="text-sm">
                    Cliquez sur "Ajouter un type" pour commencer
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ImageIcon className="mr-2 h-5 w-5" />
                Image de l'événement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Label>Image de l'événement</Label>
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
                  {(formData.image || formData.imageUrl) ? (
                    <div className="h-16 w-28 relative overflow-hidden rounded border">
                      <img
                        src={formData.image || formData.imageUrl || "/placeholder.svg"}
                        alt="Aperçu"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : null}
                </div>
                <p className="text-xs text-gray-500">
                  Vous pouvez téléverser une image ou fournir un lien ci-dessous.
                </p>
                <div>
                  <Label htmlFor="image">URL de l'image</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => {
                      const val = e.target.value
                      setFormData((prev) => ({ ...prev, image: val, imageUrl: val }))
                    }}
                    placeholder="https://... ou /uploads/xxx.jpg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/events")}
              disabled={saving}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder les modifications
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
