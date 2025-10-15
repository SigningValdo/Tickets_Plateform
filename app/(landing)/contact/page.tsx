"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simuler l'envoi du formulaire
    setTimeout(() => {
      toast({
        title: "Message envoyé",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });
      setIsSubmitting(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <main className="container mx-auto px-4 py-12">
        <section className="mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-6 text-center">
            Contactez-nous
          </h1>
          <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            Vous avez des questions ou besoin d'assistance ? Notre équipe est là
            pour vous aider. N'hésitez pas à nous contacter.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-fanzone-orange" />
                </div>
                <h3 className="text-lg font-bold mb-2">Email</h3>
                <p className="text-gray-600 mb-4">
                  Pour toute question ou demande d'information
                </p>
                <a
                  href="mailto:contact@e-tickets.com"
                  className="text-fanzone-orange font-medium"
                >
                  contact@e-tickets.com
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-fanzone-orange" />
                </div>
                <h3 className="text-lg font-bold mb-2">Téléphone</h3>
                <p className="text-gray-600 mb-4">
                  Du lundi au vendredi, de 9h à 18h
                </p>
                <a
                  href="tel:+123456789"
                  className="text-fanzone-orange font-medium"
                >
                  +123 456 789
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-fanzone-orange" />
                </div>
                <h3 className="text-lg font-bold mb-2">Adresse</h3>
                <p className="text-gray-600 mb-4">Venez nous rencontrer</p>
                <address className="text-fanzone-orange font-medium not-italic">
                  123 Avenue Principale
                  <br />
                  Abidjan, Côte d'Ivoire
                </address>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Envoyez-nous un message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nom complet *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Sujet *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-fanzone-orange hover:bg-fanzone-orange/90 w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Envoyer le message
                    </>
                  )}
                </Button>
              </form>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-6">Foire aux questions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold mb-2">
                    Comment puis-je acheter des billets ?
                  </h3>
                  <p className="text-gray-600">
                    Vous pouvez acheter des billets en créant un compte sur
                    notre plateforme, en sélectionnant l'événement qui vous
                    intéresse et en suivant les étapes de paiement.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">
                    Comment recevoir mes billets ?
                  </h3>
                  <p className="text-gray-600">
                    Après votre achat, vos billets électroniques sont envoyés à
                    votre adresse email et sont également disponibles dans votre
                    espace personnel sur notre plateforme.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">
                    Puis-je annuler ma commande ?
                  </h3>
                  <p className="text-gray-600">
                    Les conditions d'annulation dépendent de la politique de
                    chaque organisateur. Veuillez consulter les conditions
                    spécifiques de l'événement avant d'acheter vos billets.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">
                    Comment devenir organisateur d'événements ?
                  </h3>
                  <p className="text-gray-600">
                    Pour devenir organisateur et utiliser notre plateforme pour
                    vendre vos billets, veuillez nous contacter directement par
                    email ou téléphone.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">
                    Quels moyens de paiement acceptez-vous ?
                  </h3>
                  <p className="text-gray-600">
                    Nous acceptons les paiements par carte bancaire, mobile
                    money (Orange Money, MTN Mobile Money) et d'autres moyens de
                    paiement locaux selon les pays.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-6">Notre emplacement</h2>
          <div className="h-96 bg-gray-200 rounded-xl flex items-center justify-center">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3980.7619490893007!2d11.570066576602091!3d3.861182796112591!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bc5512d0916e1%3A0xfdb220eb93b060ec!2sD%C3%94VV%20Mimboman!5e0!3m2!1sfr!2scm!4v1760502834065!5m2!1sfr!2scm"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      </main>
    </div>
  );
}
