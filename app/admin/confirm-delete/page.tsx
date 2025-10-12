"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertTriangle, Trash2, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

type EntityType = 'event' | 'user' | 'ticket' | 'tickettype'

interface EntityInfo {
  type: EntityType
  id: string
  name: string
  details?: string
}

const entityConfig = {
  event: {
    title: 'Supprimer l\'événement',
    description: 'Cette action supprimera définitivement l\'événement et tous les billets associés.',
    warningText: 'Tous les billets vendus seront annulés et les participants seront notifiés.',
    redirectPath: '/admin/events'
  },
  user: {
    title: 'Supprimer l\'utilisateur',
    description: 'Cette action supprimera définitivement le compte utilisateur et toutes ses données.',
    warningText: 'L\'utilisateur perdra l\'accès à tous ses billets et données personnelles.',
    redirectPath: '/admin/users'
  },
  ticket: {
    title: 'Supprimer le billet',
    description: 'Cette action supprimera définitivement ce billet.',
    warningText: 'Le détenteur du billet sera notifié de l\'annulation.',
    redirectPath: '/admin/tickets'
  },
  tickettype: {
    title: 'Supprimer le type de billet',
    description: 'Cette action supprimera définitivement ce type de billet.',
    warningText: 'Tous les billets de ce type seront également supprimés.',
    redirectPath: '/admin/events'
  }
}

export default function ConfirmDeletePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [entityInfo, setEntityInfo] = useState<EntityInfo | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  useEffect(() => {
    const type = searchParams.get('type') as EntityType
    const id = searchParams.get('id')
    const name = searchParams.get('name')
    const details = searchParams.get('details')

    if (type && id && name) {
      setEntityInfo({ type, id, name, details: details || undefined })
    } else {
      // Rediriger si les paramètres sont manquants
      router.push('/admin/dashboard')
    }
  }, [searchParams, router])

  const handleDelete = async () => {
    if (!entityInfo || confirmText !== 'SUPPRIMER') {
      toast({
        title: "Erreur",
        description: "Veuillez taper 'SUPPRIMER' pour confirmer",
        variant: "destructive",
      })
      return
    }

    setIsDeleting(true)

    try {
      // Dans une implémentation réelle, nous appellerions une API pour supprimer l'entité
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Suppression réussie",
        description: `${entityInfo.name} a été supprimé avec succès`,
      })

      // Rediriger vers la page appropriée
      const config = entityConfig[entityInfo.type]
      router.push(config.redirectPath)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  if (!entityInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  const config = entityConfig[entityInfo.type]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <Link href="/admin/dashboard" className="inline-block mb-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-fanzone-orange rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900">E-Tickets Admin</span>
            </div>
          </Link>
          
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-red-500" />
          </div>
          
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            {config.title}
          </CardTitle>
          
          <CardDescription className="text-gray-600">
            {config.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-800 mb-2">Élément à supprimer</h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{entityInfo.name}</p>
                {entityInfo.details && (
                  <p className="text-sm text-gray-600">{entityInfo.details}</p>
                )}
              </div>
              <Badge variant="outline" className="text-xs">
                ID: {entityInfo.id}
              </Badge>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-800">Attention : Action irréversible</h4>
                <p className="text-sm text-red-700 mt-1">{config.warningText}</p>
                <ul className="text-sm text-red-700 mt-2 space-y-1">
                  <li>• Cette action ne peut pas être annulée</li>
                  <li>• Toutes les données associées seront perdues</li>
                  <li>• Les utilisateurs concernés seront notifiés</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Pour confirmer, tapez <span className="font-bold text-red-600">SUPPRIMER</span> ci-dessous :
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Tapez SUPPRIMER"
              disabled={isDeleting}
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3">
          <Button
            onClick={handleDelete}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            disabled={isDeleting || confirmText !== 'SUPPRIMER'}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suppression en cours...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer définitivement
              </>
            )}
          </Button>
          
          <Button
            onClick={handleCancel}
            variant="outline"
            className="w-full"
            disabled={isDeleting}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Annuler
          </Button>
        </CardFooter>

        <div className="text-center pb-6">
          <p className="text-sm text-gray-500">
            Besoin d'aide ?{" "}
            <Link href="/contact" className="text-fanzone-orange hover:text-purple-500">
              Contactez le support
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}