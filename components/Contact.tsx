"use client";

import React, { useState, useEffect } from "react";
import {
  Github,
  Linkedin,
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import type { Personal } from "../types/portfolio";
import emailjs from "@emailjs/browser";
import ScrollAnimation from "./ScrollAnimation";

interface ContactProps {
  personal: Personal;
}

const Contact: React.FC<ContactProps> = ({ personal }) => {
  React.useEffect(() => {
    if (process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) {
      emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);
    }
  }, []);

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
      setEmailError("Por favor ingresa un email válido");
    } else {
      setEmailError("");
    }

    const isValid =
      formData.name.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.message.trim() !== "" &&
      isValidEmail(formData.email);
    setIsFormValid(isValid);
  }, [formData]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    if (
      !process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ||
      !process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ||
      !process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    ) {
      console.error("EmailJS environment variables are not configured");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsSubmitting(true);
    setShowError(false);
    setShowSuccess(false);

    try {
      const templateParams = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        time: new Date().toLocaleString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );

      setShowSuccess(true);
      setFormData({ name: "", email: "", message: "" });

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("EmailJS Error:", error);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
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
    <section id="contact" className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <ScrollAnimation direction="down" delay={0.1}>
          <h2 className="text-3xl font-bold mb-16 text-center text-gray-900">
            Hablemos de tu próximo{" "}
            <span className="text-blue-600">proyecto</span>
          </h2>
        </ScrollAnimation>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          <ScrollAnimation direction="left" delay={0.2}>
            <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Conectemos
              </h3>
              <p className="text-gray-600 mb-10 leading-relaxed font-light">
                Estoy siempre abierto a discutir nuevas oportunidades,
                colaboraciones o simplemente charlar sobre tecnología.
              </p>

              <div className="flex space-x-4">
                <a
                  href={`mailto:${personal.email}`}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm border border-gray-100 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
                >
                  <Mail className="w-5 h-5" />
                </a>

                <a
                  href={`https://${personal.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm border border-gray-100 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
                >
                  <Github className="w-5 h-5" />
                </a>

                <a
                  href={`https://${personal.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm border border-gray-100 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
                >
                  <Linkedin className="w-5 h-5" />
                </a>

                <a
                  href={`https://wa.me/${personal.phone?.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm border border-gray-100 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                </a>
              </div>
            </div>
          </ScrollAnimation>

          <ScrollAnimation direction="right" delay={0.3}>
            <div className="space-y-6">
              <ScrollAnimation direction="up" delay={0.4}>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3.5 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all duration-300 placeholder:text-gray-400"
                    placeholder="Tu nombre completo"
                  />
                </div>
              </ScrollAnimation>

              <ScrollAnimation direction="up" delay={0.5}>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3.5 bg-gray-50 text-gray-900 rounded-xl border transition-all duration-300 placeholder:text-gray-400 focus:bg-white focus:ring-4 focus:outline-none ${
                      emailError
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/10"
                    }`}
                    placeholder="tu@email.com"
                  />
                  {emailError && (
                    <p className="text-red-500 text-sm mt-1.5 font-medium">{emailError}</p>
                  )}
                </div>
              </ScrollAnimation>

              <ScrollAnimation direction="up" delay={0.6}>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Mensaje *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3.5 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all duration-300 resize-none placeholder:text-gray-400"
                    placeholder="Cuéntame sobre tu proyecto..."
                  ></textarea>
                </div>
              </ScrollAnimation>

              <ScrollAnimation direction="up" delay={0.7}>
                <button
                  onClick={handleFormSubmit}
                  disabled={!isFormValid || isSubmitting}
                  className={`w-full py-3.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isFormValid && !isSubmitting
                      ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Enviar Mensaje</span>
                    </>
                  )}
                </button>
              </ScrollAnimation>
            </div>
          </ScrollAnimation>
        </div>

        {showSuccess && (
          <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 z-50 animate-slide-in">
            <CheckCircle className="w-6 h-6" />
            <div>
              <h4 className="font-semibold">¡Mensaje enviado!</h4>
              <p className="text-sm">Te contactaré pronto.</p>
            </div>
          </div>
        )}

        {showError && (
          <div className="fixed top-4 right-4 bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 z-50 animate-slide-in">
            <AlertCircle className="w-6 h-6" />
            <div>
              <h4 className="font-semibold">Error al enviar</h4>
              <p className="text-sm">Inténtalo de nuevo más tarde.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Contact;
