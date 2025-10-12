"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Save, Loader2, Ticket, User, Calendar, Tag, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
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

interface User {
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
  status: 'pending' | 'confirmed' | 'cancelled' | 'used'
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed'
  paymentMethod: 'card' | 'mobile_money' | 'cash' | 'bank_transfer' | 'free'
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
  const [users, setUsers] = useState<User[]>([])
  const [selectedTicketType, setSelectedTicketType] = useState<TicketType | null>(null)
  
  const [formData, setFormData] = useState<TicketFormData>({
    eventId: '',
    userId: '',
    ticketTypeId: '',
    quantity: 1,
    totalPrice: 0,
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    notes: '',
    sendConfirmationEmail: true
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Dans une implémentation réelle, nous appellerions des API pour récupérer les données
        await new Promise((resolve) => setTimeout(resolve, 1000))
        
        // Données simulées
        const mockEvents: Event[] = [
          { id: '1', title: 'Concert de Jazz - Miles Davis Tribute', date: '2024-02-15', location: 'Palais des Congrès' },
          { id: '2', title: 'Festival de Musique Africaine', date: '2024-03-20', location: 'Stade Ahmadou Ahidjo' },
          { id: '3', title: 'Conférence Tech Innovate', date: '2024-04-10', location: 'Centre de Conférences' }
        ]
        
        const mockUsers: User[] = [
          { id: '1', name: 'Jean Dupont', email: 'jean.dupont@email.com' },
          { id: '2', name: 'Marie Koné', email: 'marie.kone@email.com' },
          { id: '3', name: 'Paul Biya', email: 'paul.biya@email.com' }
        ]
        
        setEvents(mockEvents)
        setUsers(mockUsers)
        
        // Pré-remplir l'événement et l'utilisateur si fournis dans l'URL
        const eventId = searchParams.get('event_id')
        const userId = searchParams.get('user_id')
        
        if (eventId) {
          setFormData(prev => ({ ...prev, eventId }))
          await fetchTicketTypes(eventId)
        }
        
        if (userId) {
          setFormData(prev => ({ ...prev, userId }))
        }
      } catch (error) {
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
      // Dans une implémentation réelle, nous appellerions une API pour récupérer les types de billets
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      // Données simulées
      const mockTicketTypes: TicketType[] = [
        { id: '1', name: 'Standard', price: 15000, description: 'Accès standard à l\'événement' },
        { id: '2', name: 'VIP', price: 25000, description: 'Accès VIP avec boissons incluses' },
        { id: '3', name: 'Premium', price: 35000, description: 'Accès premium avec meet & greet' }
      ]
      
      setTicketTypes(mockTicketTypes)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les types de billets",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (field: keyof TicketFormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleEventChange = async (eventId: string) => {
    handleInputChange('eventId', eventId)
    handleInputChange('ticketTypeId', '')
    setSelectedTicketType(null)
    await fetchTicketTypes(eventId)
  }

  const handleTicketTypeChange = (ticketTypeId: string) => {
    handleInputChange('ticketTypeId', ticketTypeId)
    
    const selectedType = ticketTypes.find(type => type.id === ticketTypeId)
    setSelectedTicketType(selectedType || null)
    
    if (selectedType) {
      const totalPrice = selectedType.price * formData.quantity
      handleInputChange('totalPrice', totalPrice)
    }
  }

  const handleQuantityChange = (quantity: number) => {
    handleInputChange('quantity', quantity)
    
    if (selectedTicketType) {
      const totalPrice = selectedTicketType.price * quantity
      handleInputChange('totalPrice', totalPrice)
    }
  }

  const validateForm = () => {
    if (!formData.eventId || !formData.userId || !formData.ticketTypeId || formData.quantity <= 0) {
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
      // Dans une implémentation réelle, nous appellerions une API pour créer le ticket
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Ticket créé",
        description: `Le ticket a été créé avec succès${formData.sendConfirmationEmail ? ' et un email de confirmation a été envoyé.' : '.'}`
      })

      router.push('/admin/tickets')
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du ticket",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement des données...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin/dashboard" className="inline-block mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-fanzone-orange rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900">E-Tickets Admin</span>
            </div>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <Button
                onClick={() => router.push('/admin/tickets')}
                variant="outline"
                className="mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux tickets
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">Créer un ticket</h1>
              <p className="text-gray-600">Ajouter un nouveau ticket manuellement</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Événement et type de billet */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Événement et type de billet
              </CardTitle>
              <CardDescription>
                Sélectionnez l'événement et le type de billet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="eventId">Événement *</Label>
                <Select value={formData.eventId} onValueChange={handleEventChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un événement" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.title} - {new Date(event.date).toLocaleDateString('fr-FR')} - {event.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="ticketTypeId">Type de billet *</Label>
                <Select 
                  value={formData.ticketTypeId} 
                  onValueChange={handleTicketTypeChange}
                  disabled={!formData.eventId || ticketTypes.length === 0}
                >
                  <SelectTrigger>
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
                  <p className="text-sm text-gray-500 mt-1">Aucun type de billet disponible pour cet événement</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="quantity">Quantité *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  disabled={!formData.ticketTypeId}
                />
              </div>
              
              {selectedTicketType && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Prix unitaire:</span>
                    <span>{formatCurrency(selectedTicketType.price)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium">Quantité:</span>
                    <span>{formData.quantity}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-lg">{formatCurrency(formData.totalPrice)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Utilisateur */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Utilisateur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="userId">Utilisateur *</Label>
                <Select value={formData.userId} onValueChange={(value) => handleInputChange('userId', value)}>
                  <SelectTrigger>
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
            </CardContent>
          </Card>

          {/* Statut et paiement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="mr-2 h-5 w-5" />
                Statut et paiement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Statut du ticket</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value as 'pending' | 'confirmed' | 'cancelled' | 'used')}>
                  <SelectTrigger>
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
                <Label htmlFor="paymentStatus">Statut du paiement</Label>
                <Select value={formData.paymentStatus} onValueChange={(value) => handleInputChange('paymentStatus', value as 'pending' | 'paid' | 'refunded' | 'failed')}>
                  <SelectTrigger>
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
                <Label htmlFor="paymentMethod">Méthode de paiement</Label>
                <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value as 'card' | 'mobile_money' | 'cash' | 'bank_transfer' | 'free')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Carte bancaire</SelectItem>
                    <SelectItem value="mobile_money">Mobile Money</SelectItem>
                    <SelectItem value="cash">Espèces</SelectItem>
                    <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                    <SelectItem value="free">Gratuit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notes et options */}
          <Card>
            <CardHeader>
              <CardTitle>Notes et options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notes">Notes (optionnel)</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Notes ou commentaires sur ce ticket"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sendConfirmationEmail"
                  checked={formData.sendConfirmationEmail}
                  onCheckedChange={(checked) => handleInputChange('sendConfirmationEmail', checked as boolean)}
                />
                <Label htmlFor="sendConfirmationEmail">Envoyer un email de confirmation</Label>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/tickets')}
              disabled={saving}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-fanzone-orange hover:bg-fanzone-orange/90"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Créer le ticket
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}