import type { PortfolioData } from "@/types/portfolio";

export type CvTheme = "light" | "dark";

export interface GenerateCvHtmlParams {
  data: PortfolioData;
  language: "es" | "en";
  theme?: CvTheme;
  avatarBase64?: string;
  standalone?: boolean;
}

export function generateCvHtml({
  data,
  language,
  theme = "light",
  avatarBase64 = "/portfolio-image.jpeg",
  standalone = false,
}: GenerateCvHtmlParams): string {
  const isEs = language === "es";

  const labels = {
    profile: isEs ? "Perfil Profesional" : "Professional Profile",
    experience: isEs ? "Experiencia Profesional" : "Professional Experience",
    projects: isEs ? "Proyectos Destacados" : "Featured Projects",
    skills: isEs ? "Habilidades Técnicas" : "Technical Skills",
    backend: isEs ? "Backend & Arquitectura" : "Backend & Architecture",
    frontend: isEs ? "Frontend & UI Moderno" : "Frontend & Modern UI",
    database: isEs ? "Bases de Datos & Cloud" : "Databases & Cloud",
    languages: isEs ? "Idiomas" : "Languages",
    certifications: isEs ? "Certificados & Cursos" : "Certifications & Courses",
    references: isEs ? "Referencias Profesionales" : "Professional References",
    native: isEs ? "Nativo" : "Native",
    spanish: isEs ? "Español" : "Spanish",
    english: "English",
  };

  const certifications = [
    { title: "Rest API Intermediate", issuer: "HackerRank" },
    { title: "JavaScript Intermediate", issuer: "HackerRank" },
    { title: "Python & Problem Solving Basic", issuer: "HackerRank" },
    { title: "Java Architecture & Programming", issuer: "Edutin Academy" },
    { title: "Django Enterprise Framework", issuer: "OpenBootcamp" },
  ];

  const scopedStyles = `
    /* Fix html2canvas FontMetrics baseline calculation broken by Tailwind Preflight (img { display: block }) */
    img[src^="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP"] {
      display: inline !important;
      vertical-align: baseline !important;
    }

    #cv-export-root,
    #cv-export-root *,
    #cv-export-root *::before,
    #cv-export-root *::after {
      box-sizing: border-box;
    }

    #cv-export-root {
      width: 794px;
      max-width: 794px;
      margin: 0 auto;
      background-color: #ffffff;
      color: #0f172a;
      font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.58;
      -webkit-font-smoothing: antialiased;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      padding: 50px 48px;
      text-align: left;
    }

    #cv-export-root[data-theme="dark"] {
      background-color: #0b1120;
      color: #f8fafc;
    }

    #cv-export-root h1,
    #cv-export-root h2,
    #cv-export-root h3,
    #cv-export-root p,
    #cv-export-root div,
    #cv-export-root span,
    #cv-export-root header,
    #cv-export-root section,
    #cv-export-root footer {
      margin: 0;
      padding: 0;
    }

    /* Encabezado */
    #cv-export-root .header-card {
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-left: 5px solid #2563eb;
      border-radius: 10px;
      padding: 20px 22px;
      margin-bottom: 21px;
      display: flex;
      align-items: center;
      gap: 18px;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
    }

    #cv-export-root[data-theme="dark"] .header-card {
      background: linear-gradient(135deg, #0f172a 0%, #111827 100%);
      border: 1px solid #1e293b;
      border-left: 5px solid #38bdf8;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
    }

    #cv-export-root .avatar-wrapper {
      position: relative;
      flex-shrink: 0;
      width: 82px;
      height: 82px;
      border-radius: 50%;
      overflow: hidden;
      border: 2.5px solid #2563eb;
      background-color: #f8fafc;
    }

    #cv-export-root[data-theme="dark"] .avatar-wrapper {
      border-color: #38bdf8;
      background-color: #0f172a;
    }

    #cv-export-root .avatar-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      object-position: center;
      display: block;
    }

    #cv-export-root .header-info {
      flex: 1;
      min-width: 0;
    }

    #cv-export-root .header-name {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.4px;
      margin: 0 0 9px 0;
      color: #0f172a;
      line-height: 1.22;
    }

    #cv-export-root[data-theme="dark"] .header-name {
      color: #f8fafc;
    }

    #cv-export-root .header-role {
      display: inline-block;
      font-family: 'JetBrains Mono', 'Cascadia Mono', 'Consolas', monospace;
      font-size: 11.5px;
      font-weight: 600;
      color: #1d4ed8;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      padding: 5.5px 11px;
      border-radius: 6px;
      margin: 0 0 13px 0;
      line-height: 1.38;
    }

    #cv-export-root[data-theme="dark"] .header-role {
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.12);
      border-color: rgba(56, 189, 248, 0.3);
    }

    #cv-export-root .header-contacts {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 9px 16px;
      font-size: 10.5px;
      color: #475569;
      line-height: 1.48;
    }

    #cv-export-root[data-theme="dark"] .header-contacts {
      color: #cbd5e1;
    }

    #cv-export-root .meta-item {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      color: #475569;
      text-decoration: none;
    }

    #cv-export-root[data-theme="dark"] .meta-item {
      color: #cbd5e1;
    }

    #cv-export-root .meta-icon {
      color: #2563eb;
      flex-shrink: 0;
    }

    #cv-export-root[data-theme="dark"] .meta-icon {
      color: #38bdf8;
    }

    /* Bloques de Sección */
    #cv-export-root .cv-section {
      margin-bottom: 21px;
    }

    #cv-export-root .section-title-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }

    #cv-export-root .section-icon {
      color: #2563eb;
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
    }

    #cv-export-root[data-theme="dark"] .section-icon {
      color: #38bdf8;
    }

    #cv-export-root .section-title-text {
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.6px;
      color: #0f172a;
      text-transform: uppercase;
      line-height: 1.32;
    }

    #cv-export-root[data-theme="dark"] .section-title-text {
      color: #f8fafc;
    }

    #cv-export-root .section-divider {
      flex: 1;
      height: 1px;
      background: #e2e8f0;
    }

    #cv-export-root[data-theme="dark"] .section-divider {
      background: #1e293b;
    }

    /* Perfil Profesional */
    #cv-export-root .profile-card {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 3.5px solid #2563eb;
      border-radius: 0 8px 8px 0;
      padding: 15px 16px;
      font-size: 10.8px;
      color: #334155;
      line-height: 1.65;
    }

    #cv-export-root[data-theme="dark"] .profile-card {
      background-color: #0f172a;
      border-color: #1e293b;
      border-left-color: #38bdf8;
      color: #cbd5e1;
    }

    /* Línea de Tiempo de Experiencia */
    #cv-export-root .timeline-container {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    #cv-export-root .timeline-job {
      position: relative;
      padding-left: 17px;
      border-left: 2px solid #bfdbfe;
    }

    #cv-export-root[data-theme="dark"] .timeline-job {
      border-left-color: rgba(56, 189, 248, 0.35);
    }

    #cv-export-root .timeline-job:last-child {
      border-left: 2px solid #e2e8f0;
    }

    #cv-export-root[data-theme="dark"] .timeline-job:last-child {
      border-left-color: #1e293b;
    }

    #cv-export-root .timeline-node {
      position: absolute;
      left: -6px;
      top: 4px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #2563eb;
      border: 2px solid #ffffff;
      box-shadow: 0 0 0 1.5px #bfdbfe;
    }

    #cv-export-root[data-theme="dark"] .timeline-node {
      background-color: #38bdf8;
      border-color: #0b1120;
      box-shadow: 0 0 0 1.5px rgba(56, 189, 248, 0.4);
    }

    #cv-export-root .job-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 7px;
    }

    #cv-export-root .job-role {
      font-size: 13.2px;
      font-weight: 700;
      color: #1d4ed8;
      line-height: 1.32;
    }

    #cv-export-root[data-theme="dark"] .job-role {
      color: #38bdf8;
    }

    #cv-export-root .job-company-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: #0f172a;
      margin-top: 5.5px;
      line-height: 1.38;
    }

    #cv-export-root[data-theme="dark"] .job-company-row {
      color: #f8fafc;
    }

    #cv-export-root .job-company {
      font-weight: 700;
    }

    #cv-export-root .job-location {
      color: #64748b;
      font-size: 10px;
      display: inline-flex;
      align-items: center;
      gap: 3px;
    }

    #cv-export-root[data-theme="dark"] .job-location {
      color: #94a3b8;
    }

    #cv-export-root .job-period-pill {
      font-family: 'JetBrains Mono', 'Cascadia Mono', 'Consolas', monospace;
      font-size: 9.6px;
      font-weight: 600;
      background: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
      padding: 5px 9.5px;
      border-radius: 12px;
      white-space: nowrap;
      flex-shrink: 0;
      line-height: 1.38;
    }

    #cv-export-root[data-theme="dark"] .job-period-pill {
      background: rgba(56, 189, 248, 0.12);
      color: #38bdf8;
      border-color: rgba(56, 189, 248, 0.28);
    }

    #cv-export-root .job-desc {
      font-size: 10.6px;
      color: #334155;
      margin: 7px 0 10px 0;
      line-height: 1.58;
    }

    #cv-export-root[data-theme="dark"] .job-desc {
      color: #cbd5e1;
    }

    #cv-export-root .achievements-list {
      display: flex;
      flex-direction: column;
      gap: 7px;
      margin-bottom: 7px;
    }

    #cv-export-root .achievement-item {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      font-size: 10.2px;
      color: #475569;
      line-height: 1.55;
    }

    #cv-export-root[data-theme="dark"] .achievement-item {
      color: #cbd5e1;
    }

    #cv-export-root .achievement-bullet {
      color: #2563eb;
      flex-shrink: 0;
      font-size: 10px;
      line-height: 1.48;
    }

    #cv-export-root[data-theme="dark"] .achievement-bullet {
      color: #38bdf8;
    }

    #cv-export-root .job-tech-stack {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 7px;
    }

    #cv-export-root .tech-pill {
      font-family: 'JetBrains Mono', 'Cascadia Mono', 'Consolas', monospace;
      font-size: 9.2px;
      font-weight: 500;
      background-color: #ffffff;
      border: 1px solid #cbd5e1;
      color: #475569;
      padding: 4.5px 7.5px;
      border-radius: 4px;
      line-height: 1.38;
    }

    #cv-export-root[data-theme="dark"] .tech-pill {
      background-color: #1e293b;
      border-color: #334155;
      color: #e2e8f0;
    }

    /* Proyectos Destacados */
    #cv-export-root .projects-grid {
      display: flex;
      flex-direction: column;
      gap: 13px;
    }

    #cv-export-root .project-card {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 13.5px 15px;
    }

    #cv-export-root[data-theme="dark"] .project-card {
      background-color: #0f172a;
      border-color: #1e293b;
    }

    #cv-export-root .project-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      margin-bottom: 7px;
    }

    #cv-export-root .project-title-wrap {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
    }

    #cv-export-root .project-title {
      font-size: 11.8px;
      font-weight: 700;
      color: #1d4ed8;
      line-height: 1.32;
    }

    #cv-export-root[data-theme="dark"] .project-title {
      color: #38bdf8;
    }

    #cv-export-root .project-sector-tag {
      font-family: 'JetBrains Mono', 'Cascadia Mono', 'Consolas', monospace;
      font-size: 8.8px;
      font-weight: 600;
      padding: 4px 7px;
      border-radius: 4px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      color: #475569;
      line-height: 1.38;
    }

    #cv-export-root[data-theme="dark"] .project-sector-tag {
      background: #1e293b;
      border-color: #334155;
      color: #e2e8f0;
    }

    #cv-export-root .project-desc {
      font-size: 10.2px;
      color: #334155;
      line-height: 1.56;
      margin: 0 0 10px 0;
    }

    #cv-export-root[data-theme="dark"] .project-desc {
      color: #cbd5e1;
    }

    #cv-export-root .project-impact {
      font-size: 9px;
      font-weight: 600;
      color: #059669;
      display: inline-flex;
      align-items: center;
      gap: 3.5px;
      flex-shrink: 0;
      line-height: 1.38;
    }

    #cv-export-root[data-theme="dark"] .project-impact {
      color: #34d399;
    }

    /* 2 Columnas: Habilidades y Certificaciones/Idiomas */
    #cv-export-root .bottom-cols-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 21px;
      margin-bottom: 21px;
    }

    #cv-export-root .skills-category {
      margin-bottom: 14px;
    }

    #cv-export-root .skills-category:last-child {
      margin-bottom: 0;
    }

    #cv-export-root .skills-cat-title {
      font-family: 'JetBrains Mono', 'Cascadia Mono', 'Consolas', monospace;
      font-size: 9.6px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.35px;
      margin-bottom: 8px;
      color: #2563eb;
      line-height: 1.38;
    }

    #cv-export-root[data-theme="dark"] .skills-cat-title {
      color: #38bdf8;
    }

    #cv-export-root .skills-badges-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
    }

    #cv-export-root .skill-chip {
      font-size: 9.6px;
      font-weight: 500;
      padding: 5px 8.5px;
      border-radius: 5px;
      line-height: 1.38;
      background-color: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1d4ed8;
    }

    #cv-export-root[data-theme="dark"] .skill-chip {
      background-color: rgba(56, 189, 248, 0.12);
      border-color: rgba(56, 189, 248, 0.28);
      color: #38bdf8;
    }

    #cv-export-root .cert-list {
      margin-bottom: 14px;
    }

    #cv-export-root .cert-item {
      background-color: #f8fafc;
      border-left: 3px solid #2563eb;
      border-top: 1px solid #e2e8f0;
      border-right: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
      border-radius: 0 5px 5px 0;
      padding: 8.5px 10px;
      font-size: 9.6px;
      font-weight: 500;
      color: #0f172a;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      line-height: 1.38;
    }

    #cv-export-root[data-theme="dark"] .cert-item {
      background-color: #0f172a;
      border-left-color: #38bdf8;
      border-top-color: #1e293b;
      border-right-color: #1e293b;
      border-bottom-color: #1e293b;
      color: #f1f5f9;
    }

    #cv-export-root .cert-issuer {
      font-family: 'JetBrains Mono', 'Cascadia Mono', 'Consolas', monospace;
      font-size: 8.6px;
      color: #64748b;
      flex-shrink: 0;
    }

    #cv-export-root[data-theme="dark"] .cert-issuer {
      color: #94a3b8;
    }

    #cv-export-root .lang-item {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8.5px 10px;
      margin-bottom: 8px;
    }

    #cv-export-root[data-theme="dark"] .lang-item {
      background-color: #0f172a;
      border-color: #1e293b;
    }

    #cv-export-root .lang-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9.6px;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 6.5px;
      line-height: 1.38;
    }

    #cv-export-root[data-theme="dark"] .lang-header {
      color: #f1f5f9;
    }

    #cv-export-root .lang-level-badge {
      font-size: 8.6px;
      color: #64748b;
      font-family: 'JetBrains Mono', 'Cascadia Mono', 'Consolas', monospace;
    }

    #cv-export-root[data-theme="dark"] .lang-level-badge {
      color: #94a3b8;
    }

    #cv-export-root .lang-track {
      background-color: #e2e8f0;
      border-radius: 3px;
      height: 5px;
      width: 100%;
      overflow: hidden;
    }

    #cv-export-root[data-theme="dark"] .lang-track {
      background-color: #1e293b;
    }

    #cv-export-root .lang-fill {
      background-color: #2563eb;
      height: 100%;
      border-radius: 3px;
    }

    #cv-export-root[data-theme="dark"] .lang-fill {
      background-color: #38bdf8;
    }

    /* Referencias */
    #cv-export-root .references-section {
      margin-bottom: 19px;
    }

    #cv-export-root .ref-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 13px;
    }

    #cv-export-root .ref-box {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 11.5px 11.5px;
      font-size: 9.2px;
    }

    #cv-export-root[data-theme="dark"] .ref-box {
      background-color: #0f172a;
      border-color: #1e293b;
    }

    #cv-export-root .ref-name {
      font-weight: 700;
      color: #0f172a;
      font-size: 9.8px;
      margin-bottom: 5.5px;
      line-height: 1.32;
    }

    #cv-export-root[data-theme="dark"] .ref-name {
      color: #f8fafc;
    }

    #cv-export-root .ref-role {
      color: #475569;
      font-size: 8.7px;
      line-height: 1.4;
      margin-bottom: 7px;
    }

    #cv-export-root[data-theme="dark"] .ref-role {
      color: #cbd5e1;
    }

    #cv-export-root .ref-contact {
      color: #64748b;
      font-size: 8.5px;
      font-family: 'JetBrains Mono', 'Cascadia Mono', 'Consolas', monospace;
      display: flex;
      flex-direction: column;
      gap: 4.5px;
      line-height: 1.32;
    }

    #cv-export-root[data-theme="dark"] .ref-contact {
      color: #94a3b8;
    }

    /* Footer */
    #cv-export-root .cv-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 11px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9px;
      color: #94a3b8;
      font-family: 'JetBrains Mono', 'Cascadia Mono', 'Consolas', monospace;
      line-height: 1.38;
    }

    #cv-export-root[data-theme="dark"] .cv-footer {
      border-top-color: #1e293b;
      color: #64748b;
    }
  `;

  const cvMarkup = `
  <style>${scopedStyles}</style>
  <div id="cv-export-root" class="cv-document" data-theme="${theme}">
    <header class="header-card">
      <div class="avatar-wrapper">
        <img src="${avatarBase64}" alt="${data.personal.name}" class="avatar-img" crossorigin="anonymous" />
      </div>
      <div class="header-info">
        <h1 class="header-name">${data.personal.name}</h1>
        <div class="header-role">Full Stack Developer</div>
        <div class="header-contacts">
          <span class="meta-item">
            <svg class="meta-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${data.personal.location}</span>
          </span>
          <a href="mailto:${data.personal.email}" class="meta-item">
            <svg class="meta-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <span>${data.personal.email}</span>
          </a>
          <a href="tel:${data.personal.phone.replace(/\s+/g, "")}" class="meta-item">
            <svg class="meta-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span>${data.personal.phone}</span>
          </a>
          <a href="https://${data.personal.linkedin}" target="_blank" class="meta-item">
            <svg class="meta-icon" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.63 1.63 0 0 0-1.63 1.63c0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63 0-.9-.73-1.63-1.63-1.63Z"/></svg>
            <span>${data.personal.linkedin}</span>
          </a>
          <a href="https://${data.personal.github}" target="_blank" class="meta-item">
            <svg class="meta-icon" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"/></svg>
            <span>${data.personal.github}</span>
          </a>
        </div>
      </div>
    </header>

    <section class="cv-section">
      <div class="section-title-wrap">
        <span class="section-icon">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </span>
        <h2 class="section-title-text">${labels.profile}</h2>
        <div class="section-divider"></div>
      </div>
      <div class="profile-card">
        <p>${data.personal.bio}</p>
      </div>
    </section>

    <section class="cv-section">
      <div class="section-title-wrap">
        <span class="section-icon">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
        </span>
        <h2 class="section-title-text">${labels.experience}</h2>
        <div class="section-divider"></div>
      </div>

      <div class="timeline-container">
        ${data.experience
          .map(
            (exp) => `
          <div class="timeline-job">
            <div class="timeline-node"></div>
            <div class="job-top">
              <div>
                <h3 class="job-role">${exp.position}</h3>
                <div class="job-company-row">
                  <span class="job-company">${exp.company}</span>
                  <span style="opacity: 0.4;">•</span>
                  <span class="job-location">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    ${exp.location}
                  </span>
                </div>
              </div>
              <span class="job-period-pill">${exp.period}</span>
            </div>
            <p class="job-desc">${exp.description}</p>
            ${
              exp.achievements && exp.achievements.length > 0
                ? `
              <div class="achievements-list">
                ${exp.achievements
                  .map(
                    (ach) => `
                  <div class="achievement-item">
                    <span class="achievement-bullet">▹</span>
                    <span>${ach}</span>
                  </div>
                `
                  )
                  .join("")}
              </div>
            `
                : ""
            }
          </div>
        `
          )
          .join("")}
      </div>
    </section>

    <section class="cv-section">
      <div class="section-title-wrap">
        <span class="section-icon">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        </span>
        <h2 class="section-title-text">${labels.projects}</h2>
        <div class="section-divider"></div>
      </div>

      <div class="projects-grid">
        ${data.projects
          .map(
            (proj) => `
          <div class="project-card">
            <div class="project-header">
              <div class="project-title-wrap">
                <h3 class="project-title">${proj.title}</h3>
                ${
                  proj.sector
                    ? `<span class="project-sector-tag">${proj.sector}</span>`
                    : ""
                }
              </div>
            </div>
            <p class="project-desc">${proj.description}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px;">
              <div class="job-tech-stack">
                ${(proj.tech || [])
                  .map((t) => `<span class="tech-pill">${t}</span>`)
                  .join("")}
              </div>
              ${
                proj.impact
                  ? `
                <span class="project-impact">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  ${proj.impact}
                </span>
              `
                  : ""
              }
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </section>

    <div class="bottom-cols-grid">
      <div>
        <div class="section-title-wrap">
          <span class="section-icon">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 8 3 3-3 3"/><line x1="14" x2="16" y1="17" y2="17"/></svg>
          </span>
          <h2 class="section-title-text">${labels.skills}</h2>
          <div class="section-divider"></div>
        </div>

        <div class="skills-category">
          <div class="skills-cat-title">${labels.backend}</div>
          <div class="skills-badges-wrap">
            ${(data.about?.skills?.backend || [])
              .map((s) => `<span class="skill-chip">${s.name}</span>`)
              .join("")}
          </div>
        </div>

        <div class="skills-category">
          <div class="skills-cat-title">${labels.frontend}</div>
          <div class="skills-badges-wrap">
            ${(data.about?.skills?.frontend || [])
              .map((s) => `<span class="skill-chip">${s.name}</span>`)
              .join("")}
          </div>
        </div>

        <div class="skills-category">
          <div class="skills-cat-title">${labels.database}</div>
          <div class="skills-badges-wrap">
            ${(data.about?.skills?.services || [])
              .map((s) => `<span class="skill-chip">${s.name}</span>`)
              .join("")}
          </div>
        </div>
      </div>

      <div>
        <div class="section-title-wrap">
          <span class="section-icon">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
          </span>
          <h2 class="section-title-text">${labels.certifications}</h2>
          <div class="section-divider"></div>
        </div>

        <div class="cert-list">
          ${certifications
            .map(
              (c) => `
            <div class="cert-item">
              <span>${c.title}</span>
              <span class="cert-issuer">${c.issuer}</span>
            </div>
          `
            )
            .join("")}
        </div>

        <div>
          <div class="lang-item">
            <div class="lang-header">
              <span>${labels.spanish}</span>
              <span class="lang-level-badge">${labels.native} • 100%</span>
            </div>
            <div class="lang-track">
              <div class="lang-fill" style="width: 100%;"></div>
            </div>
          </div>

          <div class="lang-item">
            <div class="lang-header">
              <span>${labels.english}</span>
              <span class="lang-level-badge">B2 Professional • 75%</span>
            </div>
            <div class="lang-track">
              <div class="lang-fill" style="width: 75%;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    ${
      data.references && data.references.length > 0
        ? `
      <section class="references-section">
        <div class="section-title-wrap">
          <span class="section-icon">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </span>
          <h2 class="section-title-text">${labels.references}</h2>
          <div class="section-divider"></div>
        </div>

        <div class="ref-grid">
          ${data.references
            .map(
              (ref) => `
            <div class="ref-box">
              <div class="ref-name">${ref.name}</div>
              <div class="ref-role">${ref.position}</div>
              <div class="ref-contact">
                <span>${ref.phone}</span>
                <span>${ref.email}</span>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </section>
    `
        : ""
    }

    <footer class="cv-footer">
      <span>${data.personal.name} • Full Stack Developer</span>
      <span>${data.personal.email} • ${data.personal.phone}</span>
    </footer>
  </div>
  `.trim();

  if (!standalone) {
    return cvMarkup;
  }

  return `
<!DOCTYPE html>
<html lang="${language}" data-theme="${theme}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${data.personal.name} — Curriculum Vitae</title>
  <link rel="icon" type="image/png" sizes="256x256" href="/favicon.png?v=5" />
  <link rel="shortcut icon" href="/favicon.ico?v=5" />
  <link rel="apple-touch-icon" href="/favicon.png?v=5" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    @page {
      size: 210mm 535mm;
      margin: 0mm;
    }
    html, body {
      width: 210mm;
      margin: 0;
      padding: 0;
      background-color: ${theme === "dark" ? "#0b1120" : "#ffffff"};
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    #cv-export-root {
      width: 210mm;
      max-width: 210mm;
      min-height: 535mm;
      padding: 13.5mm 14mm 12.5mm 14mm;
      box-shadow: none;
      border-radius: 0;
    }
  </style>
</head>
<body>
  ${cvMarkup}
</body>
</html>
  `.trim();
}
