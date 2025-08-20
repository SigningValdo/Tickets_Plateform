"use client"

import type React from "react"
import { useQueryState } from 'nuqs'

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useQueryState("search", {
    defaultValue: "",
  })

  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex w-full">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          type="text"
          placeholder="Rechercher des événements, lieux, artistes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 py-6 rounded-l-md w-full border-r-0"
        />
      </div>
      <Button type="submit" className="bg-purple-600 hover:bg-purple-700 rounded-l-none px-6">
        Rechercher
      </Button>
    </form>
  )
}
