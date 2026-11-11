"use client";

import React, { forwardRef, useState, useEffect } from "react";
import type { PortfolioData } from "../../types/portfolio";
import { useLanguage } from "@/contexts/LanguageContext";

interface CvTemplateProps {
  data: PortfolioData;
  language?: "es" | "en";
}

const CvTemplate = forwardRef<HTMLDivElement, CvTemplateProps>(
  ({ data, language: propLanguage }, ref) => {
    const { language: contextLanguage } = useLanguage();
    const activeLang = propLanguage || contextLanguage || "es";

    // State for preloaded base64 avatar to ensure flawless html2canvas rendering
    const [avatarSrc, setAvatarSrc] = useState<string>("/portfolio-image.jpeg");

    useEffect(() => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            setAvatarSrc(canvas.toDataURL("image/jpeg", 0.98));
          }
        } catch (e) {
          console.warn("Could not convert avatar to base64", e);
        }
      };
      img.src = "/portfolio-image.jpeg";
    }, []);

    const labels = {
      es: {
        profile: "Perfil Profesional",
        experience: "Experiencia Profesional",
        projects: "Proyectos Destacados",
        skills: "Habilidades Técnicas",
        backend: "Backend",
        frontend: "Frontend",
        database: "Bases de Datos & Cloud",
        certifications: "Certificaciones",
        languages: "Idiomas",
        native: "Nativo",
        currentRole: "Actualidad",
        pageOf: "Página",
        of: "de",
      },
      en: {
        profile: "Professional Profile",
        experience: "Professional Experience",
        projects: "Featured Projects",
        skills: "Technical Skills",
        backend: "Backend",
        frontend: "Frontend",
        database: "Databases & Cloud",
        certifications: "Certifications",
        languages: "Languages",
        native: "Native",
        currentRole: "Present",
        pageOf: "Page",
        of: "of",
      },
    };

    const l = labels[activeLang] || labels.es;

    if (!data || !data.personal) {
      return null;
    }

    return (
      <div
        id="cv-template-root"
        ref={ref}
        style={{
          width: "210mm",
          backgroundColor: "#ffffff",
          color: "#1e293b",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          lineHeight: "1.45",
          padding: 0,
          margin: 0,
          boxSizing: "border-box",
        }}
      >
        {/* ========================================================= */}
        {/* PAGE 1: HEADER, PROFILE, EXPERIENCE */}
        {/* ========================================================= */}
        <div
          className="cv-page cv-page-1"
          style={{
            width: "210mm",
            height: "296.5mm",
            maxHeight: "296.5mm",
            padding: "12mm 15mm 10mm 15mm",
            boxSizing: "border-box",
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Main Content Area */}
          <div>
            {/* Header Card */}
            <header
              style={{
                background:
                  "linear-gradient(135deg, #1e40af 0%, #2563eb 55%, #1d4ed8 100%)",
                color: "#ffffff",
                borderRadius: "14px",
                padding: "18px 22px",
                boxShadow: "0 4px 18px rgba(37, 99, 235, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                {/* Avatar Photo */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <img
                    src={avatarSrc}
                    alt={data.personal.name}
                    crossOrigin="anonymous"
                    style={{
                      width: "78px",
                      height: "78px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "3px solid #ffffff",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
                      display: "block",
                    }}
                  />
                </div>

                {/* Info Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h1
                    style={{
                      fontSize: "23px",
                      fontWeight: 800,
                      letterSpacing: "-0.4px",
                      margin: "0 0 2px 0",
                      color: "#ffffff",
                    }}
                  >
                    {data.personal.name}
                  </h1>
                  <p
                    style={{
                      fontSize: "13.5px",
                      fontWeight: 600,
                      color: "#bfdbfe",
                      margin: "0 0 8px 0",
                      letterSpacing: "0.2px",
                    }}
                  >
                    {data.personal.role}
                  </p>

                  {/* Links Row */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: "14px",
                      fontSize: "11px",
                      color: "#f8fafc",
                      margin: "0 0 4px 0",
                    }}
                  >
                    {data.personal.linkedin && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.63 1.63 0 0 0-1.63 1.63c0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63 0-.9-.73-1.63-1.63-1.63Z" />
                        </svg>
                        <span>{data.personal.linkedin}</span>
                      </span>
                    )}
                    {data.personal.linkedin && data.personal.github && (
                      <span style={{ opacity: 0.4 }}>•</span>
                    )}
                    {data.personal.github && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
                        </svg>
                        <span>{data.personal.github}</span>
                      </span>
                    )}
                  </div>

                  {/* Contact Row */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: "12px",
                      fontSize: "10.8px",
                      color: "#e2e8f0",
                    }}
                  >
                    {data.personal.location && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3.5px",
                        }}
                      >
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>{data.personal.location}</span>
                      </span>
                    )}
                    {data.personal.location && data.personal.email && (
                      <span style={{ opacity: 0.4 }}>•</span>
                    )}
                    {data.personal.email && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3.5px",
                        }}
                      >
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        <span>{data.personal.email}</span>
                      </span>
                    )}
                    {data.personal.email && data.personal.phone && (
                      <span style={{ opacity: 0.4 }}>•</span>
                    )}
                    {data.personal.phone && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3.5px",
                        }}
                      >
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        <span>{data.personal.phone}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </header>

            {/* Profile Section */}
            {data.personal.bio && (
              <section style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "7px",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "12.5px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.8px",
                      color: "#0f172a",
                      margin: 0,
                    }}
                  >
                    {l.profile}
                  </h2>
                  <div
                    style={{
                      flexGrow: 1,
                      height: "1px",
                      backgroundColor: "#e2e8f0",
                    }}
                  />
                </div>
                <div
                  style={{
                    backgroundColor: "#f8fafc",
                    borderLeft: "3.5px solid #2563eb",
                    borderTop: "1px solid #e2e8f0",
                    borderRight: "1px solid #e2e8f0",
                    borderBottom: "1px solid #e2e8f0",
                    padding: "9px 13px",
                    borderRadius: "0 8px 8px 0",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "11px",
                      color: "#334155",
                      lineHeight: "1.52",
                    }}
                  >
                    {data.personal.bio}
                  </p>
                </div>
              </section>
            )}

            {/* Professional Experience Section */}
            {data.experience && data.experience.length > 0 && (
              <section style={{ marginBottom: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "12.5px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.8px",
                      color: "#0f172a",
                      margin: 0,
                    }}
                  >
                    {l.experience}
                  </h2>
                  <div
                    style={{
                      flexGrow: 1,
                      height: "1px",
                      backgroundColor: "#e2e8f0",
                    }}
                  />
                </div>

                <div>
                  {data.experience.map((exp, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: "relative",
                        paddingLeft: "18px",
                        paddingBottom: idx === data.experience.length - 1 ? "4px" : "14px",
                        borderLeft: "2px solid #2563eb",
                      }}
                    >
                      {/* Timeline Node Dot */}
                      <div
                        style={{
                          position: "absolute",
                          left: "-5.5px",
                          top: "4px",
                          width: "9px",
                          height: "9px",
                          backgroundColor: "#2563eb",
                          borderRadius: "50%",
                          border: "2px solid #ffffff",
                          boxShadow: "0 0 0 1.5px #bfdbfe",
                        }}
                      />

                      {/* Header Row: Title & Dates */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "2px",
                        }}
                      >
                        <div>
                          <h3
                            style={{
                              fontSize: "13.5px",
                              fontWeight: 700,
                              color: "#1d4ed8",
                              margin: "0 0 1px 0",
                            }}
                          >
                            {exp.position}
                          </h3>
                          <h4
                            style={{
                              fontSize: "12px",
                              fontWeight: 600,
                              color: "#0f172a",
                              margin: "0 0 1px 0",
                            }}
                          >
                            {exp.company}
                          </h4>
                          <p
                            style={{
                              fontSize: "10.5px",
                              color: "#64748b",
                              fontStyle: "italic",
                              margin: 0,
                            }}
                          >
                            {exp.location}
                          </p>
                        </div>
                        <span
                          style={{
                            backgroundColor: "#dbeafe",
                            color: "#1e40af",
                            fontSize: "10px",
                            fontWeight: 600,
                            padding: "2.5px 9px",
                            borderRadius: "12px",
                            border: "1px solid #bfdbfe",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {exp.period}
                        </span>
                      </div>

                      {/* Job Description */}
                      <p
                        style={{
                          fontSize: "10.8px",
                          color: "#334155",
                          margin: "5px 0 6px 0",
                          lineHeight: "1.48",
                        }}
                      >
                        {exp.description}
                      </p>

                      {/* Achievements List */}
                      {exp.achievements && exp.achievements.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "2.5px" }}>
                          {exp.achievements.map((ach, i) => (
                            <div
                              key={i}
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "6px",
                                fontSize: "10.4px",
                                color: "#475569",
                                lineHeight: "1.42",
                              }}
                            >
                              <span
                                style={{
                                  color: "#2563eb",
                                  fontWeight: "bold",
                                  lineHeight: "1",
                                  marginTop: "2px",
                                }}
                              >
                                •
                              </span>
                              <span>{ach}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Page 1 Footer */}
          <footer
            style={{
              borderTop: "1px solid #e2e8f0",
              paddingTop: "6px",
              marginTop: "4px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "9.5px",
              color: "#94a3b8",
            }}
          >
            <span>
              {data.personal.name} • {data.personal.role}
            </span>
            <span>
              {l.pageOf} 1 {l.of} 2
            </span>
          </footer>
        </div>

        {/* ========================================================= */}
        {/* CSS PAGE BREAK FOR HTML2PDF */}
        {/* ========================================================= */}
        <div
          className="html2pdf__page-break"
          style={{
            pageBreakBefore: "always",
            breakBefore: "page",
            height: 0,
            margin: 0,
            padding: 0,
          }}
        />

        {/* ========================================================= */}
        {/* PAGE 2: PROJECTS, SKILLS, LANGUAGES, CERTIFICATIONS */}
        {/* ========================================================= */}
        <div
          className="cv-page cv-page-2"
          style={{
            width: "210mm",
            height: "296.5mm",
            maxHeight: "296.5mm",
            padding: "12mm 15mm 10mm 15mm",
            boxSizing: "border-box",
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Main Content Area */}
          <div>
            {/* Featured Projects Section */}
            {data.projects && data.projects.length > 0 && (
              <section style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "12.5px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.8px",
                      color: "#0f172a",
                      margin: 0,
                    }}
                  >
                    {l.projects}
                  </h2>
                  <div
                    style={{
                      flexGrow: 1,
                      height: "1px",
                      backgroundColor: "#e2e8f0",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "9px",
                  }}
                >
                  {data.projects.slice(0, 3).map((proj, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        padding: "9px 13px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "4px",
                        }}
                      >
                        <h3
                          style={{
                            fontSize: "12.5px",
                            fontWeight: 700,
                            color: "#1d4ed8",
                            margin: 0,
                          }}
                        >
                          {proj.title}
                        </h3>
                        {proj.sector && (
                          <span
                            style={{
                              fontSize: "9.5px",
                              color: "#475569",
                              backgroundColor: "#ffffff",
                              border: "1px solid #cbd5e1",
                              padding: "2px 7px",
                              borderRadius: "4px",
                              fontWeight: 500,
                            }}
                          >
                            {proj.sector}
                          </span>
                        )}
                      </div>
                      <p
                        style={{
                          fontSize: "10.6px",
                          color: "#475569",
                          margin: "0 0 6px 0",
                          lineHeight: "1.45",
                        }}
                      >
                        {proj.description}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "4px",
                        }}
                      >
                        {proj.tech.map((t, i) => (
                          <span
                            key={i}
                            style={{
                              backgroundColor: "#ffffff",
                              color: "#334155",
                              padding: "1.5px 6.5px",
                              borderRadius: "4px",
                              fontSize: "9.5px",
                              fontWeight: 500,
                              border: "1px solid #cbd5e1",
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Two Column Layout: Skills (Left) & Languages + Certifications (Right) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              {/* Left Column: Skills */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "12px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.8px",
                      color: "#0f172a",
                      margin: 0,
                    }}
                  >
                    {l.skills}
                  </h2>
                  <div
                    style={{
                      flexGrow: 1,
                      height: "1px",
                      backgroundColor: "#e2e8f0",
                    }}
                  />
                </div>

                {/* Backend Skills */}
                {data.about?.skills?.backend && (
                  <div style={{ marginBottom: "8px" }}>
                    <h3
                      style={{
                        fontSize: "10.5px",
                        fontWeight: 700,
                        color: "#1d4ed8",
                        margin: "0 0 4px 0",
                      }}
                    >
                      {l.backend}
                    </h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {data.about.skills.backend.map((s, i) => (
                        <span
                          key={i}
                          style={{
                            backgroundColor: "#eff6ff",
                            color: "#1d4ed8",
                            padding: "2px 7px",
                            borderRadius: "4px",
                            fontSize: "10px",
                            fontWeight: 500,
                            border: "1px solid #bfdbfe",
                          }}
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Frontend Skills */}
                {data.about?.skills?.frontend && (
                  <div style={{ marginBottom: "8px" }}>
                    <h3
                      style={{
                        fontSize: "10.5px",
                        fontWeight: 700,
                        color: "#15803d",
                        margin: "0 0 4px 0",
                      }}
                    >
                      {l.frontend}
                    </h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {data.about.skills.frontend.map((s, i) => (
                        <span
                          key={i}
                          style={{
                            backgroundColor: "#f0fdf4",
                            color: "#15803d",
                            padding: "2px 7px",
                            borderRadius: "4px",
                            fontSize: "10px",
                            fontWeight: 500,
                            border: "1px solid #bbf7d0",
                          }}
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Databases & Cloud */}
                {data.about?.skills?.services && (
                  <div style={{ marginBottom: "8px" }}>
                    <h3
                      style={{
                        fontSize: "10.5px",
                        fontWeight: 700,
                        color: "#c2410c",
                        margin: "0 0 4px 0",
                      }}
                    >
                      {l.database}
                    </h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {data.about.skills.services.map((s, i) => (
                        <span
                          key={i}
                          style={{
                            backgroundColor: "#fff7ed",
                            color: "#c2410c",
                            padding: "2px 7px",
                            borderRadius: "4px",
                            fontSize: "10px",
                            fontWeight: 500,
                            border: "1px solid #fed7aa",
                          }}
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Languages & Certifications */}
              <div>
                {/* Languages */}
                <div style={{ marginBottom: "14px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "12px",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                        color: "#0f172a",
                        margin: 0,
                      }}
                    >
                      {l.languages}
                    </h2>
                    <div
                      style={{
                        flexGrow: 1,
                        height: "1px",
                        backgroundColor: "#e2e8f0",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {/* Spanish */}
                    <div
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: "6px",
                        padding: "5px 9px",
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "10.8px",
                          fontWeight: 600,
                          color: "#1d4ed8",
                        }}
                      >
                        <span>{activeLang === "es" ? "Español" : "Spanish"}</span>
                        <span style={{ fontSize: "9.8px", color: "#64748b", fontWeight: 500 }}>
                          {l.native}
                        </span>
                      </div>
                      <div
                        style={{
                          marginTop: "4px",
                          backgroundColor: "#2563eb",
                          height: "3.5px",
                          borderRadius: "2px",
                          width: "100%",
                        }}
                      />
                    </div>

                    {/* English */}
                    <div
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: "6px",
                        padding: "5px 9px",
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "10.8px",
                          fontWeight: 600,
                          color: "#1d4ed8",
                        }}
                      >
                        <span>English</span>
                        <span style={{ fontSize: "9.8px", color: "#64748b", fontWeight: 500 }}>
                          B2 - Professional
                        </span>
                      </div>
                      <div
                        style={{
                          marginTop: "4px",
                          backgroundColor: "#e2e8f0",
                          height: "3.5px",
                          borderRadius: "2px",
                          width: "100%",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: "#2563eb",
                            height: "100%",
                            width: "75%",
                            borderRadius: "2px",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "12px",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                        color: "#0f172a",
                        margin: 0,
                      }}
                    >
                      {l.certifications}
                    </h2>
                    <div
                      style={{
                        flexGrow: 1,
                        height: "1px",
                        backgroundColor: "#e2e8f0",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {[
                      "Rest API Intermediate — HackerRank",
                      "JavaScript Intermediate — HackerRank",
                      "Python & Problem Solving Basic — HackerRank",
                      "Java Architecture — Edutin Academy",
                    ].map((cert, cIdx) => (
                      <div
                        key={cIdx}
                        style={{
                          backgroundColor: "#f8fafc",
                          borderLeft: "3px solid #2563eb",
                          borderTop: "1px solid #e2e8f0",
                          borderRight: "1px solid #e2e8f0",
                          borderBottom: "1px solid #e2e8f0",
                          padding: "4px 8px",
                          fontSize: "10px",
                          color: "#334155",
                          borderRadius: "0 4px 4px 0",
                          fontWeight: 500,
                        }}
                      >
                        {cert}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page 2 Footer */}
          <footer
            style={{
              borderTop: "1px solid #e2e8f0",
              paddingTop: "6px",
              marginTop: "4px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "9.5px",
              color: "#94a3b8",
            }}
          >
            <span>
              {data.personal.name} • {data.personal.role}
            </span>
            <span>
              {l.pageOf} 2 {l.of} 2
            </span>
          </footer>
        </div>
      </div>
    );
  }
);

CvTemplate.displayName = "CvTemplate";

export default CvTemplate;
