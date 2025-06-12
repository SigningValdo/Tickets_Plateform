"use client"

import { useEffect, useRef } from "react"

export function AdminSalesChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Dans une implémentation réelle, nous utiliserions une bibliothèque comme Chart.js
    // Pour cet exemple, nous dessinons un graphique simple

    // Données simulées pour les 30 derniers jours
    const days = Array.from({ length: 30 }, (_, i) => i + 1)
    const sales = [
      120000, 150000, 130000, 180000, 200000, 190000, 210000, 230000, 200000, 180000, 190000, 220000, 240000, 230000,
      250000, 270000, 260000, 280000, 300000, 290000, 310000, 330000, 320000, 340000, 360000, 350000, 370000, 390000,
      380000, 400000,
    ]

    // Définir les dimensions du canvas
    canvas.width = canvas.offsetWidth
    canvas.height = 300

    // Définir les marges
    const margin = { top: 20, right: 20, bottom: 30, left: 50 }
    const width = canvas.width - margin.left - margin.right
    const height = canvas.height - margin.top - margin.bottom

    // Calculer les échelles
    const xScale = width / (days.length - 1)
    const yMax = Math.max(...sales) * 1.1
    const yScale = height / yMax

    // Dessiner l'axe des y
    ctx.beginPath()
    ctx.moveTo(margin.left, margin.top)
    ctx.lineTo(margin.left, height + margin.top)
    ctx.strokeStyle = "#e5e7eb"
    ctx.stroke()

    // Dessiner les lignes horizontales et les étiquettes de l'axe des y
    const yTickCount = 5
    for (let i = 0; i <= yTickCount; i++) {
      const y = margin.top + height - (i * height) / yTickCount
      const value = Math.round((i * yMax) / yTickCount / 1000) * 1000

      ctx.beginPath()
      ctx.moveTo(margin.left, y)
      ctx.lineTo(canvas.width - margin.right, y)
      ctx.strokeStyle = "#e5e7eb"
      ctx.stroke()

      ctx.fillStyle = "#6b7280"
      ctx.font = "10px Arial"
      ctx.textAlign = "right"
      ctx.fillText(`${(value / 1000).toFixed(0)}k`, margin.left - 5, y + 3)
    }

    // Dessiner l'axe des x
    ctx.beginPath()
    ctx.moveTo(margin.left, height + margin.top)
    ctx.lineTo(canvas.width - margin.right, height + margin.top)
    ctx.strokeStyle = "#e5e7eb"
    ctx.stroke()

    // Dessiner les étiquettes de l'axe des x (jours)
    const xTickCount = 6
    for (let i = 0; i < xTickCount; i++) {
      const x = margin.left + (i * width) / (xTickCount - 1)
      const day = Math.round((i * (days.length - 1)) / (xTickCount - 1)) + 1

      ctx.fillStyle = "#6b7280"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.fillText(`Jour ${day}`, x, height + margin.top + 15)
    }

    // Dessiner la ligne du graphique
    ctx.beginPath()
    ctx.moveTo(margin.left, height + margin.top - sales[0] * yScale)

    for (let i = 1; i < days.length; i++) {
      const x = margin.left + i * xScale
      const y = height + margin.top - sales[i] * yScale
      ctx.lineTo(x, y)
    }

    ctx.strokeStyle = "#7c3aed"
    ctx.lineWidth = 2
    ctx.stroke()

    // Dessiner la zone sous la courbe
    ctx.lineTo(margin.left + (days.length - 1) * xScale, height + margin.top)
    ctx.lineTo(margin.left, height + margin.top)
    ctx.closePath()
    ctx.fillStyle = "rgba(124, 58, 237, 0.1)"
    ctx.fill()

    // Dessiner les points sur la ligne
    for (let i = 0; i < days.length; i++) {
      const x = margin.left + i * xScale
      const y = height + margin.top - sales[i] * yScale

      ctx.beginPath()
      ctx.arc(x, y, 3, 0, 2 * Math.PI)
      ctx.fillStyle = "#7c3aed"
      ctx.fill()
      ctx.strokeStyle = "white"
      ctx.lineWidth = 1
      ctx.stroke()
    }
  }, [])

  return (
    <div className="w-full h-[300px]">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}
