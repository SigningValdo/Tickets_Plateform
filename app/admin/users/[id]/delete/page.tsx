"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Trash2, Loader2, User, AlertTriangle, Calendar, Activity, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

interface UserData {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: 'user' | 'admin' | 'organizer'
  isActive: boolean
  emailVerified: boolean
  createdAt: string
  lastLogin: string
  ticketsPurchased: number
  eventsCreated: number
  totalSpent: number
}

export default function DeleteUserPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Dans une implémentation réelle, nous appellerions une API pour récupérer l'utilisateur
        await new Promise((resolve) => setTimeout(resolve, 1000))
        
        // Données simulées
        const mockUser: UserData = {
          id: params.id as string,
          firstName: "Jean",
          lastName: "Dupont",
          email: "jean.dupont@email.com",
          phone: "+237 677 123 456",
          role: "user",
          isActive: true,
          emailVerified: true,
          createdAt: "2024-01-15T10:30:00Z",
          lastLogin: "2024-02-10T14:22:00Z",
          ticketsPurchased: 12,
          eventsCreated: 0,
          totalSpent: 180000
        }
        
        setUserData(mockUser)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger l'utilisateur",
          variant: "destructive",
        })
        router.push('/admin/users')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchUser()
    }
  }, [params.id, router, toast])

  const handleDelete = async () => {
    if (!userData) return
    
    if (confirmText !== 'SUPPRIMER') {
      toast({
        title: "Erreur",
        description: "Veuillez taper 'SUPPRIMER' pour confirmer",
        variant: "destructive",
      })
      return
    }

    setDeleting(true)

    try {
      // Dans une implémentation réelle, nous appellerions une API pour supprimer l'utilisateur
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Utilisateur supprimé",
        description: `L'utilisateur ${userData.firstName} ${userData.lastName} a été supprimé avec succès`
      })

      router.push('/admin/users')
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
          <p>Chargement de l'utilisateur...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p>Utilisateur non trouvé</p>
          <Button onClick={() => router.push('/admin/users')} className="mt-4">
            Retour aux utilisateurs
          </Button>
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
              <div className="w-8 h-8 bg-fanzone-orange rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900">E-Tickets Admin</span>
            </div>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <Button
                onClick={() => router.push('/admin/users')}
                variant="outline"
                className="mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux utilisateurs
              </Button>
              <h1 className="text-3xl font-bold text-gray-900 text-red-600">Supprimer l'utilisateur</h1>
              <p className="text-gray-600">Cette action est irréversible</p>
            </div>
          </div>
        </div>

        {/* Alerte de danger */}
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Attention :</strong> La suppression de cet utilisateur est définitive et irréversible. 
            Toutes les données associées (historique des achats, événements créés, etc.) seront également supprimées.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations utilisateur */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Informations utilisateur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-gray-600">Nom complet</Label>
                  <p className="font-medium">{userData.firstName} {userData.lastName}</p>
                </div>
                
                <div>
                  <Label className="text-sm text-gray-600">Email</Label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="font-medium">{userData.email}</p>
                  </div>
                </div>
                
                {userData.phone && (
                  <div>
                    <Label className="text-sm text-gray-600">Téléphone</Label>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <p className="font-medium">{userData.phone}</p>
                    </div>
                  </div>
                )}
                
                <div>
                  <Label className="text-sm text-gray-600">Rôle</Label>
                  <div className="mt-1">
                    <Badge variant={userData.role === 'admin' ? 'destructive' : userData.role === 'organizer' ? 'default' : 'secondary'}>
                      {userData.role === 'admin' ? 'Administrateur' : userData.role === 'organizer' ? 'Organisateur' : 'Utilisateur'}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-600">Statut</Label>
                  <Badge variant={userData.isActive ? "default" : "secondary"}>
                    {userData.isActive ? "Actif" : "Inactif"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-600">Email vérifié</Label>
                  <Badge variant={userData.emailVerified ? "default" : "destructive"}>
                    {userData.emailVerified ? "Vérifié" : "Non vérifié"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques et dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Statistiques et activité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{userData.ticketsPurchased}</p>
                  <p className="text-sm text-blue-800">Billets achetés</p>
                </div>
                
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{userData.eventsCreated}</p>
                  <p className="text-sm text-green-800">Événements créés</p>
                </div>
              </div>
              
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-xl font-bold text-fanzone-orange">{formatCurrency(userData.totalSpent)}</p>
                <p className="text-sm text-purple-800">Total dépensé</p>
              </div>
              
              <div className="space-y-3 pt-4 border-t">
                <div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Calendar className="mr-2 h-4 w-4" />
                    Créé le
                  </div>
                  <p className="text-sm font-medium">{formatDate(userData.createdAt)}</p>
                </div>
                
                <div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Activity className="mr-2 h-4 w-4" />
                    Dernière connexion
                  </div>
                  <p className="text-sm font-medium">{formatDate(userData.lastLogin)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Confirmation de suppression */}
        <Card className="mt-6 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Confirmer la suppression</CardTitle>
            <CardDescription>
              Pour confirmer la suppression, tapez <strong>SUPPRIMER</strong> dans le champ ci-dessous
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="confirmText">Tapez "SUPPRIMER" pour confirmer</Label>
              <Input
                id="confirmText"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="SUPPRIMER"
                className="border-red-200 focus:border-red-400"
              />
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/users')}
                disabled={deleting}
              >
                Annuler
              </Button>
              <Button
                onClick={handleDelete}
                variant="destructive"
                disabled={deleting || confirmText !== 'SUPPRIMER'}
              >
                {deleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer définitivement
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liens utiles */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Besoin d'aide ? <Link href="/contact" className="text-fanzone-orange hover:underline">Contactez le support</Link>
          </p>
        </div>
      </div>
    </div>
  )
}