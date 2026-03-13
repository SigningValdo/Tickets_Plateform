"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Loader2, Calendar, Tag, User } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface Event {
  id: string
  title: string
  date: string
  location: string
}

interface TicketType {
  id: string
  name: string
  price: number
  description: string
}

interface UserData {
  id: string
  name: string
  email: string
}

interface TicketFormData {
  eventId: string
  userId: string
  ticketTypeId: string
  quantity: number
  totalPrice: number
  status: "pending" | "confirmed" | "cancelled" | "used"
  paymentStatus: "pending" | "paid" | "refunded" | "failed"
  paymentMethod: "card" | "mobile_money" | "cash" | "bank_transfer" | "free"
  notes: string
  sendConfirmationEmail: boolean
}

export default function CreateTicketPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState<Event[]>([])
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([])
  const [users, setUsers] = useState<UserData[]>([])
  const [selectedTicketType, setSelectedTicketType] =
    useState<TicketType | null>(null)

  const [formData, setFormData] = useState<TicketFormData>({
    eventId: "",
    userId: "",
    ticketTypeId: "",
    quantity: 1,
    totalPrice: 0,
    status: "confirmed",
    paymentStatus: "paid",
    paymentMethod: "card",
    notes: "",
    sendConfirmationEmail: true,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockEvents: Event[] = [
          {
            id: "1",
            title: "Concert de Jazz - Miles Davis Tribute",
            date: "2024-02-15",
            location: "Palais des Congrès",
          },
          {
            id: "2",
            title: "Festival de Musique Africaine",
            date: "2024-03-20",
            location: "Stade Ahmadou Ahidjo",
          },
          {
            id: "3",
            title: "Conférence Tech Innovate",
            date: "2024-04-10",
            location: "Centre de Conférences",
          },
        ]

        const mockUsers: UserData[] = [
          { id: "1", name: "Jean Dupont", email: "jean.dupont@email.com" },
          { id: "2", name: "Marie Koné", email: "marie.kone@email.com" },
          { id: "3", name: "Paul Biya", email: "paul.biya@email.com" },
        ]

        setEvents(mockEvents)
        setUsers(mockUsers)

        const eventId = searchParams.get("event_id")
        const userId = searchParams.get("user_id")

        if (eventId) {
          setFormData((prev) => ({ ...prev, eventId }))
          await fetchTicketTypes(eventId)
        }

        if (userId) {
          setFormData((prev) => ({ ...prev, userId }))
        }
      } catch {
        toast({
          title: "Erreur",
          description: "Impossible de charger les données",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchParams, toast])

  const fetchTicketTypes = async (eventId: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const mockTicketTypes: TicketType[] = [
        {
          id: "1",
          name: "Standard",
          price: 15000,
          description: "Accès standard à l'événement",
        },
        {
          id: "2",
          name: "VIP",
          price: 25000,
          description: "Accès VIP avec boissons incluses",
        },
        {
          id: "3",
          name: "Premium",
          price: 35000,
          description: "Accès premium avec meet & greet",
        },
      ]

      setTicketTypes(mockTicketTypes)
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de charger les types de billets",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (
    field: keyof TicketFormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleEventChange = async (eventId: string) => {
    handleInputChange("eventId", eventId)
    handleInputChange("ticketTypeId", "")
    setSelectedTicketType(null)
    await fetchTicketTypes(eventId)
  }

  const handleTicketTypeChange = (ticketTypeId: string) => {
    handleInputChange("ticketTypeId", ticketTypeId)

    const selectedType = ticketTypes.find((type) => type.id === ticketTypeId)
    setSelectedTicketType(selectedType || null)

    if (selectedType) {
      const totalPrice = selectedType.price * formData.quantity
      handleInputChange("totalPrice", totalPrice)
    }
  }

  const handleQuantityChange = (quantity: number) => {
    handleInputChange("quantity", quantity)

    if (selectedTicketType) {
      const totalPrice = selectedTicketType.price * quantity
      handleInputChange("totalPrice", totalPrice)
    }
  }

  const validateForm = () => {
    if (
      !formData.eventId ||
      !formData.userId ||
      !formData.ticketTypeId ||
      formData.quantity <= 0
    ) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSaving(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Ticket créé",
        description: `Le ticket a été créé avec succès${formData.sendConfirmationEmail ? " et un email de confirmation a été envoyé." : "."}`,
      })

      router.push("/admin/tickets")
    } catch {
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la création du ticket",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-green mx-auto mb-4" />
          <p className="text-gris2 text-sm">Chargement des données...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/tickets"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gris2 border border-gris4 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Retour
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-navy">Créer un ticket</h1>
            <p className="text-gris2 text-sm mt-0.5">
              Ajouter un nouveau ticket manuellement
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Événement et type de billet */}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-green" />
            <h3 className="text-sm font-semibold text-navy">
              Événement et type de billet
            </h3>
          </div>
          <p className="text-xs text-gris2 mb-4">
            Sélectionnez l&apos;événement et le type de billet
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">
                Événement *
              </label>
              <Select
                value={formData.eventId}
                onValueChange={handleEventChange}
              >
                <SelectTrigger className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20">
                  <SelectValue placeholder="Sélectionner un événement" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.title} -{" "}
                      {new Date(event.date).toLocaleDateString("fr-FR")} -{" "}
                      {event.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">
                Type de billet *
              </label>
              <Select
                value={formData.ticketTypeId}
                onValueChange={handleTicketTypeChange}
                disabled={!formData.eventId || ticketTypes.length === 0}
              >
                <SelectTrigger className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20">
                  <SelectValue placeholder="Sélectionner un type de billet" />
                </SelectTrigger>
                <SelectContent>
                  {ticketTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name} - {formatCurrency(type.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.eventId && ticketTypes.length === 0 && (
                <p className="text-xs text-gris2 mt-1">
                  Aucun type de billet disponible pour cet événement
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">
                Quantité *
              </label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) =>
                  handleQuantityChange(parseInt(e.target.value) || 1)
                }
                disabled={!formData.ticketTypeId}
                className="w-full h-10 px-4 rounded-xl border border-gris4 bg-bg text-sm text-navy focus:outline-none focus:border-green focus:ring-1 focus:ring-green/20 disabled:opacity-50"
              />
            </div>

            {selectedTicketType && (
              <div className="p-4 bg-bg rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-navy">
                    Prix unitaire:
                  </span>
                  <span className="text-sm text-navy">
                    {formatCurrency(selectedTicketType.price)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-medium text-navy">
                    Quantité:
                  </span>
                  <span className="text-sm text-navy">{formData.quantity}</span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gris4/50">
                  <span className="font-bold text-navy">Total:</span>
                  <span className="font-bold text-lg text-green">
                    {formatCurrency(formData.totalPrice)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Utilisateur */}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-green" />
            <h3 className="text-sm font-semibold text-navy">Utilisateur</h3>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">
              Utilisateur *
            </label>
            <Select
              value={formData.userId}
              onValueChange={(value) => handleInputChange("userId", value)}
            >
              <SelectTrigger className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20">
                <SelectValue placeholder="Sélectionner un utilisateur" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} - {user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Statut et paiement */}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="h-5 w-5 text-green" />
            <h3 className="text-sm font-semibold text-navy">
              Statut et paiement
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">
                Statut du ticket
              </label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  handleInputChange("status", value as TicketFormData["status"])
                }
              >
                <SelectTrigger className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="confirmed">Confirmé</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                  <SelectItem value="used">Utilisé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">
                Statut du paiement
              </label>
              <Select
                value={formData.paymentStatus}
                onValueChange={(value) =>
                  handleInputChange(
                    "paymentStatus",
                    value as TicketFormData["paymentStatus"]
                  )
                }
              >
                <SelectTrigger className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="paid">Payé</SelectItem>
                  <SelectItem value="refunded">Remboursé</SelectItem>
                  <SelectItem value="failed">Échoué</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">
                Méthode de paiement
              </label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) =>
                  handleInputChange(
                    "paymentMethod",
                    value as TicketFormData["paymentMethod"]
                  )
                }
              >
                <SelectTrigger className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Carte bancaire</SelectItem>
                  <SelectItem value="mobile_money">Mobile Money</SelectItem>
                  <SelectItem value="cash">Espèces</SelectItem>
                  <SelectItem value="bank_transfer">
                    Virement bancaire
                  </SelectItem>
                  <SelectItem value="free">Gratuit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Notes et options */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-navy mb-4">
            Notes et options
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">
                Notes (optionnel)
              </label>
              <input
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Notes ou commentaires sur ce ticket"
                className="w-full h-10 px-4 rounded-xl border border-gris4 bg-bg text-sm text-navy placeholder:text-gris3 focus:outline-none focus:border-green focus:ring-1 focus:ring-green/20"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.sendConfirmationEmail}
                onChange={(e) =>
                  handleInputChange(
                    "sendConfirmationEmail",
                    e.target.checked
                  )
                }
                className="h-4 w-4 rounded border-gris4 text-green focus:ring-green/20"
              />
              <span className="text-sm text-navy">
                Envoyer un email de confirmation
              </span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/tickets")}
            disabled={saving}
            className="px-5 py-2.5 border border-gris4 text-navy text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green text-white text-sm font-medium rounded-xl hover:bg-green/90 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Création...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Créer le ticket
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
