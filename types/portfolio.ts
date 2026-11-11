export interface PersonalData {
  name: string;
  role: string;
  bio: string;
  story?: string; // Rich text / base64 or markdown narrative
  profilePhoto?: string;
  email: string;
  location: string;
  phone: string;
  linkedin: string;
  github: string;
  available?: boolean;
}

export type Personal = PersonalData;

export interface SkillItem {
  name: string;
  logo: string;
  level?: string;
}

export type Skill = SkillItem;

export interface UnifiedSkills {
  backend: SkillItem[];
  frontend: SkillItem[];
  database: SkillItem[];
  cloud: SkillItem[];
}

export interface About {
  story: string;
  skills: {
    backend: SkillItem[];
    frontend: SkillItem[];
    services: SkillItem[];
  };
}

export interface Project {
  id: number | string;
  title: string;
  description: string;
  sector?: string;
  tech: string[];
  image: string;
  demo: string;
  code: string;
  impact: string;
}

export interface Experience {
  id?: string | number;
  company: string;
  position: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  tech?: string[];
}

export interface Skills {
  backend: (string | SkillItem)[];
  frontend: (string | SkillItem)[];
  database: (string | SkillItem)[];
  cloud: (string | SkillItem)[];
}

export interface CertificateItem {
  id: string | number;
  name: string;
  institution?: string;
  date?: string;
  image?: string;
  document?: string;
  credentialUrl?: string;
}

export interface Course {
  id?: string | number;
  name: string;
  institution: string;
  date?: string;
}

export interface Language {
  id?: string | number;
  name: string;
  level: string;
  percentage: number;
}

export interface Reference {
  name: string;
  position: string;
  email: string;
  phone: string;
}

export interface PortfolioData {
  personal: PersonalData;
  about: About;
  projects: Project[];
  experience: Experience[];
  skills: Skills | UnifiedSkills;
  certifications: (string | CertificateItem)[];
  courses: Course[];
  languages: Language[];
  references?: Reference[];
}
