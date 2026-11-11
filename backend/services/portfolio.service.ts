import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import localPortfolioData from "@/data/portfolio.json";
import { PortfolioData, PersonalData, Project, Experience, Skills, CertificateItem, Course, Language } from "@/types/portfolio";
import {
  personalDataSchema,
  projectsSchema,
  experiencesSchema,
  skillsSchema,
  certificatesSchema,
  coursesSchema,
  languagesSchema,
  validateWithSchema,
} from "@/backend/schemas";

export interface BilingualPortfolioContent {
  es: PortfolioData;
  en: PortfolioData;
  updatedAt?: string;
}

export type PortfolioModuleName =
  | "projects"
  | "personalData"
  | "experience"
  | "skills"
  | "certificates"
  | "courses"
  | "languages";

export class PortfolioService {
  private readonly collectionName = "portfolio";

  private getDocRef(docId: string = "content") {
    return doc(db, this.collectionName, docId);
  }

  /**
   * Obtiene los datos locales por defecto desde data/portfolio.json
   */
  getDefaultContent(): BilingualPortfolioContent {
    return {
      es: localPortfolioData.es as unknown as PortfolioData,
      en: localPortfolioData.en as unknown as PortfolioData,
    };
  }

  /**
   * Valida un módulo específico utilizando su respectivo esquema Joi
   */
  validateModule(moduleName: PortfolioModuleName, data: unknown) {
    switch (moduleName) {
      case "projects":
        return validateWithSchema(projectsSchema, data);
      case "personalData":
        return validateWithSchema(personalDataSchema, data);
      case "experience":
        return validateWithSchema(experiencesSchema, data);
      case "skills":
        return validateWithSchema(skillsSchema, data);
      case "certificates":
        return validateWithSchema(certificatesSchema, data);
      case "courses":
        return validateWithSchema(coursesSchema, data);
      case "languages":
        return validateWithSchema(languagesSchema, data);
      default:
        return { isValid: true, value: data };
    }
  }

  /**
   * Valida todos los módulos de un conjunto de datos bilingüe
   */
  validateAllContent(content: { es: PortfolioData; en: PortfolioData }) {
    const modules: { name: PortfolioModuleName; extract: (p: PortfolioData) => unknown }[] = [
      { name: "personalData", extract: (p) => ({ ...p.personal, story: p.about?.story || p.personal?.story }) },
      { name: "projects", extract: (p) => p.projects },
      { name: "experience", extract: (p) => p.experience },
      { name: "skills", extract: (p) => p.skills },
      { name: "certificates", extract: (p) => p.certifications },
      { name: "courses", extract: (p) => p.courses },
      { name: "languages", extract: (p) => p.languages },
    ];

    for (const lang of ["es", "en"] as const) {
      const target = content[lang];
      for (const mod of modules) {
        const val = this.validateModule(mod.name, mod.extract(target));
        if (!val.isValid) {
          throw new Error(`[${lang.toUpperCase()} - ${mod.name}]: ${val.error}`);
        }
      }
    }
  }

  /**
   * Consulta el contenido bilingüe desde Firestore. Si no existe documento remoto, hay timeout o no hay conexión, retorna null de forma segura.
   */
  async getRemoteContent(): Promise<BilingualPortfolioContent | null> {
    try {
      // Timeout de 4 segundos para evitar que peticiones lentas o bloqueadas cuelguen en background
      const fetchPromise = getDoc(this.getDocRef("content"));
      const timeoutPromise = new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), 4000)
      );

      const docSnap = await Promise.race([fetchPromise, timeoutPromise]);
      if (docSnap && "exists" in docSnap && docSnap.exists()) {
        const data = docSnap.data();
        return {
          es: data.es as PortfolioData,
          en: data.en as PortfolioData,
          updatedAt: data.updatedAt,
        };
      }
      return null;
    } catch (err: any) {
      console.warn("Aviso al consultar contenido remoto en Firestore:", err.message);
      return null;
    }
  }

  /**
   * Guarda de manera modular cada colección en Firestore y actualiza el documento compilado /portfolio/content
   */
  async saveContent(content: { es: PortfolioData; en: PortfolioData }): Promise<void> {
    // 1. Validar todos los módulos con Joi antes de persistir
    this.validateAllContent(content);

    const timestamp = new Date().toISOString();

    // 2. Persistir documentos modulares independientes
    const modulesToSave = [
      {
        id: "personalData",
        data: {
          es: { ...content.es.personal, story: content.es.about?.story || content.es.personal?.story },
          en: { ...content.en.personal, story: content.en.about?.story || content.en.personal?.story },
        },
      },
      {
        id: "projects",
        data: { es: content.es.projects, en: content.en.projects },
      },
      {
        id: "experience",
        data: { es: content.es.experience, en: content.en.experience },
      },
      {
        id: "skills",
        data: { es: content.es.skills, en: content.en.skills },
      },
      {
        id: "certificates",
        data: { es: content.es.certifications, en: content.en.certifications },
      },
      {
        id: "courses",
        data: { es: content.es.courses, en: content.en.courses },
      },
      {
        id: "languages",
        data: { es: content.es.languages, en: content.en.languages },
      },
    ];

    await Promise.all(
      modulesToSave.map((mod) =>
        setDoc(this.getDocRef(mod.id), {
          ...mod.data,
          updatedAt: timestamp,
        })
      )
    );

    // 3. Actualizar documento compilado central para entrega ultrarrápida a visitantes públicos
    await setDoc(this.getDocRef("content"), {
      es: content.es,
      en: content.en,
      updatedAt: timestamp,
    });
  }
}

export const portfolioService = new PortfolioService();

