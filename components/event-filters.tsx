"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Calendar, MapPin } from "lucide-react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Données simulées pour les filtres
const categories = [
  { id: "all", name: "Toutes les catégories" },
  { id: "concerts", name: "Concerts" },
  { id: "theatre", name: "Théâtre" },
  { id: "conferences", name: "Conférences" },
  { id: "food", name: "Gastronomie" },
  { id: "shows", name: "Spectacles" },
  { id: "cinema", name: "Cinéma" },
  { id: "workshops", name: "Ateliers" },
  { id: "festivals", name: "Festivals" },
]

const locations = [
  { id: "all", name: "Toutes les villes" },
  { id: "abidjan", name: "Abidjan" },
  { id: "dakar", name: "Dakar" },
  { id: "lome", name: "Lomé" },
  { id: "rabat", name: "Rabat" },
  { id: "douala", name: "Douala" },
  { id: "bamako", name: "Bamako" },
  { id: "tunis", name: "Tunis" },
]

interface EventFiltersProps {
  selectedCategory?: string
  selectedDate?: string
  selectedLocation?: string
}

export function EventFilters({ selectedCategory = "", selectedDate = "", selectedLocation = "" }: EventFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()

  const [category, setCategory] = useState(selectedCategory || "all")
  const [date, setDate] = useState(selectedDate || "")
  const [location, setLocation] = useState(selectedLocation || "all")
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "weekend" | "month" | "custom">(
    selectedDate ? "custom" : "all",
  )

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (category && category !== "all") {
      params.set("category", category)
    }

    if (location && location !== "all") {
      params.set("location", location)
    }

    if (date) {
      params.set("date", date)
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  const resetFilters = () => {
    setCategory("all")
    setDate("")
    setLocation("all")
    setDateFilter("all")
    router.push(pathname)
  }

  useEffect(() => {
    if (selectedCategory) setCategory(selectedCategory)
    if (selectedLocation) setLocation(selectedLocation)
    if (selectedDate) {
      setDate(selectedDate)
      setDateFilter("custom")
    }
  }, [selectedCategory, selectedDate, selectedLocation])

  const handleDateFilterChange = (value: string) => {
    const today = new Date()

    switch (value) {
      case "today":
        setDate(today.toISOString().split("T")[0])
        break
      case "weekend":
        const dayOfWeek = today.getDay()
        const daysUntilWeekend = dayOfWeek === 6 ? 0 : 5 - dayOfWeek
        const weekend = new Date(today)
        weekend.setDate(today.getDate() + daysUntilWeekend)
        setDate(weekend.toISOString().split("T")[0])
        break
      case "month":
        const nextMonth = new Date(today)
        nextMonth.setMonth(today.getMonth() + 1)
        setDate(nextMonth.toISOString().split("T")[0])
        break
      case "custom":
        // Keep the current date or set to empty
        break
      default:
        setDate("")
    }

    setDateFilter(value as any)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3 flex items-center">
          <span className="mr-2">Catégories</span>
        </h3>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-medium mb-3 flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Date</span>
        </h3>
        <RadioGroup value={dateFilter} onValueChange={handleDateFilterChange} className="mb-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all">Toutes les dates</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="today" id="today" />
            <Label htmlFor="today">Aujourd'hui</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weekend" id="weekend" />
            <Label htmlFor="weekend">Ce weekend</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="month" id="month" />
            <Label htmlFor="month">Ce mois</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="custom" id="custom" />
            <Label htmlFor="custom">Date spécifique</Label>
          </div>
        </RadioGroup>

        {dateFilter === "custom" && (
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full" />
        )}
      </div>

      <div>
        <h3 className="font-medium mb-3 flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          <span>Lieu</span>
        </h3>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une ville" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((loc) => (
              <SelectItem key={loc.id} value={loc.id}>
                {loc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 pt-4">
        <Button onClick={applyFilters} className="w-full bg-purple-600 hover:bg-purple-700">
          Appliquer les filtres
        </Button>
        <Button onClick={resetFilters} variant="outline" className="w-full">
          Réinitialiser
        </Button>
      </div>
    </div>
  )
}
