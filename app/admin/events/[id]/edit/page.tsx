"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Save, Loader2, Calendar, MapPin, DollarSign, Users, Image as ImageIcon, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface TicketType {
  id: string
  name: string
  price: number
  quantity: number
  description: string
}

interface EventFormData {
  title: string
  description: string
  date: string
  time: string
  location: string
  address: string
  category: string
  image: string
  maxAttendees: number
  ticketTypes: TicketType[]
  status: 'draft' | 'published' | 'cancelled'
}

const categories = [
  'Musique',
  'Sport',
  'Théâtre',
  'Conférence',
  'Festival',
  'Exposition',
  'Cinéma',
  'Danse',
  'Autre'
]

export default function EditEventPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    address: '',
    category: '',
    image: '',
    maxAttendees: 100,
    ticketTypes: [],
    status: 'draft'
  })

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Dans une implémentation réelle, nous appellerions une API pour récupérer l'événement
        await new Promise((resolve) => setTimeout(resolve, 1000))
        
        // Données simulées
        const mockEvent: EventFormData = {
          title: "Concert de Jazz - Miles Davis Tribute",
          description: "Une soirée exceptionnelle dédiée au légendaire Miles Davis avec les meilleurs musiciens de jazz du Cameroun. Venez découvrir ou redécouvrir les plus grands standards du jazz dans une ambiance intimiste et chaleureuse.",
          date: "2024-02-15",
          time: "20:00",
          location: "Palais des Congrès",
          address: "Avenue Kennedy, Yaoundé, Cameroun",
          category: "Musique",
          image: "/api/placeholder/600/400",
          maxAttendees: 500,
          ticketTypes: [
            {
              id: '1',
              name: 'Standard',
              price: 15000,
              quantity: 300,
              description: 'Accès standard à l\'événement'
            },
            {
              id: '2',
              name: 'VIP',
              price: 25000,
              quantity: 100,
              description: 'Accès VIP avec boissons incluses'
            },
            {
              id: '3',
              name: 'Premium',
              price: 35000,
              quantity: 50,
              description: 'Accès premium avec meet & greet'
            }
          ],
          status: 'published'
        }
        
        setFormData(mockEvent)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger l'événement",
          variant: "destructive",
        })
        router.push('/admin/events')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchEvent()
    }
  }, [params.id, router, toast])

  const handleInputChange = (field: keyof EventFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleTicketTypeChange = (index: number, field: keyof TicketType, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      ticketTypes: prev.ticketTypes.map((ticket, i) => 
        i === index ? { ...ticket, [field]: value } : ticket
      )
    }))
  }

  const addTicketType = () => {
    const newTicketType: TicketType = {
      id: Date.now().toString(),
      name: '',
      price: 0,
      quantity: 0,
      description: ''
    }
    setFormData(prev => ({
      ...prev,
      ticketTypes: [...prev.ticketTypes, newTicketType]
    }))
  }

  const removeTicketType = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ticketTypes: prev.ticketTypes.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.date || !formData.time || !formData.location) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    if (formData.ticketTypes.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez ajouter au moins un type de billet",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      // Dans une implémentation réelle, nous appellerions une API pour sauvegarder l'événement
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Événement mis à jour",
        description: "L'événement a été mis à jour avec succès",
      })

      router.push('/admin/events')
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement de l'événement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin/dashboard" className="inline-block mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900">E-Tickets Admin</span>
            </div>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <Button
                onClick={() => router.push('/admin/events')}
                variant="outline"
                className="mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux événements
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">Modifier l'événement</h1>
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
                    onChange={(e) => handleInputChange('title', e.target.value)}
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
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="time">Heure *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value as 'draft' | 'published' | 'cancelled')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Brouillon</SelectItem>
                      <SelectItem value="published">Publié</SelectItem>
                      <SelectItem value="cancelled">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
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
                    onChange={(e) => handleInputChange('location', e.target.value)}
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
                    onChange={(e) => handleInputChange('maxAttendees', parseInt(e.target.value) || 0)}
                    placeholder="Nombre maximum de participants"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="address">Adresse complète</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
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
                <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
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
                        onChange={(e) => handleTicketTypeChange(index, 'name', e.target.value)}
                        placeholder="Ex: Standard, VIP"
                      />
                    </div>
                    
                    <div>
                      <Label>Prix (FCFA)</Label>
                      <Input
                        type="number"
                        value={ticket.price}
                        onChange={(e) => handleTicketTypeChange(index, 'price', parseInt(e.target.value) || 0)}
                        placeholder="Prix en FCFA"
                      />
                    </div>
                    
                    <div>
                      <Label>Quantité</Label>
                      <Input
                        type="number"
                        value={ticket.quantity}
                        onChange={(e) => handleTicketTypeChange(index, 'quantity', parseInt(e.target.value) || 0)}
                        placeholder="Nombre de billets"
                      />
                    </div>
                    
                    <div className="md:col-span-3">
                      <Label>Description</Label>
                      <Input
                        value={ticket.description}
                        onChange={(e) => handleTicketTypeChange(index, 'description', e.target.value)}
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
                  <p className="text-sm">Cliquez sur "Ajouter un type" pour commencer</p>
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
              <div>
                <Label htmlFor="image">URL de l'image</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="URL de l'image de l'événement"
                />
                {formData.image && (
                  <div className="mt-4">
                    <img
                      src={formData.image}
                      alt="Aperçu"
                      className="w-full max-w-md h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/events')}
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
  )
}