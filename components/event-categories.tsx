import Link from "next/link"
import { Music, Theater, Briefcase, Utensils, Mic, Film, Users, Ticket } from "lucide-react"

const categories = [
  { name: "Concerts", icon: <Music className="h-6 w-6" />, slug: "concerts" },
  { name: "Théâtre", icon: <Theater className="h-6 w-6" />, slug: "theatre" },
  { name: "Conférences", icon: <Briefcase className="h-6 w-6" />, slug: "conferences" },
  { name: "Gastronomie", icon: <Utensils className="h-6 w-6" />, slug: "food" },
  { name: "Spectacles", icon: <Mic className="h-6 w-6" />, slug: "shows" },
  { name: "Cinéma", icon: <Film className="h-6 w-6" />, slug: "cinema" },
  { name: "Ateliers", icon: <Users className="h-6 w-6" />, slug: "workshops" },
  { name: "Festivals", icon: <Ticket className="h-6 w-6" />, slug: "festivals" },
]

export function EventCategories() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/events?category=${category.slug}`}
          className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="bg-purple-100 p-3 rounded-full mb-3 text-purple-600">{category.icon}</div>
          <span className="text-sm font-medium text-gray-700">{category.name}</span>
        </Link>
      ))}
    </div>
  )
}
