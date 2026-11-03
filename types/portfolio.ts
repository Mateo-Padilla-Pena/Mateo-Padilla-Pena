export interface Personal {
  name: string;
  role: string;
  bio: string;
  email: string;
  location: string;
  phone: string;
  linkedin: string;
  github: string;
}

export interface Skill {
  name: string;
  logo: string;
}

export interface About {
  story: string;
  skills: {
    backend: Skill[];
    frontend: Skill[];
    services: Skill[];
  };
}

export interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  image: string;
  demo: string;
  code: string;
  impact: string;
}

export interface Experience {
  company: string;
  position: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
}

export interface Skills {
  backend: string[];
  frontend: string[];
  database: string[];
  cloud: string[];
}

export interface Course {
  name: string;
  institution: string;
}

export interface Language {
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
  personal: Personal;
  about: About;
  projects: Project[];
  experience: Experience[];
  skills: Skills;
  certifications: string[];
  courses: Course[];
  languages: Language[];
  references: Reference[];
}
