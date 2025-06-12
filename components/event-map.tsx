"use client"

import { useEffect, useRef } from "react"

interface EventMapProps {
  location: string
}

export default function EventMap({ location }: EventMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Dans une implémentation réelle, nous utiliserions une API de cartographie comme Google Maps ou Mapbox
    // Pour cet exemple, nous affichons simplement un placeholder
    if (mapRef.current) {
      const canvas = document.createElement("canvas")
      canvas.width = mapRef.current.clientWidth
      canvas.height = mapRef.current.clientHeight
      mapRef.current.appendChild(canvas)

      const ctx = canvas.getContext("2d")
      if (ctx) {
        // Dessiner un fond de carte simple
        ctx.fillStyle = "#e5e7eb"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Dessiner des routes
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2

        // Route horizontale
        ctx.beginPath()
        ctx.moveTo(0, canvas.height / 2)
        ctx.lineTo(canvas.width, canvas.height / 2)
        ctx.stroke()

        // Routes verticales
        for (let i = 1; i < 4; i++) {
          ctx.beginPath()
          ctx.moveTo(canvas.width * (i / 4), 0)
          ctx.lineTo(canvas.width * (i / 4), canvas.height)
          ctx.stroke()
        }

        // Marqueur de position
        ctx.fillStyle = "#7c3aed"
        ctx.beginPath()
        ctx.arc(canvas.width / 2, canvas.height / 2, 10, 0, 2 * Math.PI)
        ctx.fill()

        // Texte du lieu
        ctx.fillStyle = "#000000"
        ctx.font = "14px Arial"
        ctx.textAlign = "center"
        ctx.fillText(location, canvas.width / 2, canvas.height / 2 + 30)
      }
    }
  }, [location])

  return (
    <div ref={mapRef} className="w-full h-full bg-gray-200 rounded-md">
      <div className="flex items-center justify-center h-full text-gray-500">Carte de localisation pour {location}</div>
    </div>
  )
}
