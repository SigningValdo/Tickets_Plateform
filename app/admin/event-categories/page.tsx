"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { PlusCircle, Loader2, MoreVertical, Tag } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog"

interface EventCategory {
  id: string
  name: string
  description?: string
}

const fetchCategories = async (): Promise<EventCategory[]> => {
  const res = await fetch("/api/admin/event-categories")
  if (!res.ok) throw new Error("Failed to fetch categories")
  return res.json()
}

export default function AdminEventCategoriesPage() {
  const [page, setPage] = useState(1)
  const pageSize = 10
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [toDelete, setToDelete] = useState<EventCategory | null>(null)

  const { data: categories, isLoading, error } = useQuery<EventCategory[]>({
    queryKey: ["event-categories"],
    queryFn: fetchCategories,
  })

  const handleConfirmDelete = async () => {
    if (!toDelete) return
    const res = await fetch(`/api/admin/event-categories/${toDelete.id}`, { method: "DELETE" })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      toast({ title: "Erreur", description: err.error || err.message || "Suppression impossible.", variant: "destructive" })
      setDeleteOpen(false)
      setToDelete(null)
      return
    }
    toast({ title: "Catégorie supprimée" })
    queryClient.invalidateQueries({ queryKey: ["event-categories"] })
    setDeleteOpen(false)
    setToDelete(null)
  }

  const filtered = categories || []
  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize
  const paginated = filtered.slice(start, start + pageSize)

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Gestion des catégories</h1>
          <p className="text-gris2 text-sm mt-1">
            Créez, modifiez et gérez les catégories d&apos;événements
          </p>
        </div>
        <Link href="/admin/event-categories/create">
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-green text-white text-sm font-medium rounded-xl hover:bg-green/90 transition-colors">
            <PlusCircle className="h-4 w-4" />
            Créer une catégorie
          </button>
        </Link>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-green mx-auto mb-4" />
            <p className="text-gris2 text-sm">Chargement...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red text-sm">Erreur de chargement</p>
        </div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-16">
          <Tag className="h-10 w-10 text-gris3 mx-auto mb-3" />
          <p className="text-sm text-gris2">Aucune catégorie.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gris4/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gris2 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gris2 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gris2 uppercase tracking-wider w-[100px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((cat) => (
                  <tr
                    key={cat.id}
                    className="border-b border-gris4/30 last:border-0 hover:bg-bg/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-navy font-medium">
                      {cat.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gris2">
                      {cat.description || "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1.5 rounded-lg hover:bg-bg transition-colors">
                            <MoreVertical className="h-4 w-4 text-gris2" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/event-categories/${cat.id}/edit`}>
                              Éditer
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red"
                            onClick={() => {
                              setToDelete(cat)
                              setDeleteOpen(true)
                            }}
                          >
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center bg-white rounded-2xl p-4">
        <span className="text-sm text-gris2">
          {total > 0
            ? `Affichage de ${paginated.length} catégories sur ${total}`
            : "Aucune catégorie"}
        </span>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 text-sm border border-gris4 text-gris2 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Précédent
          </button>
          <button
            className="px-4 py-2 text-sm border border-gris4 text-gris2 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Suivant
          </button>
        </div>
      </div>

      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Supprimer la catégorie"
        description={`Voulez-vous supprimer "${toDelete?.name ?? ""}" ? Cette action est irréversible.`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
