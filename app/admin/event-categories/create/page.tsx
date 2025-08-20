"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  description: z.string().optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "La couleur doit être au format hexadécimal (ex: #ff0000)",
  }).optional(),
})

export default function CreateEventCategoryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      color: "#3b82f6", // Default blue color
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await fetch("/api/admin/event-categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Une erreur est survenue")
      }
      return response.json()
    },
    onSuccess: () => {
      toast({
        title: "Catégorie créée",
        description: "La catégorie a été créée avec succès.",
      })
      queryClient.invalidateQueries({ queryKey: ["event-categories"] })
      router.push("/admin/event-categories")
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création de la catégorie.",
        variant: "destructive",
      })
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link href="/admin/event-categories" className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste des catégories
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Nouvelle catégorie</h1>
        <p className="text-muted-foreground">
          Créez une nouvelle catégorie pour organiser vos événements
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détails de la catégorie</CardTitle>
          <CardDescription>
            Remplissez les informations de la catégorie. Les champs marqués d'un astérisque (*) sont obligatoires.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de la catégorie *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Musique, Sport, Conférence..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Le nom qui sera affiché pour cette catégorie.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Couleur</FormLabel>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded-md border" 
                          style={{ backgroundColor: field.value }}
                        />
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <span>#</span>
                            <Input 
                              className="w-24" 
                              placeholder="3b82f6" 
                              value={field.value?.replace('#', '')} 
                              onChange={(e) => field.onChange('#' + e.target.value)}
                            />
                          </div>
                        </FormControl>
                      </div>
                      <FormDescription>
                        La couleur associée à cette catégorie (format hexadécimal).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez cette catégorie..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Une brève description de cette catégorie (optionnelle).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/event-categories")}
                  disabled={mutation.isPending}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <>
                      <div className="h-4 w-4 animate-spin mr-2" />
                      Création...
                    </>
                  ) : (
                    "Créer la catégorie"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
