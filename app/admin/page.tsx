"use client";

import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";
import Image from "next/image";
import { portfolioService, storageService } from "@/backend";
import {
  PortfolioData,
  Project,
  Experience,
  CertificateItem,
  Course,
  Language,
} from "@/types/portfolio";
import {
  Save,
  Plus,
  Trash2,
  ExternalLink,
  LogOut,
  Globe,
  Check,
  AlertCircle,
  FolderKanban,
  User as UserIcon,
  Briefcase,
  GraduationCap,
  Code2,
  Upload,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  FileCode,
  Award,
  BookOpen,
  Languages as LanguagesIcon,
  X,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

type SectionTab =
  | "projects"
  | "personalData"
  | "experience"
  | "skills"
  | "certificates"
  | "courses"
  | "languages"
  | "json";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // State
  const [activeLang, setActiveLang] = useState<"es" | "en">("es");
  const [activeTab, setActiveTab] = useState<SectionTab>("projects");

  const [dataEs, setDataEs] = useState<PortfolioData>(portfolioService.getDefaultContent().es);
  const [dataEn, setDataEn] = useState<PortfolioData>(portfolioService.getDefaultContent().en);

  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Raw JSON state for emergency/advanced mode
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState("");

  // Project modal / edit state
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // File input refs
  const projectFileInputRef = useRef<HTMLInputElement>(null);
  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const certImageInputRef = useRef<HTMLInputElement>(null);
  const certDocInputRef = useRef<HTMLInputElement>(null);
  const [activeCertIndex, setActiveCertIndex] = useState<number | null>(null);

  // Base64 helper toggle for rich text
  const [isStoryBase64, setIsStoryBase64] = useState(false);

  // Authentication check
  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login");
    }
  }, [user, loading, router]);

  // Load from remote storage or fallback to local
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const remoteContent = await portfolioService.getRemoteContent();
        if (remoteContent) {
          if (remoteContent.es) setDataEs(remoteContent.es);
          if (remoteContent.en) setDataEn(remoteContent.en);
        } else {
          const defaults = portfolioService.getDefaultContent();
          setDataEs(defaults.es);
          setDataEn(defaults.en);
        }
      } catch (err: any) {
        console.error("Error loading remote content:", err);
        setStatusMessage({
          type: "error",
          text: `Aviso: No se pudo conectar con la base de datos (${err.message}). Usando datos locales.`,
        });
      }
    };

    fetchData();
  }, [user]);

  // Sync JSON text when switching tab or language
  useEffect(() => {
    const current = activeLang === "es" ? dataEs : dataEn;
    setJsonText(JSON.stringify(current, null, 2));
    setJsonError("");
  }, [activeLang, activeTab, dataEs, dataEn]);

  const currentData = activeLang === "es" ? dataEs : dataEn;

  const setCurrentData = (updater: (prev: PortfolioData) => PortfolioData) => {
    if (activeLang === "es") {
      setDataEs((prev) => updater(prev));
    } else {
      setDataEn((prev) => updater(prev));
    }
  };

  const handleSaveToFirestore = async () => {
    if (!auth.currentUser) {
      setStatusMessage({
        type: "error",
        text: "No has iniciado sesión como administrador. Por favor ingresa a /admin/login para autorizar los cambios.",
      });
      return;
    }

    setSaving(true);
    setStatusMessage(null);
    try {
      await portfolioService.saveContent({
        es: dataEs,
        en: dataEn,
      });
      setStatusMessage({
        type: "success",
        text: "¡Módulos validados con Joi y guardados exitosamente!",
      });
    } catch (err: any) {
      console.error("Error saving content:", err);
      setStatusMessage({
        type: "error",
        text: `Error de guardado: ${err.message}. Verifica que hayas publicado las reglas en tu consola de Firestore.`,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLoadDefaults = () => {
    if (confirm("¿Estás seguro de restablecer el contenido con los datos por defecto? Esto sobrescribirá cambios sin guardar.")) {
      const defaults = portfolioService.getDefaultContent();
      setDataEs(defaults.es);
      setDataEn(defaults.en);
      setStatusMessage({
        type: "success",
        text: "Datos locales restaurados. Recuerda presionar 'Guardar Cambios' para sincronizarlos.",
      });
    }
  };

  // 1. Upload Project Image: projects/{projectId}/images/*
  const handleProjectImageUpload = async (file: File) => {
    if (!file || editingProjectIndex === null) return;
    const project = currentData.projects[editingProjectIndex];
    setUploadingImage(true);
    setUploadProgress(0);

    try {
      const downloadUrl = await storageService.uploadProjectImage(
        project.id || `proj_${editingProjectIndex}`,
        file,
        (progress) => setUploadProgress(progress)
      );

      updateProjectField(editingProjectIndex, "image", downloadUrl);
      setStatusMessage({
        type: "success",
        text: "¡Imagen de proyecto subida exitosamente!",
      });
    } catch (error: any) {
      alert(error.message || "Error al subir imagen.");
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
    }
  };

  // 2. Upload Profile Photo: profilePhoto/*
  const handleProfilePhotoUpload = async (file: File) => {
    if (!file) return;
    setUploadingImage(true);
    setUploadProgress(0);

    try {
      const downloadUrl = await storageService.uploadProfilePhoto(file, (progress) =>
        setUploadProgress(progress)
      );

      setCurrentData((prev) => ({
        ...prev,
        personal: {
          ...prev.personal,
          profilePhoto: downloadUrl,
        },
      }));

      setStatusMessage({
        type: "success",
        text: "¡Foto de perfil subida exitosamente!",
      });
    } catch (error: any) {
      alert(error.message || "Error al subir foto de perfil.");
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
    }
  };

  // 3. Upload Certificate Image: certificates/{certificateId}/image/*
  const handleCertImageUpload = async (file: File, certIdx: number) => {
    if (!file) return;
    const cert = currentData.certifications[certIdx];
    const certId = typeof cert === "object" ? cert.id : `cert_${certIdx}`;
    setUploadingImage(true);
    setUploadProgress(0);

    try {
      const downloadUrl = await storageService.uploadCertificateImage(certId, file, (progress) =>
        setUploadProgress(progress)
      );

      updateCertificateField(certIdx, "image", downloadUrl);
      setStatusMessage({
        type: "success",
        text: "¡Imagen de certificación subida exitosamente!",
      });
    } catch (error: any) {
      alert(error.message || "Error al subir imagen de certificación.");
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
    }
  };

  // 4. Upload Certificate Document: certificates/{certificateId}/document/*
  const handleCertDocUpload = async (file: File, certIdx: number) => {
    if (!file) return;
    const cert = currentData.certifications[certIdx];
    const certId = typeof cert === "object" ? cert.id : `cert_${certIdx}`;
    setUploadingImage(true);
    setUploadProgress(0);

    try {
      const downloadUrl = await storageService.uploadCertificateDocument(certId, file, (progress) =>
        setUploadProgress(progress)
      );

      updateCertificateField(certIdx, "document", downloadUrl);
      setStatusMessage({
        type: "success",
        text: "¡Documento de certificación subido exitosamente!",
      });
    } catch (error: any) {
      alert(error.message || "Error al subir documento de certificación.");
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
    }
  };

  // Project helpers
  const updateProjectField = (index: number, field: keyof Project, value: any) => {
    setCurrentData((prev) => {
      const updated = [...(prev.projects || [])];
      if (!updated[index]) return prev;
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, projects: updated };
    });
  };

  const handleSwitchLanguage = (lang: "es" | "en") => {
    if (editingProjectIndex !== null) {
      const sourceData = activeLang === "es" ? dataEs : dataEn;
      const targetData = lang === "es" ? dataEs : dataEn;
      if (!targetData.projects || !targetData.projects[editingProjectIndex]) {
        const sourceProj = sourceData.projects?.[editingProjectIndex];
        if (sourceProj) {
          const newProj: Project = {
            ...sourceProj,
            title: lang === "es" ? sourceProj.title : `${sourceProj.title} (EN)`,
          };
          if (lang === "es") {
            setDataEs((prev) => {
              const updated = [...(prev.projects || [])];
              updated[editingProjectIndex] = newProj;
              return { ...prev, projects: updated };
            });
          } else {
            setDataEn((prev) => {
              const updated = [...(prev.projects || [])];
              updated[editingProjectIndex] = newProj;
              return { ...prev, projects: updated };
            });
          }
        }
      }
    }
    setActiveLang(lang);
  };

  const LanguageTabSelector = ({
    size = "md",
    className = "",
    showLabel = true,
  }: {
    size?: "sm" | "md";
    className?: string;
    showLabel?: boolean;
  }) => (
    <div
      role="tablist"
      aria-label="Selector de idioma"
      className={`inline-flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-700/80 shadow-xs ${className}`}
    >
      <button
        type="button"
        role="tab"
        aria-selected={activeLang === "es"}
        onClick={() => handleSwitchLanguage("es")}
        className={`flex items-center gap-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
          size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-xs"
        } ${
          activeLang === "es"
            ? "bg-blue-600 text-white shadow-sm ring-1 ring-blue-400/50"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
        }`}
        title="Cambiar a Español"
      >
        <span>🇪🇸</span>
        {showLabel && <span>Español</span>}
        {activeLang === "es" && (
          <span className="w-1.5 h-1.5 rounded-full bg-white ml-0.5 animate-pulse" />
        )}
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={activeLang === "en"}
        onClick={() => handleSwitchLanguage("en")}
        className={`flex items-center gap-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
          size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-xs"
        } ${
          activeLang === "en"
            ? "bg-blue-600 text-white shadow-sm ring-1 ring-blue-400/50"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
        }`}
        title="Switch to English"
      >
        <span>🇺🇸</span>
        {showLabel && <span>English</span>}
        {activeLang === "en" && (
          <span className="w-1.5 h-1.5 rounded-full bg-white ml-0.5 animate-pulse" />
        )}
      </button>
    </div>
  );

  const handleAddProject = () => {
    const newProject: Project = {
      id: Date.now(),
      title: activeLang === "es" ? "Nuevo Proyecto" : "New Project",
      sector: activeLang === "es" ? "Tecnología & SaaS" : "Tech & SaaS",
      description: "",
      impact: "",
      tech: ["TypeScript", "React"],
      image: "",
      demo: "#",
      code: "https://github.com/Mateo-Padilla-Pena",
    };
    setCurrentData((prev) => ({
      ...prev,
      projects: [newProject, ...prev.projects],
    }));
    setEditingProjectIndex(0);
  };

  const handleDeleteProject = (index: number) => {
    if (confirm("¿Eliminar este proyecto permanentemente?")) {
      setCurrentData((prev) => ({
        ...prev,
        projects: prev.projects.filter((_, i) => i !== index),
      }));
      if (editingProjectIndex === index) {
        setEditingProjectIndex(null);
      }
    }
  };

  const handleMoveProject = (index: number, direction: "up" | "down") => {
    setCurrentData((prev) => {
      const projects = [...prev.projects];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= projects.length) return prev;
      const temp = projects[index];
      projects[index] = projects[targetIndex];
      projects[targetIndex] = temp;
      return { ...prev, projects };
    });
  };

  // Certificate helpers (normalizes string | CertificateItem)
  const getCertObject = (cert: string | CertificateItem, idx: number): CertificateItem => {
    if (typeof cert === "string") {
      return { id: `cert_${idx}`, name: cert };
    }
    return cert;
  };

  const updateCertificateField = (index: number, field: keyof CertificateItem, value: any) => {
    setCurrentData((prev) => {
      const list = [...(prev.certifications || [])];
      const currentObj = getCertObject(list[index], index);
      list[index] = { ...currentObj, [field]: value };
      return { ...prev, certifications: list };
    });
  };

  const handleAddCertificate = () => {
    const newCert: CertificateItem = {
      id: Date.now(),
      name: "Nueva Certificación",
      institution: "Plataforma / Institución",
      date: new Date().getFullYear().toString(),
    };
    setCurrentData((prev) => ({
      ...prev,
      certifications: [newCert, ...(prev.certifications || [])],
    }));
  };

  // Raw JSON
  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (activeLang === "es") {
        setDataEs(parsed);
      } else {
        setDataEn(parsed);
      }
      setJsonError("");
      setStatusMessage({
        type: "success",
        text: `JSON aplicado con éxito para el idioma ${activeLang.toUpperCase()}.`,
      });
    } catch (err: any) {
      setJsonError(`Error de sintaxis JSON: ${err.message}`);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400"></div>
          <p className="text-xs text-slate-400">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shadow-sm">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">Panel de Administración</h1>
              <p className="text-[11px] text-slate-400">{user.email || "Administrador"}</p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadDefaults}
              title="Restablece datos base"
              className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restaurar</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs transition-colors flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ver Sitio</span>
            </Link>

            <button
              onClick={handleSaveToFirestore}
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-md transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>

            <button
              onClick={() => signOut(auth)}
              title="Cerrar Sesión"
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 rounded-lg transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Status banner */}
      {statusMessage && (
        <div
          className={`px-4 py-2.5 text-xs flex items-center justify-between border-b ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-red-500/10 border-red-500/30 text-red-300"
          }`}
        >
          <div className="max-w-7xl mx-auto w-full flex items-center gap-2">
            {statusMessage.type === "success" ? (
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Body */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col md:flex-row gap-6 p-4 lg:p-8">
        {/* Left Navigation Tabs */}
        <aside className="w-full md:w-60 shrink-0">
          <nav className="flex md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0 bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab("projects")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left whitespace-nowrap ${
                activeTab === "projects"
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>projects ({currentData.projects?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab("personalData")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left whitespace-nowrap ${
                activeTab === "personalData"
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>personalData</span>
            </button>

            <button
              onClick={() => setActiveTab("experience")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left whitespace-nowrap ${
                activeTab === "experience"
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>experience ({currentData.experience?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab("skills")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left whitespace-nowrap ${
                activeTab === "skills"
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>skills (unificado)</span>
            </button>

            <button
              onClick={() => setActiveTab("certificates")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left whitespace-nowrap ${
                activeTab === "certificates"
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>certificates ({currentData.certifications?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab("courses")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left whitespace-nowrap ${
                activeTab === "courses"
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>courses ({currentData.courses?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab("languages")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left whitespace-nowrap ${
                activeTab === "languages"
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <LanguagesIcon className="w-4 h-4" />
              <span>languages ({currentData.languages?.length || 0})</span>
            </button>

            <div className="pt-2 mt-2 border-t border-slate-800/80">
              <button
                onClick={() => setActiveTab("json")}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left whitespace-nowrap w-full ${
                  activeTab === "json"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/40"
                }`}
              >
                <FileCode className="w-4 h-4" />
                <span>Modo JSON Avanzado</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 relative">
          {/* ========================================================= */}
          {/* TAB 1: PROJECTS */}
          {/* ========================================================= */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Módulo: projects ({activeLang.toUpperCase()})
                  </h2>
                  <p className="text-xs text-slate-400">
                    Ruta de almacenamiento: <code className="text-blue-400">projects/&#123;projectId&#125;/images/</code>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <LanguageTabSelector size="sm" />
                  <button
                    onClick={handleAddProject}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nuevo Proyecto</span>
                  </button>
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentData.projects?.map((project, idx) => (
                  <div
                    key={project.id || idx}
                    className="bg-slate-800/60 border border-slate-700/60 rounded-xl overflow-hidden hover:border-slate-600 transition-all flex flex-col group"
                  >
                    <div className="relative h-40 w-full bg-slate-900 overflow-hidden">
                      {project.image ? (
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-600 text-xs">
                          Sin imagen
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-slate-950/80 backdrop-blur-sm p-1 rounded-lg border border-white/10">
                        <button
                          onClick={() => handleMoveProject(idx, "up")}
                          disabled={idx === 0}
                          title="Subir posición"
                          className="p-1 hover:text-blue-400 disabled:opacity-30"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveProject(idx, "down")}
                          disabled={idx === (currentData.projects?.length || 0) - 1}
                          title="Bajar posición"
                          className="p-1 hover:text-blue-400 disabled:opacity-30"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(idx)}
                          title="Eliminar"
                          className="p-1 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-slate-900/90 text-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-slate-700">
                        {project.sector || "General"}
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-white text-sm line-clamp-1">{project.title}</h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1">{project.description}</p>
                        {project.impact && (
                          <p className="text-[11px] text-emerald-400 mt-2 line-clamp-1 font-medium">
                            <span className="text-slate-400 font-normal">Impacto:</span> {project.impact}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between">
                        <div className="flex flex-wrap gap-1 max-w-[70%]">
                          {project.tech?.slice(0, 3).map((t, ti) => (
                            <span key={ti} className="text-[10px] bg-slate-700/60 text-slate-300 px-1.5 py-0.5 rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => setEditingProjectIndex(idx)}
                          className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                        >
                          Editar →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit Modal */}
              {editingProjectIndex !== null && currentData.projects?.[editingProjectIndex] && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                      <div>
                        <h3 className="font-bold text-white text-base">
                          Editar Proyecto #{editingProjectIndex + 1}
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Editando versión en{" "}
                          <span className="font-semibold text-blue-400">
                            {activeLang === "es" ? "🇪🇸 Español" : "🇺🇸 English"}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <LanguageTabSelector size="sm" />
                        <button
                          onClick={() => setEditingProjectIndex(null)}
                          className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Cerrar"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Título del Proyecto</label>
                        <input
                          type="text"
                          value={currentData.projects[editingProjectIndex].title}
                          onChange={(e) => updateProjectField(editingProjectIndex, "title", e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Sector / Categoría</label>
                        <input
                          type="text"
                          value={currentData.projects[editingProjectIndex].sector || ""}
                          onChange={(e) => updateProjectField(editingProjectIndex, "sector", e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción</label>
                      <textarea
                        rows={3}
                        value={currentData.projects[editingProjectIndex].description}
                        onChange={(e) => updateProjectField(editingProjectIndex, "description", e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Impacto / Métrica</label>
                      <input
                        type="text"
                        value={currentData.projects[editingProjectIndex].impact}
                        onChange={(e) => updateProjectField(editingProjectIndex, "impact", e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    {/* Image Management: projects/{projectId}/images/ */}
                    <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5 text-blue-400" />
                          <span>Captura / Imagen</span>
                        </label>
                        <span className="text-[11px] text-slate-400 font-mono">
                          projects/{currentData.projects[editingProjectIndex].id}/images/
                        </span>
                      </div>

                      {currentData.projects[editingProjectIndex].image && (
                        <div className="relative h-32 w-full rounded-lg overflow-hidden bg-slate-900 border border-slate-700">
                          <Image
                            src={currentData.projects[editingProjectIndex].image}
                            alt="Preview"
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="file"
                          ref={projectFileInputRef}
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleProjectImageUpload(e.target.files[0]);
                            }
                          }}
                        />
                        <button
                          type="button"
                          disabled={uploadingImage}
                          onClick={() => projectFileInputRef.current?.click()}
                          className="flex items-center justify-center gap-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-300 px-4 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingImage ? `Subiendo (${uploadProgress}%)...` : "Subir a projects/.../images"}</span>
                        </button>
                        <input
                          type="text"
                          value={currentData.projects[editingProjectIndex].image}
                          onChange={(e) => updateProjectField(editingProjectIndex, "image", e.target.value)}
                          placeholder="O escribe una URL directa..."
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Tecnologías (separadas por coma)
                      </label>
                      <input
                        type="text"
                        value={currentData.projects[editingProjectIndex].tech?.join(", ") || ""}
                        onChange={(e) =>
                          updateProjectField(
                            editingProjectIndex,
                            "tech",
                            e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                          )
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">URL de Demo</label>
                        <input
                          type="text"
                          value={currentData.projects[editingProjectIndex].demo}
                          onChange={(e) => updateProjectField(editingProjectIndex, "demo", e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">URL de Código</label>
                        <input
                          type="text"
                          value={currentData.projects[editingProjectIndex].code}
                          onChange={(e) => updateProjectField(editingProjectIndex, "code", e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setEditingProjectIndex(null)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-xs font-semibold"
                      >
                        Listo
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: PERSONAL DATA (Includes About Me, Rich Text / Base64 & ProfilePhoto) */}
          {/* ========================================================= */}
          {activeTab === "personalData" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Módulo: personalData ({activeLang.toUpperCase()})</h2>
                  <p className="text-xs text-slate-400">
                    Incluye datos personales, foto de perfil (<code className="text-blue-400">profilePhoto/</code>) y narrativa biográfica en llaves (con soporte para texto enriquecido / Base64).
                  </p>
                </div>
                <LanguageTabSelector size="sm" />
              </div>

              {/* Profile Photo Uploader */}
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 flex flex-col sm:flex-row items-center gap-5">
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-slate-900 border-2 border-slate-700 shrink-0">
                  {currentData.personal?.profilePhoto ? (
                    <Image
                      src={currentData.personal.profilePhoto}
                      alt="Profile"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                      Sin foto
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">Foto de Perfil</span>
                    <span className="text-[11px] text-slate-400 font-mono">profilePhoto/&#123;filename&#125;</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="file"
                      ref={profileFileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleProfilePhotoUpload(e.target.files[0]);
                        }
                      }}
                    />
                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={() => profileFileInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-300 px-3.5 py-2 rounded-xl text-xs font-semibold disabled:opacity-50"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? `Subiendo (${uploadProgress}%)...` : "Subir Foto a profilePhoto/"}</span>
                    </button>
                    <input
                      type="text"
                      value={currentData.personal?.profilePhoto || ""}
                      onChange={(e) =>
                        setCurrentData((prev) => ({
                          ...prev,
                          personal: { ...prev.personal, profilePhoto: e.target.value },
                        }))
                      }
                      placeholder="URL directa de foto de perfil..."
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    value={currentData.personal?.name || ""}
                    onChange={(e) =>
                      setCurrentData((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, name: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Título / Rol Profesional</label>
                  <input
                    type="text"
                    value={currentData.personal?.role || ""}
                    onChange={(e) =>
                      setCurrentData((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, role: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Bio & Story (Rich Text / Base64 Compatible) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Biografía Principal (bio)
                </label>
                <textarea
                  rows={3}
                  value={currentData.personal?.bio || ""}
                  onChange={(e) =>
                    setCurrentData((prev) => ({
                      ...prev,
                      personal: { ...prev.personal, bio: e.target.value },
                    }))
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white resize-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Historia / Pitch Narrativo (story / aboutMe)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const currentVal = currentData.about?.story || currentData.personal?.story || "";
                      if (!isStoryBase64) {
                        try {
                          const encoded = btoa(unescape(encodeURIComponent(currentVal)));
                          setCurrentData((prev) => ({
                            ...prev,
                            personal: { ...prev.personal, story: encoded },
                            about: { ...(prev.about || { story: "", skills: { backend: [], frontend: [], services: [] } }), story: encoded },
                          }));
                          setIsStoryBase64(true);
                        } catch (e) {
                          alert("Error codificando a Base64");
                        }
                      } else {
                        try {
                          const decoded = decodeURIComponent(escape(atob(currentVal)));
                          setCurrentData((prev) => ({
                            ...prev,
                            personal: { ...prev.personal, story: decoded },
                            about: { ...(prev.about || { story: "", skills: { backend: [], frontend: [], services: [] } }), story: decoded },
                          }));
                          setIsStoryBase64(false);
                        } catch (e) {
                          alert("Error decodificando desde Base64");
                        }
                      }
                    }}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-mono flex items-center gap-1"
                  >
                    <span>{isStoryBase64 ? "Decodificar de Base64" : "Codificar a Base64"}</span>
                  </button>
                </div>
                <textarea
                  rows={5}
                  value={currentData.about?.story || currentData.personal?.story || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCurrentData((prev) => ({
                      ...prev,
                      personal: { ...prev.personal, story: val },
                      about: { ...(prev.about || { story: "", skills: { backend: [], frontend: [], services: [] } }), story: val },
                    }));
                  }}
                  placeholder="Escribe en texto plano, HTML enriquecido o pega tu string Base64..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={currentData.personal?.email || ""}
                    onChange={(e) =>
                      setCurrentData((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, email: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    value={currentData.personal?.phone || ""}
                    onChange={(e) =>
                      setCurrentData((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, phone: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Ubicación</label>
                  <input
                    type="text"
                    value={currentData.personal?.location || ""}
                    onChange={(e) =>
                      setCurrentData((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, location: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Perfil LinkedIn</label>
                  <input
                    type="text"
                    value={currentData.personal?.linkedin || ""}
                    onChange={(e) =>
                      setCurrentData((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, linkedin: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Perfil GitHub</label>
                  <input
                    type="text"
                    value={currentData.personal?.github || ""}
                    onChange={(e) =>
                      setCurrentData((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, github: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                  <input
                    type="checkbox"
                    checked={Boolean(currentData.personal?.available)}
                    onChange={(e) =>
                      setCurrentData((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, available: e.target.checked },
                      }))
                    }
                    className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span>Disponible para nuevas oportunidades laborales / proyectos</span>
                </label>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: EXPERIENCE */}
          {/* ========================================================= */}
          {activeTab === "experience" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Módulo: experience ({activeLang.toUpperCase()})</h2>
                  <p className="text-xs text-slate-400">Trayectoria laboral y logros clave.</p>
                </div>
                <div className="flex items-center gap-3">
                  <LanguageTabSelector size="sm" />
                  <button
                    onClick={() => {
                      const newExp: Experience = {
                        id: Date.now(),
                        company: "Empresa",
                        position: "Full Stack Developer",
                        period: "2024 – Presente",
                        location: "Remoto",
                        description: "",
                        achievements: [""],
                      };
                      setCurrentData((prev) => ({ ...prev, experience: [newExp, ...prev.experience] }));
                    }}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Empleo</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {currentData.experience?.map((exp, idx) => (
                  <div key={idx} className="bg-slate-800/60 border border-slate-700 p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-400">Empleo #{idx + 1}</span>
                      <button
                        onClick={() => {
                          if (confirm("¿Eliminar este empleo?")) {
                            setCurrentData((prev) => ({
                              ...prev,
                              experience: prev.experience.filter((_, i) => i !== idx),
                            }));
                          }
                        }}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Eliminar
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Empresa</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCurrentData((prev) => {
                              const updated = [...prev.experience];
                              updated[idx] = { ...updated[idx], company: val };
                              return { ...prev, experience: updated };
                            });
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Cargo</label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCurrentData((prev) => {
                              const updated = [...prev.experience];
                              updated[idx] = { ...updated[idx], position: val };
                              return { ...prev, experience: updated };
                            });
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Periodo</label>
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCurrentData((prev) => {
                              const updated = [...prev.experience];
                              updated[idx] = { ...updated[idx], period: val };
                              return { ...prev, experience: updated };
                            });
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Ubicación</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCurrentData((prev) => {
                              const updated = [...prev.experience];
                              updated[idx] = { ...updated[idx], location: val };
                              return { ...prev, experience: updated };
                            });
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Descripción</label>
                      <textarea
                        rows={2}
                        value={exp.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCurrentData((prev) => {
                            const updated = [...prev.experience];
                            updated[idx] = { ...updated[idx], description: val };
                            return { ...prev, experience: updated };
                          });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Logros (uno por línea)</label>
                      <textarea
                        rows={3}
                        value={exp.achievements?.join("\n") || ""}
                        onChange={(e) => {
                          const val = e.target.value.split("\n");
                          setCurrentData((prev) => {
                            const updated = [...prev.experience];
                            updated[idx] = { ...updated[idx], achievements: val };
                            return { ...prev, experience: updated };
                          });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: SKILLS (Unified) */}
          {/* ========================================================= */}
          {activeTab === "skills" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Módulo: skills ({activeLang.toUpperCase()})</h2>
                  <p className="text-xs text-slate-400">
                    Agrupación consolidada de habilidades por categoría (Backend, Frontend, Database, Cloud) sin duplicación.
                  </p>
                </div>
                <LanguageTabSelector size="sm" />
              </div>

              {(["backend", "frontend", "database", "cloud"] as const).map((category) => {
                const categoryList = (currentData.skills as any)?.[category] || [];
                const stringValues = categoryList
                  .map((item: any) => (typeof item === "string" ? item : item.name))
                  .join(", ");

                return (
                  <div key={category} className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                        {category} ({categoryList.length})
                      </label>
                      <span className="text-[11px] text-slate-500">Valores separados por coma</span>
                    </div>

                    <input
                      type="text"
                      value={stringValues}
                      onChange={(e) => {
                        const tags = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                        setCurrentData((prev) => {
                          const updatedSkills = { ...(prev.skills as any), [category]: tags };
                          return {
                            ...prev,
                            skills: updatedSkills,
                            about: {
                              ...(prev.about || { story: "", skills: { backend: [], frontend: [], services: [] } }),
                              skills: {
                                ...(prev.about?.skills || { backend: [], frontend: [], services: [] }),
                                ...(category === "cloud"
                                  ? { services: tags.map((t) => ({ name: t, logo: t.toLowerCase().replace(/[^a-z0-9]/g, "") })) }
                                  : { [category]: tags.map((t) => ({ name: t, logo: t.toLowerCase().replace(/[^a-z0-9]/g, "") })) }),
                              },
                            },
                          };
                        });
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />

                    {/* Chips preview */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {categoryList.map((item: any, i: number) => {
                        const name = typeof item === "string" ? item : item.name;
                        return (
                          <span key={i} className="text-[11px] bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded-lg">
                            {name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: CERTIFICATES */}
          {/* ========================================================= */}
          {activeTab === "certificates" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Módulo: certificates ({activeLang.toUpperCase()})</h2>
                  <p className="text-xs text-slate-400">
                    Rutas de almacenamiento: <code className="text-blue-400">certificates/&#123;id&#125;/image/</code> y{" "}
                    <code className="text-blue-400">certificates/&#123;id&#125;/document/</code>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <LanguageTabSelector size="sm" />
                  <button
                    onClick={handleAddCertificate}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nueva Certificación</span>
                  </button>
                </div>
              </div>

              {/* Hidden file inputs for certificates */}
              <input
                type="file"
                ref={certImageInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0] && activeCertIndex !== null) {
                    handleCertImageUpload(e.target.files[0], activeCertIndex);
                  }
                }}
              />
              <input
                type="file"
                ref={certDocInputRef}
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0] && activeCertIndex !== null) {
                    handleCertDocUpload(e.target.files[0], activeCertIndex);
                  }
                }}
              />

              <div className="space-y-4">
                {currentData.certifications?.map((rawCert, idx) => {
                  const cert = getCertObject(rawCert, idx);
                  return (
                    <div key={idx} className="bg-slate-800/60 border border-slate-700 p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-400">Certificación #{idx + 1}</span>
                        <button
                          onClick={() => {
                            if (confirm("¿Eliminar esta certificación?")) {
                              setCurrentData((prev) => ({
                                ...prev,
                                certifications: prev.certifications.filter((_, i) => i !== idx),
                              }));
                            }
                          }}
                          className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Eliminar
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] text-slate-400 mb-1">Nombre de la Certificación</label>
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) => updateCertificateField(idx, "name", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Emisor / Institución</label>
                          <input
                            type="text"
                            value={cert.institution || ""}
                            onChange={(e) => updateCertificateField(idx, "institution", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>
                      </div>

                      {/* Storage files: Image & Document */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {/* Certificate Image */}
                        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/60 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-300 flex items-center gap-1">
                              <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                              Imagen del Certificado
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">image/</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveCertIndex(idx);
                                certImageInputRef.current?.click();
                              }}
                              className="bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-300 px-3 py-1.5 rounded-lg text-xs font-semibold"
                            >
                              Subir Imagen
                            </button>
                            <input
                              type="text"
                              value={cert.image || ""}
                              onChange={(e) => updateCertificateField(idx, "image", e.target.value)}
                              placeholder="URL de imagen..."
                              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white"
                            />
                          </div>
                        </div>

                        {/* Certificate Document (PDF) */}
                        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/60 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-300 flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5 text-emerald-400" />
                              Documento / PDF
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">document/</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveCertIndex(idx);
                                certDocInputRef.current?.click();
                              }}
                              className="bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-lg text-xs font-semibold"
                            >
                              Subir Documento
                            </button>
                            <input
                              type="text"
                              value={cert.document || ""}
                              onChange={(e) => updateCertificateField(idx, "document", e.target.value)}
                              placeholder="URL de PDF o documento..."
                              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: COURSES */}
          {/* ========================================================= */}
          {activeTab === "courses" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Módulo: courses ({activeLang.toUpperCase()})</h2>
                  <p className="text-xs text-slate-400">Cursos completados e instituciones formativas.</p>
                </div>
                <div className="flex items-center gap-3">
                  <LanguageTabSelector size="sm" />
                  <button
                    onClick={() => {
                      const newCourse: Course = {
                        id: Date.now(),
                        name: "Nuevo Curso",
                        institution: "Institución",
                      };
                      setCurrentData((prev) => ({
                        ...prev,
                        courses: [newCourse, ...(prev.courses || [])],
                      }));
                    }}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Curso</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {currentData.courses?.map((course, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-center gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700"
                  >
                    <input
                      type="text"
                      value={course.name}
                      placeholder="Nombre del curso"
                      onChange={(e) => {
                        const val = e.target.value;
                        setCurrentData((prev) => {
                          const list = [...prev.courses];
                          list[idx] = { ...list[idx], name: val };
                          return { ...prev, courses: list };
                        });
                      }}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={course.institution}
                      placeholder="Institución"
                      onChange={(e) => {
                        const val = e.target.value;
                        setCurrentData((prev) => {
                          const list = [...prev.courses];
                          list[idx] = { ...list[idx], institution: val };
                          return { ...prev, courses: list };
                        });
                      }}
                      className="w-full sm:w-60 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                    <button
                      onClick={() => {
                        setCurrentData((prev) => ({
                          ...prev,
                          courses: prev.courses.filter((_, i) => i !== idx),
                        }));
                      }}
                      className="text-slate-400 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 7: LANGUAGES */}
          {/* ========================================================= */}
          {activeTab === "languages" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Módulo: languages ({activeLang.toUpperCase()})</h2>
                  <p className="text-xs text-slate-400">Idiomas dominados y porcentaje de fluidez.</p>
                </div>
                <div className="flex items-center gap-3">
                  <LanguageTabSelector size="sm" />
                  <button
                    onClick={() => {
                      const newLang: Language = {
                        id: Date.now(),
                        name: "Nuevo Idioma",
                        level: "Intermedio",
                        percentage: 60,
                      };
                      setCurrentData((prev) => ({
                        ...prev,
                        languages: [newLang, ...(prev.languages || [])],
                      }));
                    }}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Idioma</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentData.languages?.map((lang, idx) => (
                  <div key={idx} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={lang.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCurrentData((prev) => {
                            const list = [...prev.languages];
                            list[idx] = { ...list[idx], name: val };
                            return { ...prev, languages: list };
                          });
                        }}
                        className="font-semibold text-white bg-transparent border-b border-slate-700 focus:border-blue-500 outline-none text-xs"
                      />
                      <button
                        onClick={() => {
                          setCurrentData((prev) => ({
                            ...prev,
                            languages: prev.languages.filter((_, i) => i !== idx),
                          }));
                        }}
                        className="text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={lang.level}
                        placeholder="Nivel (e.g. B2, Nativo)"
                        onChange={(e) => {
                          const val = e.target.value;
                          setCurrentData((prev) => {
                            const list = [...prev.languages];
                            list[idx] = { ...list[idx], level: val };
                            return { ...prev, languages: list };
                          });
                        }}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                      />
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={lang.percentage}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setCurrentData((prev) => {
                              const list = [...prev.languages];
                              list[idx] = { ...list[idx], percentage: val };
                              return { ...prev, languages: list };
                            });
                          }}
                          className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white text-center"
                        />
                        <span className="text-xs text-slate-400">%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 8: JSON AVANZADO */}
          {/* ========================================================= */}
          {activeTab === "json" && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                    <FileCode className="w-5 h-5" />
                    Modo JSON ({activeLang.toUpperCase()})
                  </h2>
                  <p className="text-xs text-slate-400">
                    Edición directa o respaldo completo de los módulos.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <LanguageTabSelector size="sm" />
                  <button
                    onClick={handleApplyJson}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs cursor-pointer shadow-sm transition-colors"
                  >
                    Aplicar al Formulario
                  </button>
                </div>
              </div>

              {jsonError && (
                <div className="p-3 bg-red-500/20 border border-red-500/40 text-red-300 rounded-lg text-xs">
                  {jsonError}
                </div>
              )}

              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                spellCheck={false}
                rows={25}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
