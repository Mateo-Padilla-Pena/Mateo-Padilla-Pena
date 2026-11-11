"use client";

import React, { useState, useEffect } from "react";
import {
  Download,
  FileDown,
  AlertCircle,
  Loader2,
  X,
  ExternalLink,
} from "lucide-react";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { generateCvHtml } from "@/components/cv/cvHtmlTemplate";

interface CvDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Recorta la imagen de avatar en proporción 1:1 centrada usando un canvas 2D
 * para garantizar que nunca se vea estirada ni aplastada.
 */
async function getSquareCroppedAvatarBase64(url: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const size = Math.min(img.naturalWidth || 300, img.naturalHeight || 300);
        const sx = ((img.naturalWidth || size) - size) / 2;
        const sy = ((img.naturalHeight || size) - size) / 2;
        const canvas = document.createElement("canvas");
        canvas.width = 240;
        canvas.height = 240;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, sx, sy, size, size, 0, 0, 240, 240);
          resolve(canvas.toDataURL("image/jpeg", 0.92));
          return;
        }
      } catch {
        // ignore
      }
      resolve(url);
    };
    img.onerror = () => resolve(url);
    img.src = url;
  });
}

export const CvDownloadModal: React.FC<CvDownloadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language, getDataForLanguage } = useLanguage();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingLang, setGeneratingLang] = useState<Language | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setIsGenerating(false);
      setGeneratingLang(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isGenerating) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isGenerating, onClose]);

  if (!isOpen) return null;

  const handleDynamicGeneratePdf = async (lang: Language) => {
    setIsGenerating(true);
    setGeneratingLang(lang);
    setErrorMessage(null);

    const targetData = getDataForLanguage(lang);
    const filename = `Mateo_Padilla_CV_${lang.toUpperCase()}.pdf`;

    try {
      // 1. Obtener imagen de avatar recortada en base64
      const avatarBase64 = await getSquareCroppedAvatarBase64(
        "/portfolio-image.jpeg"
      );

      // 2. Renderizar contenedor en el DOM con layout real
      const renderContainer = document.createElement("div");
      renderContainer.id = "cv-render-wrapper";
      renderContainer.style.position = "fixed";
      renderContainer.style.left = "0";
      renderContainer.style.top = "0";
      renderContainer.style.width = "794px";
      renderContainer.style.zIndex = "-9999";
      renderContainer.style.opacity = "0";
      renderContainer.style.pointerEvents = "none";
      renderContainer.innerHTML = generateCvHtml({
        data: targetData,
        language: lang,
        theme: "light",
        avatarBase64,
        standalone: false,
      });

      document.body.appendChild(renderContainer);

      try {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
        await new Promise((r) => setTimeout(r, 200));

        const targetEl = renderContainer.querySelector(
          "#cv-export-root"
        ) as HTMLElement;
        if (!targetEl) throw new Error("No se encontró el elemento raíz del CV");

        const rect = targetEl.getBoundingClientRect();
        const widthPx = 794;
        const heightPx = Math.ceil(
          Math.max(targetEl.scrollHeight, rect.height, 1123)
        );
        const pdfWidthMm = 210;
        const pdfHeightMm = Math.ceil((heightPx * pdfWidthMm) / widthPx) + 2;

        const html2pdfModule = await import("html2pdf.js");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const html2pdf: any = html2pdfModule.default || html2pdfModule;

        await html2pdf()
          .set({
            margin: 0,
            filename,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
              scale: 2,
              useCORS: true,
              allowTaint: true,
              backgroundColor: "#ffffff",
              width: widthPx,
              height: heightPx,
              windowWidth: widthPx,
              windowHeight: heightPx,
              scrollX: 0,
              scrollY: 0,
            },
            jsPDF: {
              unit: "mm",
              format: [pdfWidthMm, pdfHeightMm],
              orientation: "portrait",
            },
            pagebreak: { mode: ["avoid-all"] },
          })
          .from(targetEl)
          .save();

        onClose();
      } finally {
        if (renderContainer.parentNode) {
          renderContainer.parentNode.removeChild(renderContainer);
        }
      }
    } catch (err) {
      console.error("Error al generar PDF:", err);
      setErrorMessage(
        lang === "es"
          ? "Error al generar el PDF. Intenta de nuevo."
          : "Error generating PDF. Please try again."
      );
    } finally {
      setIsGenerating(false);
      setGeneratingLang(null);
    }
  };

  const isEs = language === "es";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cv-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isGenerating) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-sm bg-card text-card-foreground border border-border rounded-2xl shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          disabled={isGenerating}
          className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/80 transition-colors disabled:opacity-50"
          aria-label={isEs ? "Cerrar" : "Close"}
        >
          <X className="w-5 h-5" />
        </button>

        <h3
          id="cv-modal-title"
          className="text-lg font-bold tracking-tight text-foreground mb-4 pr-8"
        >
          {isEs ? "Descargar CV" : "Download CV"}
        </h3>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleDynamicGeneratePdf("es")}
            disabled={isGenerating}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-50 cursor-pointer"
          >
            <span className="text-2xl" role="img" aria-label="Español">
              🇪🇸
            </span>
            <span className="font-semibold text-sm text-foreground flex items-center gap-1.5">
              {isGenerating && generatingLang === "es" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                  <span>{isEs ? "Generando..." : "Generating..."}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-primary" />
                  <span>Español</span>
                </>
              )}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleDynamicGeneratePdf("en")}
            disabled={isGenerating}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-50 cursor-pointer"
          >
            <span className="text-2xl" role="img" aria-label="English">
              🇺🇸
            </span>
            <span className="font-semibold text-sm text-foreground flex items-center gap-1.5">
              {isGenerating && generatingLang === "en" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                  <span>{isEs ? "Generando..." : "Generating..."}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-primary" />
                  <span>English</span>
                </>
              )}
            </span>
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-border flex items-center justify-center">
          <a
            href={`/cv-preview.html?lang=${language}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
          >
            <span>{isEs ? "Ver plantilla en vivo" : "View live template"}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export const FloatingCvButton: React.FC = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const isEs = language === "es";

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={isEs ? "Descargar Currículum" : "Download Resume"}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2.5 pl-3.5 pr-4 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
      >
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary-foreground/15 group-hover:bg-primary-foreground/25 transition-colors">
          <FileDown className="w-4 h-4" />
        </span>
        <span>{isEs ? "Descargar Currículum" : "Download Resume"}</span>
      </button>

      <CvDownloadModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default CvDownloadModal;
