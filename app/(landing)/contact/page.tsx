"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { Mail, Phone, MapPin, Loader2, Send, CircleUserRound } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
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

    setTimeout(() => {
      toast.success("Message envoyé", {
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

  const inputClass =
    "w-full h-12 pl-12 pr-4 rounded-xl border border-gris4 bg-bg text-sm text-black placeholder:text-gris2 focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors";

  const iconClass =
    "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gris2";

  return (
    <div className="bg-bg">
      {/* Hero banner */}
      <section className="relative bg-navy text-white py-16 md:py-20 overflow-hidden">
        <Image
          src="/filigrame.png"
          alt=""
          fill
          className="object-cover opacity-20"
        />
        <div className="relative container text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Contactez-nous
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Vous avez des questions ou besoin d&apos;assistance ? Notre équipe
            est là pour vous aider.
          </p>
        </div>
      </section>

      <div className="container py-12 md:py-16">
        {/* Contact info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          <div className="bg-white rounded-2xl p-6 flex flex-col items-center text-center shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
            <div className="h-14 w-14 rounded-full bg-green/10 flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-green" />
            </div>
            <h3 className="text-base font-semibold text-black mb-1">Email</h3>
            <p className="text-sm text-gris2 mb-3">
              Pour toute question ou demande
            </p>
            <a
              href="mailto:support@fanzonetickets.com"
              className="text-sm text-green font-medium hover:underline"
            >
              support@fanzonetickets.com
            </a>
          </div>

          <div className="bg-white rounded-2xl p-6 flex flex-col items-center text-center shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
            <div className="h-14 w-14 rounded-full bg-green/10 flex items-center justify-center mb-4">
              <Phone className="h-6 w-6 text-green" />
            </div>
            <h3 className="text-base font-semibold text-black mb-1">
              Téléphone
            </h3>
            <p className="text-sm text-gris2 mb-3">
              Du lundi au vendredi, de 9h à 18h
            </p>
            <a
              href="tel:+237676766471"
              className="text-sm text-green font-medium hover:underline"
            >
              676 76 64 71 / 694 59 30 08
            </a>
          </div>

          <div className="bg-white rounded-2xl p-6 flex flex-col items-center text-center shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
            <div className="h-14 w-14 rounded-full bg-green/10 flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-green" />
            </div>
            <h3 className="text-base font-semibold text-black mb-1">
              Adresse
            </h3>
            <p className="text-sm text-gris2 mb-3">Venez nous rencontrer</p>
            <address className="text-sm text-green font-medium not-italic">
              DOCC OPEP, Mimboman
              <br />
              Yaoundé - Cameroun
            </address>
          </div>
        </div>

        {/* Form + FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form card */}
          <div className="bg-white rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.06)] px-8 py-10">
            <h2 className="text-xl font-semibold text-black mb-1">
              Envoyez-nous un message
            </h2>
            <p className="text-sm text-gris2 mb-6">
              Remplissez le formulaire ci-dessous et nous vous répondrons
              rapidement.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nom */}
              <div className="relative">
                <CircleUserRound className={iconClass} />
                <input
                  type="text"
                  name="name"
                  placeholder="Nom complet"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className={iconClass} />
                <input
                  type="email"
                  name="email"
                  placeholder="Adresse mail"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              {/* Sujet */}
              <div className="relative">
                <Send className={iconClass} />
                <input
                  type="text"
                  name="subject"
                  placeholder="Sujet"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              {/* Message */}
              <div>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Votre message..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gris4 bg-bg text-sm text-black placeholder:text-gris2 focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-colors resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-green hover:bg-green/90 text-white font-medium rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Envoyer le message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-xl font-semibold text-black mb-6">
              Foire aux questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "Comment puis-je acheter des billets ?",
                  a: "Vous pouvez acheter des billets en créant un compte sur notre plateforme, en sélectionnant l'événement qui vous intéresse et en suivant les étapes de paiement.",
                },
                {
                  q: "Comment recevoir mes billets ?",
                  a: "Après votre achat, vos billets électroniques sont envoyés à votre adresse email et sont également disponibles dans votre espace personnel sur notre plateforme.",
                },
                {
                  q: "Puis-je annuler ma commande ?",
                  a: "Les conditions d'annulation dépendent de la politique de chaque organisateur. Veuillez consulter les conditions spécifiques de l'événement avant d'acheter vos billets.",
                },
                {
                  q: "Comment devenir organisateur d'événements ?",
                  a: "Pour devenir organisateur et utiliser notre plateforme pour vendre vos billets, veuillez nous contacter directement par email ou téléphone.",
                },
                {
                  q: "Quels moyens de paiement acceptez-vous ?",
                  a: "Nous acceptons les paiements par carte bancaire, mobile money (Orange Money, MTN Mobile Money) et d'autres moyens de paiement locaux.",
                },
              ].map((faq, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-5 shadow-[0_2px_20px_rgba(0,0,0,0.04)]"
                >
                  <h3 className="font-semibold text-sm text-black mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-sm text-gris2 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-black mb-5">
            Notre emplacement
          </h2>
          <div className="h-96 rounded-2xl overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
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
      </div>
    </div>
  );
}
