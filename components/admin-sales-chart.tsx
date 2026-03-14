"use client"

import { useEffect, useRef } from "react"

interface SalesDataPoint {
  date: string
  total: number
}

interface AdminSalesChartProps {
  data: SalesDataPoint[]
}

export function AdminSalesChart({ data }: AdminSalesChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const sales = data.map((d) => d.total)
    const labels = data.map((d) => {
      const date = new Date(d.date)
      return `${date.getDate()}/${date.getMonth() + 1}`
    })

    canvas.width = canvas.offsetWidth
    canvas.height = 300

    const margin = { top: 20, right: 20, bottom: 30, left: 60 }
    const width = canvas.width - margin.left - margin.right
    const height = canvas.height - margin.top - margin.bottom

    const xScale = width / (sales.length - 1 || 1)
    const yMax = Math.max(...sales, 1) * 1.1
    const yScale = height / yMax

    // Y axis
    ctx.beginPath()
    ctx.moveTo(margin.left, margin.top)
    ctx.lineTo(margin.left, height + margin.top)
    ctx.strokeStyle = "#e5e7eb"
    ctx.stroke()

    // Horizontal grid lines and Y labels
    const yTickCount = 5
    for (let i = 0; i <= yTickCount; i++) {
      const y = margin.top + height - (i * height) / yTickCount
      const value = Math.round((i * yMax) / yTickCount)

      ctx.beginPath()
      ctx.moveTo(margin.left, y)
      ctx.lineTo(canvas.width - margin.right, y)
      ctx.strokeStyle = "#e5e7eb"
      ctx.stroke()

      ctx.fillStyle = "#6b7280"
      ctx.font = "10px Arial"
      ctx.textAlign = "right"
      const label = value >= 1000 ? `${(value / 1000).toFixed(0)}k` : `${value}`
      ctx.fillText(label, margin.left - 5, y + 3)
    }

    // X axis
    ctx.beginPath()
    ctx.moveTo(margin.left, height + margin.top)
    ctx.lineTo(canvas.width - margin.right, height + margin.top)
    ctx.strokeStyle = "#e5e7eb"
    ctx.stroke()

    // X labels
    const xTickCount = Math.min(6, labels.length)
    for (let i = 0; i < xTickCount; i++) {
      const idx = Math.round((i * (labels.length - 1)) / (xTickCount - 1 || 1))
      const x = margin.left + idx * xScale

      ctx.fillStyle = "#6b7280"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.fillText(labels[idx], x, height + margin.top + 15)
    }

    // Line
    ctx.beginPath()
    ctx.moveTo(margin.left, height + margin.top - sales[0] * yScale)

    for (let i = 1; i < sales.length; i++) {
      const x = margin.left + i * xScale
      const y = height + margin.top - sales[i] * yScale
      ctx.lineTo(x, y)
    }

    ctx.strokeStyle = "#008D50"
    ctx.lineWidth = 2
    ctx.stroke()

    // Area fill
    ctx.lineTo(margin.left + (sales.length - 1) * xScale, height + margin.top)
    ctx.lineTo(margin.left, height + margin.top)
    ctx.closePath()
    ctx.fillStyle = "rgba(0, 141, 80, 0.08)"
    ctx.fill()

    // Points
    for (let i = 0; i < sales.length; i++) {
      const x = margin.left + i * xScale
      const y = height + margin.top - sales[i] * yScale

      ctx.beginPath()
      ctx.arc(x, y, 3, 0, 2 * Math.PI)
      ctx.fillStyle = "#008D50"
      ctx.fill()
      ctx.strokeStyle = "white"
      ctx.lineWidth = 1
      ctx.stroke()
    }
  }, [data])

  return (
    <div className="w-full h-[300px]">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}
