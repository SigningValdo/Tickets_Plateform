"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, CreditCard, Smartphone, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { useForm } from "react-hook-form"

// Données simulées pour les événements
const events = [
  {
    id: "1",
    title: "Festival de Jazz",
    image: "/placeholder.svg?height=400&width=600",
    date: "15 Juin 2024",
    time: "19:00 - 23:00",
    location: "Palais de la Culture, Abidjan",
    ticketTypes: [
      { id: "standard", name: "Standard", price: 15000 },
      { id: "vip", name: "VIP", price: 30000 },
      { id: "premium", name: "Premium", price: 50000 },
    ],
  },
  // Autres événements...
]

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("orange")
  const [event, setEvent] = useState<any>(null)
  const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>({})
  const [totalPrice, setTotalPrice] = useState(0)
  const [reservationExpiry, setReservationExpiry] = useState<Date | null>(null)
  const [timeLeft, setTimeLeft] = useState("")

  const form = useForm({
    defaultValues: {
      phoneNumber: "",
    },
  })

  useEffect(() => {
    const eventId = searchParams.get("eventId")
    const ticketsParam = searchParams.get("tickets")

    if (!eventId || !ticketsParam) {
      router.push("/events")
      return
    }

    try {
      const tickets = JSON.parse(decodeURIComponent(ticketsParam))
      const foundEvent = events.find((e) => e.id === eventId)

      if (!foundEvent) {
        router.push("/events")
        return
      }

      setEvent(foundEvent)
      setSelectedTickets(tickets)

      // Calculer le prix total
      const total = foundEvent.ticketTypes.reduce((sum: number, ticket: any) => {
        const count = tickets[ticket.id] || 0
        return sum + ticket.price * count
      }, 0)

      setTotalPrice(total)

      // Définir l'expiration de la réservation (15 minutes)
      const expiry = new Date()
      expiry.setMinutes(expiry.getMinutes() + 15)
      setReservationExpiry(expiry)
    } catch (error) {
      console.error("Error parsing tickets:", error)
      router.push("/events")
    }
  }, [searchParams, router])

  // Mettre à jour le compte à rebours
  useEffect(() => {
    if (!reservationExpiry) return

    const interval = setInterval(() => {
      const now = new Date()
      const diff = reservationExpiry.getTime() - now.getTime()

      if (diff <= 0) {
        clearInterval(interval)
        toast({
          title: "Réservation expirée",
          description: "Votre temps de réservation est écoulé. Veuillez recommencer.",
          variant: "destructive",
        })
        router.push(`/events/${event?.id}`)
        return
      }

      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [reservationExpiry, router, event, toast])

  const onSubmit = async (data: { phoneNumber: string }) => {
    setIsLoading(true)

    // Simuler une requête API pour le paiement mobile
    try {
      // Dans une implémentation réelle, nous appellerions l'API de paiement mobile ici
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simuler une réponse réussie
      toast({
        title: "Paiement initié",
        description: `Veuillez confirmer le paiement sur votre téléphone ${data.phoneNumber}`,
      })

      // Rediriger vers la page de confirmation après un court délai
      setTimeout(() => {
        router.push(`/confirmation?eventId=${event.id}&reference=REF${Math.floor(Math.random() * 1000000)}`)
      }, 3000)
    } catch (error) {
      toast({
        title: "Erreur de paiement",
        description: "Une erreur est survenue lors du traitement du paiement. Veuillez réessayer.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-purple-600">E-Tickets</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href={`/events/${event.id}`} className="flex items-center text-purple-600 hover:text-purple-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'événement
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3">
            <h1 className="text-2xl font-bold mb-6">Finaliser votre commande</h1>

            {timeLeft && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                <p className="text-yellow-800">
                  Votre réservation expire dans <span className="font-bold">{timeLeft}</span>
                </p>
              </div>
            )}

            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-4">Méthode de paiement</h2>

                <Tabs defaultValue="mobile" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="mobile">Paiement Mobile</TabsTrigger>
                    <TabsTrigger value="card">Carte Bancaire</TabsTrigger>
                  </TabsList>

                  <TabsContent value="mobile" className="pt-4">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="orange" id="orange" />
                        <FormLabel htmlFor="orange" className="flex items-center">
                          <div className="w-10 h-10 bg-orange-500 rounded-md flex items-center justify-center text-white mr-3">
                            <Smartphone className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-medium">Orange Money</p>
                            <p className="text-sm text-gray-500">Paiement via Orange Money</p>
                          </div>
                        </FormLabel>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mtn" id="mtn" />
                        <FormLabel htmlFor="mtn" className="flex items-center">
                          <div className="w-10 h-10 bg-yellow-500 rounded-md flex items-center justify-center text-white mr-3">
                            <Smartphone className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-medium">MTN Mobile Money</p>
                            <p className="text-sm text-gray-500">Paiement via MTN Mobile Money</p>
                          </div>
                        </FormLabel>
                      </div>
                    </RadioGroup>

                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
                        <FormField
                          control={form.control}
                          name="phoneNumber"
                          rules={{
                            required: "Le numéro de téléphone est requis",
                            pattern: {
                              value: /^[0-9]{10}$/,
                              message: "Veuillez entrer un numéro de téléphone valide (10 chiffres)",
                            },
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Numéro de téléphone</FormLabel>
                              <FormControl>
                                <Input placeholder="0X XX XX XX XX" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Traitement en cours...
                            </>
                          ) : (
                            <>Payer {totalPrice.toLocaleString()} FCFA</>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>

                  <TabsContent value="card" className="pt-4">
                    <div className="text-center py-6">
                      <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Paiement par carte bancaire</h3>
                      <p className="text-gray-500 mb-4">
                        Le paiement par carte bancaire sera disponible prochainement.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => document.querySelector('[value="mobile"]')?.dispatchEvent(new Event("click"))}
                      >
                        Utiliser le paiement mobile
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <div className="text-sm text-gray-500">
              <p className="mb-2">En finalisant votre achat, vous acceptez nos conditions générales de vente.</p>
              <p>Vos billets vous seront envoyés par email après confirmation du paiement.</p>
            </div>
          </div>

          <div className="w-full md:w-1/3">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-4">Récapitulatif de commande</h2>

                <div className="flex items-start mb-4">
                  <div className="relative h-16 w-16 rounded-md overflow-hidden mr-3">
                    <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-gray-500">
                      {event.date}, {event.time}
                    </p>
                    <p className="text-sm text-gray-500">{event.location}</p>
                  </div>
                </div>

                <div className="border-t border-b py-4 my-4 space-y-2">
                  {event.ticketTypes.map((ticket: any) => {
                    const quantity = selectedTickets[ticket.id] || 0
                    if (quantity === 0) return null

                    return (
                      <div key={ticket.id} className="flex justify-between">
                        <span>
                          {ticket.name} x {quantity}
                        </span>
                        <span>{(ticket.price * quantity).toLocaleString()} FCFA</span>
                      </div>
                    )
                  })}
                </div>

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{totalPrice.toLocaleString()} FCFA</span>
                </div>

                <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-3">
                  <div className="flex">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <p className="text-sm text-green-800">
                      Vos billets seront sécurisés par QR code et envoyés par email après paiement.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} E-Tickets. Tous droits réservés.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link href="/terms" className="hover:text-gray-700">
              Conditions d'utilisation
            </Link>
            <Link href="/privacy" className="hover:text-gray-700">
              Politique de confidentialité
            </Link>
            <Link href="/contact" className="hover:text-gray-700">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
