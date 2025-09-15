"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Menu,
  X,
  Home,
  Settings,
  LogOut,
  Search,
  Filter,
  Download,
  UserPlus,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE" | "BANNED";
  emailVerified: boolean;
  image: string | null;
  tickets?: Array<{ id: string }>;
  createdAt: string;
  updatedAt: string;
}

interface UsersResponse {
  users: User[];
  total: number;
  limit: number;
  page: number;
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { useToast } from "@/components/ui/use-toast";

export default function AdminUsersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtreRole, setFiltreRole] = useState<string>("all");
  const [filtreStatus, setFiltreStatus] = useState<string>("all");

  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Données réelles via API
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const router = useRouter();
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState<User | null>(null);

  // Fonction pour mettre à jour le statut d'un utilisateur
  const updateUserStatus = async (
    userId: string,
    newStatus: "ACTIVE" | "INACTIVE" | "BANNED"
  ) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Échec de la mise à jour du statut");
      }

      // Mettre à jour l'état local
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      // Vous pourriez vouloir afficher une notification d'erreur ici
    }
  };

  // Debounce pour la recherche
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Réinitialiser à la première page lors du changement de filtre
  useEffect(() => {
    setPage(1);
  }, [filtreRole, filtreStatus, debouncedQuery]);

  useEffect(() => {
    setLoading(true);
    const params = [
      `page=${page}`,
      `limit=${limit}`,
      filtreRole !== "all" ? `role=${filtreRole.toUpperCase()}` : null,
      filtreStatus !== "all" ? `status=${filtreStatus.toUpperCase()}` : null,
      debouncedQuery ? `q=${encodeURIComponent(debouncedQuery)}` : null,
    ]
      .filter(Boolean)
      .join("&");

    fetch(`/api/admin/users?${params}`)
      .then(async (res) => {
        if (!res.ok) {
          const error = await res.text();
          throw new Error(
            error || "Erreur lors du chargement des utilisateurs"
          );
        }
        return res.json() as Promise<UsersResponse>;
      })
      .then((data: UsersResponse) => {
        setUsers(data.users);
        setTotal(data.total);
        setLimit(data.limit);
        setError(null);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setError(err.message || "Erreur lors du chargement des utilisateurs");
      })
      .finally(() => setLoading(false));
  }, [page, limit, filtreRole, filtreStatus, debouncedQuery]);

  async function handleConfirmDelete() {
    if (!toDelete) return;
    try {
      const res = await fetch(`/api/admin/users/${toDelete.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      setUsers(prev => prev.filter(u => u.id !== toDelete.id));
      toast({ title: "Utilisateur supprimé" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Une erreur est survenue";
      toast({ title: "Erreur", description: message, variant: "destructive" });
    } finally {
      setDeleteOpen(false);
      setToDelete(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-gray-600 text-lg">
          Chargement des utilisateurs...
        </span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-red-600 text-lg">{error}</span>
      </div>
    );
  }

  return (
    <div>
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
            <p className="text-gray-500">
              Consultez et gérez tous les utilisateurs de la plateforme
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => {
                router.push("/admin/users/create");
              }}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Ajouter un utilisateur
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrer par rôle
                </label>
                <Select value={filtreRole} onValueChange={setFiltreRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les rôles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les rôles</SelectItem>
                    <SelectItem value="ADMIN">Administrateur</SelectItem>
                    <SelectItem value="USER">Utilisateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrer par statut
                </label>
                <Select value={filtreStatus} onValueChange={setFiltreStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="ACTIVE">Actif</SelectItem>
                    <SelectItem value="INACTIVE">Inactif</SelectItem>
                    <SelectItem value="BANNED">Banni</SelectItem>
                  </SelectContent>
                </Select>
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

        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="ACTIVE">Actifs</TabsTrigger>
            <TabsTrigger value="INACTIVE">Inactifs</TabsTrigger>
            <TabsTrigger value="BANNED">Bannis</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="bg-white rounded-md shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Utilisateur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rôle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Inscrit le
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Billets
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {user.image ? (
                              <img
                                src={user.image}
                                alt={user.name}
                                className="h-10 w-10 rounded-full mr-3"
                              />
                            ) : (
                              <div className="h-10 w-10 flex-shrink-0 mr-3 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="font-medium text-purple-600">
                                  {user.name
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")}
                                </span>
                              </div>
                            )}
                            <div className="font-medium">{user.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                          {user.emailVerified && (
                            <span className="ml-2 text-xs text-green-600">
                              ✓ Vérifié
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={
                              user.role === "ADMIN" ? "default" : "outline"
                            }
                            className={
                              user.role === "ADMIN"
                                ? "bg-purple-100 text-purple-800"
                                : ""
                            }
                          >
                            {user.role === "ADMIN"
                              ? "Administrateur"
                              : "Utilisateur"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline" className="bg-gray-50">
                            {user.tickets?.length || 0} billet
                            {user.tickets?.length !== 1 ? "s" : ""}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant="outline"
                            className={
                              user.status === "ACTIVE"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : user.status === "INACTIVE"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                : "bg-red-100 text-red-800 border-red-200"
                            }
                          >
                            {user.status === "ACTIVE"
                              ? "Actif"
                              : user.status === "INACTIVE"
                              ? "Inactif"
                              : "Banni"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <span className="sr-only">Ouvrir le menu</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-4 w-4"
                                >
                                  <circle cx="12" cy="12" r="1" />
                                  <circle cx="12" cy="5" r="1" />
                                  <circle cx="12" cy="19" r="1" />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/admin/users/${user.id}/edit`}
                                  className="w-full cursor-pointer"
                                >
                                  Modifier
                                </Link>
                              </DropdownMenuItem>
                              {user.status === "INACTIVE" ? (
                                <DropdownMenuItem
                                  className="text-green-600 cursor-pointer"
                                  onClick={() =>
                                    updateUserStatus(user.id, "ACTIVE")
                                  }
                                >
                                  Activer
                                </DropdownMenuItem>
                              ) : user.status === "BANNED" ? (
                                <DropdownMenuItem
                                  className="text-green-600 cursor-pointer"
                                  onClick={() =>
                                    updateUserStatus(user.id, "ACTIVE")
                                  }
                                >
                                  Débannir
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  className="text-yellow-600 cursor-pointer"
                                  onClick={() =>
                                    updateUserStatus(user.id, "INACTIVE")
                                  }
                                >
                                  Désactiver
                                </DropdownMenuItem>
                              )}
                              {user.status !== "BANNED" && (
                                <DropdownMenuItem
                                  className="text-red-600 cursor-pointer"
                                  onClick={() =>
                                    updateUserStatus(user.id, "BANNED")
                                  }
                                >
                                  Bannir
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-red-600 cursor-pointer"
                                onClick={() => { setToDelete(user); setDeleteOpen(true); }}
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
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Affichage de 5 utilisateurs sur 5
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              Précédent
            </Button>
            <Button variant="outline" size="sm" disabled>
              Suivant
            </Button>
          </div>
        </div>
      </main>
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Supprimer l'utilisateur"
        description={`Voulez-vous supprimer "${toDelete?.name ?? ""}" ? Cette action est irréversible.`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
