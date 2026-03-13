"use client";

import { useRouter, usePathname } from "next/navigation";
import { Calendar as CalendarIcon, MapPin, RotateCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryState } from "nuqs";

const dateOptions = [
  { value: "all", label: "Toutes les dates" },
  { value: "today", label: "Aujourd'hui" },
  { value: "weekend", label: "Ce weekend" },
  { value: "month", label: "Ce mois" },
  { value: "custom", label: "Date spécifique" },
];

const locations = [
  { id: "all", name: "Toutes les villes" },
  { id: "douala", name: "Douala" },
  { id: "yaounde", name: "Yaoundé" },
  { id: "bafoussam", name: "Bafoussam" },
  { id: "bamenda", name: "Bamenda" },
  { id: "garoua", name: "Garoua" },
  { id: "maroua", name: "Maroua" },
  { id: "bertoua", name: "Bertoua" },
  { id: "ngaoundere", name: "Ngaoundéré" },
  { id: "ebolowa", name: "Ebolowa" },
  { id: "kribi", name: "Kribi" },
  { id: "limbe", name: "Limbé" },
  { id: "buea", name: "Buea" },
];

export function EventFilters() {
  const router = useRouter();
  const pathname = usePathname();

  const [date, setDate] = useQueryState("date", {
    defaultValue: "",
  });
  const [location, setLocation] = useQueryState("location", {
    defaultValue: "all",
  });
  const [dateFilter, setDateFilter] = useQueryState("dateFilter", {
    defaultValue: "all",
  });

  const resetFilters = () => {
    setDate("");
    setLocation("all");
    setDateFilter("all");
    router.push(pathname);
  };

  const handleDateFilterChange = (value: string) => {
    const today = new Date();

    switch (value) {
      case "today":
        setDate(today.toISOString().split("T")[0]);
        break;
      case "weekend": {
        const dayOfWeek = today.getDay();
        const daysUntilWeekend = dayOfWeek === 6 ? 0 : 5 - dayOfWeek;
        const weekend = new Date(today);
        weekend.setDate(today.getDate() + daysUntilWeekend);
        setDate(weekend.toISOString().split("T")[0]);
        break;
      }
      case "month": {
        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 1);
        setDate(nextMonth.toISOString().split("T")[0]);
        break;
      }
      case "custom":
        break;
      default:
        setDate("");
    }

    setDateFilter(value as any);
  };

  const hasActiveFilters = dateFilter !== "all" || location !== "all";

  return (
    <div className="space-y-6">
      {/* Date filter */}
      <div>
        <h3 className="text-sm font-semibold text-black mb-3 flex items-center gap-2">
          <div className="w-7 h-7 bg-green/10 rounded-2xl flex items-center justify-center">
            <CalendarIcon className="h-3.5 w-3.5 text-green" />
          </div>
          Date
        </h3>
        <div className="flex flex-wrap gap-2">
          {dateOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleDateFilterChange(option.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                dateFilter === option.value
                  ? "bg-green text-white"
                  : "bg-bg text-gris2 hover:bg-green/10 hover:text-green"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {dateFilter === "custom" && (
          <div className="mt-3 relative">
            <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gris2 pointer-events-none" />
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-11 pl-11 pr-4 rounded-xl border border-gris4 bg-bg text-sm text-black placeholder:text-gris2 focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors"
            />
          </div>
        )}
      </div>

      {/* Location filter */}
      <div>
        <h3 className="text-sm font-semibold text-black mb-3 flex items-center gap-2">
          <div className="w-7 h-7 rounded-2xl bg-green/10 flex items-center justify-center">
            <MapPin className="h-3.5 w-3.5 text-green" />
          </div>
          Lieu
        </h3>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-green">
            <SelectValue placeholder="Sélectionner une ville" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-white">
            {locations.map((loc) => (
              <SelectItem
                key={loc.id}
                value={loc.id}
                className="rounded-lg text-sm"
              >
                {loc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reset button */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-red hover:bg-red/5 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );
}
