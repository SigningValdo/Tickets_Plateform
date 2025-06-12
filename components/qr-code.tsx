"use client"

import { useEffect, useRef } from "react"

interface QRCodeProps {
  value: string
  size?: number
}

export default function QRCode({ value, size = 200 }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Dans une implémentation réelle, nous utiliserions une bibliothèque comme qrcode.js
    // Pour cet exemple, nous dessinons un QR code simulé

    // Définir la taille du canvas
    canvas.width = size
    canvas.height = size

    // Effacer le canvas
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, size, size)

    // Dessiner un cadre
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, size, 10)
    ctx.fillRect(0, 0, 10, size)
    ctx.fillRect(size - 10, 0, 10, size)
    ctx.fillRect(0, size - 10, size, 10)

    // Dessiner les carrés de positionnement
    ctx.fillRect(20, 20, 40, 40)
    ctx.fillRect(size - 60, 20, 40, 40)
    ctx.fillRect(20, size - 60, 40, 40)

    // Dessiner les carrés blancs à l'intérieur
    ctx.fillStyle = "white"
    ctx.fillRect(30, 30, 20, 20)
    ctx.fillRect(size - 50, 30, 20, 20)
    ctx.fillRect(30, size - 50, 20, 20)

    // Dessiner un motif de QR code aléatoire
    ctx.fillStyle = "black"
    const cellSize = 10
    const margin = 70
    const gridSize = (size - 2 * margin) / cellSize

    // Utiliser la valeur pour générer un motif déterministe
    const seed = value.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        // Utiliser une fonction pseudo-aléatoire basée sur la position et la valeur
        const shouldFill = (i * 3 + j * 5 + seed) % 5 < 2

        if (shouldFill) {
          ctx.fillRect(margin + i * cellSize, margin + j * cellSize, cellSize, cellSize)
        }
      }
    }
  }, [value, size])

  return <canvas ref={canvasRef} width={size} height={size} className="max-w-full h-auto" />
}
