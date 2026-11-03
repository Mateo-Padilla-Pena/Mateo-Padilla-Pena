import React from "react";

interface TechLogoProps {
  logo: string;
  name: string;
  className?: string;
}

const TechLogo: React.FC<TechLogoProps> = ({
  logo,
  name,
  className = "w-6 h-6",
}) => {
  const getLogoSrc = (logoName: string) => {
    const logoMap: { [key: string]: string } = {
      javascript:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      python:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      nestjs: "/logos/nestjs.svg",
      django:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
      expressjs:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
      vuejs:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
      vuetify:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuetify/vuetify-original.svg",
      html5:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
      tailwindcss:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original-wordmark.svg",
      bootstrap:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg",
      firebase:
        "https://raw.githubusercontent.com/devicons/devicon/master/icons/firebase/firebase-plain.svg",
      bigquery:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
      sql: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
      firestore:
        "https://raw.githubusercontent.com/devicons/devicon/master/icons/firebase/firebase-plain.svg",
      googlecloud:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
    };

    return logoMap[logoName] || "";
  };

  const getEmojiFallback = (logoName: string) => {
    const emojiMap: { [key: string]: string } = {
      nestjs: "🪺",
      firebase: "🔥",
      firestore: "📁",
      bigquery: "📊",
    };
    return emojiMap[logoName] || "⚡";
  };

  return (
    <img
      src={getLogoSrc(logo)}
      alt={`${name} logo`}
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = "none";
        const fallback = document.createElement("span");
        fallback.textContent = getEmojiFallback(logo);
        fallback.className = className;
        target.parentNode?.appendChild(fallback);
      }}
    />
  );
};

export default TechLogo;
