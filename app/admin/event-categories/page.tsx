"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { PlusCircle, Filter, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
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
    <div>
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Gestion des catégories</h1>
            <p className="text-gray-500">Créez, modifiez et gérez les catégories d'événements</p>
          </div>
          <Link href="/admin/event-categories/create">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <PlusCircle className="h-4 w-4 mr-2" />
              Créer une catégorie
            </Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrer par catégorie
                </label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    <SelectItem value="concerts">Concerts</SelectItem>
                    <SelectItem value="conferences">Conférences</SelectItem>
                    <SelectItem value="expositions">Expositions</SelectItem>
                    <SelectItem value="festivals">Festivals</SelectItem>
                    <SelectItem value="theatre">Théâtre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrer par date
                </label>
                <Input type="date" className="w-full" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
              </div>
              <div className="w-full md:w-1/3 flex justify-end">
                <Button variant="outline" className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Appliquer les filtres
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardContent className="p-0 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[180px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      <div className="inline-flex items-center text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Chargement...
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && error && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-red-500 py-6">
                      Erreur de chargement
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && !error && paginated.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6">
                      Aucune catégorie.
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && !error && paginated.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="font-medium">{cat.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {cat.description || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/event-categories/${cat.id}/edit`}>
                          <Button size="sm" variant="outline">Éditer</Button>
                        </Link>
                        <Button size="sm" variant="destructive" onClick={() => { setToDelete(cat); setDeleteOpen(true) }}>
                          Supprimer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {total > 0
              ? `Affichage de ${paginated.length} catégories sur ${total}`
              : "Aucune catégorie"}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Suivant
            </Button>
          </div>
        </div>
      </main>
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
