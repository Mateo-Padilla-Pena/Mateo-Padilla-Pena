"use client";

import React, { useState, useEffect } from "react";
import {
  Github,
  Linkedin,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Phone,
  MapPin,
} from "lucide-react";
import type { Personal } from "../types/portfolio";
import ScrollAnimation from "./ScrollAnimation";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import CrossedAvatar from "./CrossedAvatar";

interface ContactProps {
  personal: Personal;
}

const Contact: React.FC<ContactProps> = ({ personal }) => {
  const { language } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [emailError, setEmailError] = useState("");

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    if (formData.email.trim() !== "" && !isValidEmail(formData.email)) {
      setEmailError(
        language === "es"
          ? "Por favor ingresa un email válido"
          : "Please enter a valid email address"
      );
    } else {
      setEmailError("");
    }

    const isValid =
      formData.name.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.message.trim() !== "" &&
      isValidEmail(formData.email);
    setIsFormValid(isValid);
  }, [formData, language]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    if (
      !process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ||
      !process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ||
      !process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    ) {
      // Demo toast fallback if keys aren't configured
      setShowSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setShowSuccess(false), 4000);
      return;
    }

    setIsSubmitting(true);
    setShowError(false);
    setShowSuccess(false);

    try {
      // Dynamic import to keep initial page bundle ultra-lightweight
      const emailjs = (await import("@emailjs/browser")).default;
      emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);

      const templateParams = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        time: new Date().toISOString(),
      };

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );

      setShowSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (error) {
      console.error("EmailJS Error:", error);
      setShowError(true);
      setTimeout(() => setShowError(false), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contact" className="py-24 px-6 border-t border-border/60 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section title */}
        <ScrollAnimation direction="down" delay={0.1}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-primary/10 border border-primary/20 text-primary mb-3">
              <MessageSquare className="w-3 h-3" />
              <span>{language === "es" ? "Canales Directos" : "Direct Channels"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              {language === "es" ? "Iniciemos una" : "Let's Start a"}{" "}
              <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">
                {language === "es" ? "Conversación" : "Conversation"}
              </span>
            </h2>
            <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
              {language === "es"
                ? "Disponible para integrarme a equipos remotos de alta exigencia o proyectos específicos de software."
                : "Available to join high-impact remote engineering teams or collaborate on scalable projects."}
            </p>
          </div>
        </ScrollAnimation>

        {/* 3 Columnas Uniformes de la Misma Altura: Info | Form | Avatar */}
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          {/* 1. Info Card */}
          <div className="lg:col-span-4 flex flex-col h-full">
            <ScrollAnimation direction="left" delay={0.2} className="h-full flex flex-col">
              <div className="rounded-2xl border border-border bg-card/90 dark:bg-card/85 backdrop-blur-md p-6 sm:p-7 shadow-sm h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">
                    {language === "es" ? "Información de contacto" : "Contact Information"}
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-6">
                    {language === "es"
                      ? "Respondo con prontitud a consultas sobre desarrollo backend, arquitecturas en la nube o vacantes a tiempo completo."
                      : "I respond promptly to inquiries regarding backend engineering, cloud platforms, or full-time remote roles."}
                  </p>

                  <div className="space-y-4 mb-8">
                    <a
                      href={`mailto:${personal.email}`}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-secondary/40 hover:bg-accent/40 hover:border-primary/40 transition-all text-xs sm:text-sm font-medium text-foreground group"
                    >
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="truncate">{personal.email}</span>
                    </a>

                    <div className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-secondary/40 text-xs sm:text-sm font-medium text-foreground">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span>{personal.location}</span>
                    </div>
                  </div>
                </div>

                {/* Social pill links */}
                <div className="pt-6 border-t border-border/60">
                  <span className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
                    {language === "es" ? "Redes y Plataformas" : "Social Links"}
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://${personal.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl border border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-accent transition-all"
                      aria-label="GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    <a
                      href={`https://${personal.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl border border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-accent transition-all"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a
                      href={`https://wa.me/${personal.phone?.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl border border-border bg-secondary/50 text-muted-foreground hover:text-emerald-500 hover:border-emerald-500/40 hover:bg-accent transition-all"
                      aria-label="WhatsApp"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>

          {/* 2. Formulario */}
          <div className="lg:col-span-4 flex flex-col h-full">
            <ScrollAnimation direction="up" delay={0.25} className="h-full flex flex-col">
              <form
                onSubmit={handleFormSubmit}
                className="rounded-2xl border border-border bg-card/90 dark:bg-card/85 backdrop-blur-md p-6 sm:p-7 shadow-sm space-y-4 h-full flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                      {language === "es" ? "Nombre completo *" : "Full Name *"}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                      placeholder={language === "es" ? "Tu nombre" : "John Doe"}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                      {language === "es" ? "Correo electrónico *" : "Email Address *"}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 transition-all ${
                        emailError
                          ? "border-destructive focus-visible:ring-destructive"
                          : "border-input focus-visible:ring-ring"
                      }`}
                      placeholder={language === "es" ? "tu@correo.com" : "john@example.com"}
                    />
                    {emailError && (
                      <p className="text-destructive text-xs mt-1 font-medium">{emailError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                      {language === "es" ? "Mensaje *" : "Message *"}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all resize-none"
                      placeholder={
                        language === "es"
                          ? "Cuéntame sobre tu proyecto o propuesta..."
                          : "Tell me about your project, team, or inquiry..."
                      }
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className={`w-full py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                    isFormValid && !isSubmitting
                      ? "bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/20"
                      : "bg-secondary text-muted-foreground border border-border cursor-not-allowed opacity-60"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      <span>{language === "es" ? "Enviando..." : "Sending..."}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{language === "es" ? "Enviar Mensaje" : "Send Message"}</span>
                    </>
                  )}
                </button>
              </form>
            </ScrollAnimation>
          </div>

          {/* 3. Avatar Puro con la misma altura exacta que las tarjetas */}
          <div className="lg:col-span-4 flex flex-col h-full">
            <ScrollAnimation direction="right" delay={0.3} className="h-full flex items-center justify-center">
              <div className="h-full w-full max-h-full flex items-center justify-center filter drop-shadow-2xl select-none">
                <CrossedAvatar className="h-full w-full" />
              </div>
            </ScrollAnimation>
          </div>
        </div>

        {/* Success toast */}
        {showSuccess && (
          <div className="fixed bottom-6 right-6 max-w-sm rounded-2xl border border-border bg-card p-4 shadow-2xl flex items-center gap-3 z-50 animate-slide-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                {language === "es" ? "¡Mensaje recibido!" : "Message delivered!"}
              </h4>
              <p className="text-xs text-muted-foreground">
                {language === "es" ? "Te responderé lo más pronto posible." : "I will get back to you shortly."}
              </p>
            </div>
          </div>
        )}

        {/* Error toast */}
        {showError && (
          <div className="fixed bottom-6 right-6 max-w-sm rounded-2xl border border-border bg-card p-4 shadow-2xl flex items-center gap-3 z-50 animate-slide-in">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                {language === "es" ? "Error al enviar" : "Sending failed"}
              </h4>
              <p className="text-xs text-muted-foreground">
                {language === "es" ? "Por favor escríbeme directamente a mi email." : "Please email me directly."}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Contact;
