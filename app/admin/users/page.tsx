"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Filter,
  Download,
  UserPlus,
  Loader2,
  MoreVertical,
  Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { useToast } from "@/components/ui/use-toast";

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

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ACTIVE: "bg-green/10 text-green",
    INACTIVE: "bg-yellow/10 text-yellow",
    BANNED: "bg-red/10 text-red",
  };
  const labels: Record<string, string> = {
    ACTIVE: "Actif",
    INACTIVE: "Inactif",
    BANNED: "Banni",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full ${map[status] || "bg-gris4/50 text-gris2"}`}
    >
      {labels[status] || status}
    </span>
  );
}

function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full ${
        role === "ADMIN"
          ? "bg-purple-100 text-purple-700"
          : "bg-bg text-gris2 border border-gris4"
      }`}
    >
      {role === "ADMIN" ? "Administrateur" : "Utilisateur"}
    </span>
  );
}

function UserRow({
  user,
  formatDate,
  onStatusChange,
  onDelete,
}: {
  user: User;
  formatDate: (d: string) => string;
  onStatusChange: (id: string, status: "ACTIVE" | "INACTIVE" | "BANNED") => void;
  onDelete: (user: User) => void;
}) {
  return (
    <tr className="border-b border-gris4/30 last:border-0 hover:bg-bg/50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div className="h-9 w-9 flex-shrink-0 bg-green/10 rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold text-green">
                {user.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </span>
            </div>
          )}
          <span className="text-sm font-medium text-navy">{user.name}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gris2 whitespace-nowrap">
        {user.email}
        {user.emailVerified && (
          <span className="ml-1.5 text-xs text-green">✓</span>
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <RoleBadge role={user.role} />
      </td>
      <td className="px-4 py-3 text-sm text-gris2 whitespace-nowrap">
        {formatDate(user.createdAt)}
      </td>
      <td className="px-4 py-3 text-sm text-navy whitespace-nowrap">
        {user.tickets?.length || 0} billet
        {(user.tickets?.length || 0) !== 1 ? "s" : ""}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <StatusBadge status={user.status} />
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1.5 rounded-lg hover:bg-bg transition-colors">
              <MoreVertical className="h-4 w-4 text-gris2" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/users/${user.id}/edit`}>Modifier</Link>
            </DropdownMenuItem>
            {user.status === "INACTIVE" || user.status === "BANNED" ? (
              <DropdownMenuItem
                className="text-green"
                onClick={() => onStatusChange(user.id, "ACTIVE")}
              >
                {user.status === "BANNED" ? "Débannir" : "Activer"}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className="text-yellow"
                onClick={() => onStatusChange(user.id, "INACTIVE")}
              >
                Désactiver
              </DropdownMenuItem>
            )}
            {user.status !== "BANNED" && (
              <DropdownMenuItem
                className="text-red"
                onClick={() => onStatusChange(user.id, "BANNED")}
              >
                Bannir
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="text-red"
              onClick={() => onDelete(user)}
            >
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

function UserTable({
  users,
  formatDate,
  onStatusChange,
  onDelete,
}: {
  users: User[];
  formatDate: (d: string) => string;
  onStatusChange: (id: string, status: "ACTIVE" | "INACTIVE" | "BANNED") => void;
  onDelete: (user: User) => void;
}) {
  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-10 w-10 text-gris3 mx-auto mb-3" />
        <p className="text-sm text-gris2">Aucun utilisateur trouvé</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gris4/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gris2 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gris2 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gris2 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gris2 uppercase tracking-wider">
                Inscrit le
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gris2 uppercase tracking-wider">
                Billets
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gris2 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gris2 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                formatDate={formatDate}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const [filtreRole, setFiltreRole] = useState<string>("all");
  const [filtreStatus, setFiltreStatus] = useState<string>("all");

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const router = useRouter();
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState<User | null>(null);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const updateUserStatus = async (
    userId: string,
    newStatus: "ACTIVE" | "INACTIVE" | "BANNED"
  ) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Échec de la mise à jour du statut");
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
      toast({ title: "Statut mis à jour" });
    } catch {
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du statut",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    setPage(1);
  }, [filtreRole, filtreStatus]);

  useEffect(() => {
    setLoading(true);
    const params = [
      `page=${page}`,
      `limit=${limit}`,
      filtreRole !== "all" ? `role=${filtreRole.toUpperCase()}` : null,
      filtreStatus !== "all" ? `status=${filtreStatus.toUpperCase()}` : null,
    ]
      .filter(Boolean)
      .join("&");

    fetch(`/api/admin/users?${params}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json() as Promise<UsersResponse>;
      })
      .then((data) => {
        setUsers(data.users);
        setTotal(data.total);
        setLimit(data.limit);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Erreur lors du chargement des utilisateurs");
      })
      .finally(() => setLoading(false));
  }, [page, limit, filtreRole, filtreStatus]);

  async function handleConfirmDelete() {
    if (!toDelete) return;
    try {
      const res = await fetch(`/api/admin/users/${toDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await res.text());
      setUsers((prev) => prev.filter((u) => u.id !== toDelete.id));
      toast({ title: "Utilisateur supprimé" });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Une erreur est survenue";
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
    } finally {
      setDeleteOpen(false);
      setToDelete(null);
    }
  }

  const filteredUsers = (status?: string) => {
    if (!status || status === "all") return users;
    return users.filter((u) => u.status === status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-green mx-auto mb-4" />
          <p className="text-gris2 text-sm">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">
            Gestion des utilisateurs
          </h1>
          <p className="text-gris2 text-sm mt-1">
            Consultez et gérez tous les utilisateurs de la plateforme
          </p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gris4 text-navy text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4" />
            Exporter
          </button>
          <button
            onClick={() => router.push("/admin/users/create")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green text-white text-sm font-medium rounded-xl hover:bg-green/90 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            Ajouter un utilisateur
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-5">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-navy mb-1.5">
              Filtrer par rôle
            </label>
            <Select value={filtreRole} onValueChange={setFiltreRole}>
              <SelectTrigger className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20">
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
            <label className="block text-sm font-medium text-navy mb-1.5">
              Filtrer par statut
            </label>
            <Select value={filtreStatus} onValueChange={setFiltreStatus}>
              <SelectTrigger className="rounded-xl border-gris4 bg-bg text-sm focus:border-green focus:ring-1 focus:ring-green/20">
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
            <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gris4 text-navy text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4" />
              Appliquer les filtres
            </button>
          </div>
        </div>
      </div>

      {/* Tabs + User list */}
      <Tabs defaultValue="all">
        <TabsList className="bg-white rounded-xl p-1 border border-gris4">
          <TabsTrigger
            value="all"
            className="rounded-lg text-sm data-[state=active]:bg-green/10 data-[state=active]:text-green data-[state=active]:shadow-none"
          >
            Tous
          </TabsTrigger>
          <TabsTrigger
            value="ACTIVE"
            className="rounded-lg text-sm data-[state=active]:bg-green/10 data-[state=active]:text-green data-[state=active]:shadow-none"
          >
            Actifs
          </TabsTrigger>
          <TabsTrigger
            value="INACTIVE"
            className="rounded-lg text-sm data-[state=active]:bg-green/10 data-[state=active]:text-green data-[state=active]:shadow-none"
          >
            Inactifs
          </TabsTrigger>
          <TabsTrigger
            value="BANNED"
            className="rounded-lg text-sm data-[state=active]:bg-green/10 data-[state=active]:text-green data-[state=active]:shadow-none"
          >
            Bannis
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="all">
            <UserTable
              users={filteredUsers("all")}
              formatDate={formatDate}
              onStatusChange={updateUserStatus}
              onDelete={(u) => { setToDelete(u); setDeleteOpen(true); }}
            />
          </TabsContent>
          <TabsContent value="ACTIVE">
            <UserTable
              users={filteredUsers("ACTIVE")}
              formatDate={formatDate}
              onStatusChange={updateUserStatus}
              onDelete={(u) => { setToDelete(u); setDeleteOpen(true); }}
            />
          </TabsContent>
          <TabsContent value="INACTIVE">
            <UserTable
              users={filteredUsers("INACTIVE")}
              formatDate={formatDate}
              onStatusChange={updateUserStatus}
              onDelete={(u) => { setToDelete(u); setDeleteOpen(true); }}
            />
          </TabsContent>
          <TabsContent value="BANNED">
            <UserTable
              users={filteredUsers("BANNED")}
              formatDate={formatDate}
              onStatusChange={updateUserStatus}
              onDelete={(u) => { setToDelete(u); setDeleteOpen(true); }}
            />
          </TabsContent>
        </div>
      </Tabs>

      {/* Pagination */}
      <div className="flex justify-between items-center bg-white rounded-2xl p-4">
        <span className="text-sm text-gris2">
          Affichage de {users.length} utilisateurs sur {total}
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
            disabled={page * limit >= total}
            onClick={() => setPage((p) => p + 1)}
          >
            Suivant
          </button>
        </div>
      </div>

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
