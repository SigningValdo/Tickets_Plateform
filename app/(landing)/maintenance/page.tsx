"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Settings, Clock, AlertTriangle, RefreshCw, Mail, Twitter, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MaintenanceInfo {
  title: string
  description: string
  estimatedDuration: string
  startTime: string
  endTime?: string
  reason: string
  affectedServices: string[]
  status: 'scheduled' | 'ongoing' | 'extended'
}

export default function MaintenancePage() {
  const [maintenanceInfo] = useState<MaintenanceInfo>({
    title: "Maintenance programmée",
    description: "Nous effectuons actuellement une maintenance de nos serveurs pour améliorer les performances et la sécurité de la plateforme.",
    estimatedDuration: "2 heures",
    startTime: "2024-01-15T02:00:00Z",
    endTime: "2024-01-15T04:00:00Z",
    reason: "Mise à jour de sécurité et optimisation des performances",
    affectedServices: ["Achat de billets", "Connexion utilisateur", "Paiements", "Notifications"],
    status: 'ongoing'
  })

  const [currentTime, setCurrentTime] = useState(new Date())
  const [timeRemaining, setTimeRemaining] = useState<string>('')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (maintenanceInfo.endTime) {
      const endTime = new Date(maintenanceInfo.endTime)
      const now = new Date()
      const diff = endTime.getTime() - now.getTime()

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`)
      } else {
        setTimeRemaining('Bientôt terminé')
      }
    }
  }, [currentTime, maintenanceInfo.endTime])

  const handleRefresh = () => {
    window.location.reload()
  }

  const getStatusBadge = () => {
    switch (maintenanceInfo.status) {
      case 'scheduled':
        return <Badge className="bg-blue-600">Programmée</Badge>
      case 'ongoing':
        return <Badge className="bg-orange-600">En cours</Badge>
      case 'extended':
        return <Badge className="bg-red-600">Prolongée</Badge>
      default:
        return <Badge variant="outline">Inconnue</Badge>
    }
  }

  const startTime = new Date(maintenanceInfo.startTime)
  const endTime = maintenanceInfo.endTime ? new Date(maintenanceInfo.endTime) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mb-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900">E-Tickets</span>
            </div>
          </Link>
          
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Settings className="h-16 w-16 text-blue-600 animate-spin" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-600 rounded-full opacity-20"></div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mb-4">
            {getStatusBadge()}
          </div>
          
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
            {maintenanceInfo.title}
          </CardTitle>
          
          <CardDescription className="text-lg text-gray-600">
            {maintenanceInfo.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Temps restant */}
          {timeRemaining && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h4 className="text-lg font-medium text-blue-800 mb-2">Temps restant estimé</h4>
              <div className="text-2xl font-bold text-blue-900">{timeRemaining}</div>
            </div>
          )}

          {/* Informations de maintenance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Début de la maintenance</h4>
              <p className="text-gray-900">
                {startTime.toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-sm text-gray-600">
                {startTime.toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Fin prévue</h4>
              {endTime ? (
                <>
                  <p className="text-gray-900">
                    {endTime.toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {endTime.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </>
              ) : (
                <p className="text-gray-600">À déterminer</p>
              )}
            </div>
          </div>

          {/* Raison de la maintenance */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">Raison de la maintenance</h4>
            <p className="text-yellow-700">{maintenanceInfo.reason}</p>
          </div>

          {/* Services affectés */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-orange-800 mb-2">Services temporairement indisponibles</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  {maintenanceInfo.affectedServices.map((service, index) => (
                    <li key={index}>• {service}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Que faire pendant la maintenance */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-green-800 mb-2">Que pouvez-vous faire ?</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Consulter les événements (lecture seule)</li>
              <li>• Préparer vos achats pour après la maintenance</li>
              <li>• Nous suivre sur les réseaux sociaux pour les mises à jour</li>
              <li>• Contacter notre support pour les urgences</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            onClick={handleRefresh}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser la page
          </Button>
          
          <div className="flex space-x-3 w-full">
            <Link href="/events" className="flex-1">
              <Button variant="outline" className="w-full">
                Voir les événements
              </Button>
            </Link>
            
            <Link href="/contact" className="flex-1">
              <Button variant="outline" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Support
              </Button>
            </Link>
          </div>

          {/* Réseaux sociaux */}
          <div className="text-center pt-4 border-t border-gray-200 w-full">
            <p className="text-sm text-gray-600 mb-3">Suivez-nous pour les mises à jour en temps réel</p>
            <div className="flex justify-center space-x-4">
              <a href="#" className="text-blue-600 hover:text-blue-500">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-500">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="mailto:support@e-tickets.cm" className="text-blue-600 hover:text-blue-500">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}