import React from "react";

interface TechLogoProps {
  logo: string;
  name: string;
  className?: string;
}

const TechLogo: React.FC<TechLogoProps> = ({
  logo,
  name,
  className = "w-5 h-5",
}) => {
  const normalized = logo.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Fast inline crisp SVG icons (0 HTTP network requests, 0ms external latency)
  switch (normalized) {
    case "javascript":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <rect width="24" height="24" rx="4" fill="#F7DF1E" />
          <path
            d="M6 18.5V14.5M6 18.5C6 19.5 7 20 8.5 20C10 20 11 19 11 17.5V10M13.5 19C14.5 19.8 16 20.2 17.5 19.5C18.8 18.8 19 17.5 18.5 16.5C18 15.5 16.5 15 15 14.5C13.5 14 13 13 13.5 12C14 11 15 10.5 16.5 10.8C17.5 11 18.5 11.5 19 12"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );

    case "python":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path
            d="M11.8 2C6.7 2 7 4.2 7 4.2V6.5H12V7.3H5.2C3.1 7.3 2 8.5 2 11.5C2 14.5 3.3 14.8 4.2 14.8H5.5V12.7C5.5 10.2 7.7 10.2 7.7 10.2H12.7C15 10.2 15 8 15 8V4.2C15 2 11.8 2 11.8 2ZM9.5 3.6C10.1 3.6 10.6 4.1 10.6 4.7C10.6 5.3 10.1 5.8 9.5 5.8C8.9 5.8 8.4 5.3 8.4 4.7C8.4 4.1 8.9 3.6 9.5 3.6Z"
            fill="#3776AB"
          />
          <path
            d="M12.2 22C17.3 22 17 19.8 17 19.8V17.5H12V16.7H18.8C20.9 16.7 22 15.5 22 12.5C22 9.5 20.7 9.2 19.8 9.2H18.5V11.3C18.5 13.8 16.3 13.8 16.3 13.8H11.3C9 13.8 9 16 9 16V19.8C9 22 12.2 22 12.2 22ZM14.5 20.4C13.9 20.4 13.4 19.9 13.4 19.3C13.4 18.7 13.9 18.2 14.5 18.2C15.1 18.2 15.6 18.7 15.6 19.3C15.6 19.9 15.1 20.4 14.5 20.4Z"
            fill="#FFD43B"
          />
        </svg>
      );

    case "nestjs":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path
            d="M12 2L3 7V17L12 22L21 17V7L12 2Z"
            stroke="#E0234E"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M12 6L7 11V16L12 19L17 16V11L12 6Z"
            fill="#E0234E"
          />
        </svg>
      );

    case "vuejs":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M2 3H6L12 13.5L18 3H22L12 21L2 3Z" fill="#42B883" />
          <path d="M6.5 3H10L12 6.5L14 3H17.5L12 13L6.5 3Z" fill="#35495E" />
        </svg>
      );

    case "tailwindcss":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#38BDF8">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" />
        </svg>
      );

    case "vuetify":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M12 2L2 20H8.5L12 13.5L15.5 20H22L12 2Z" fill="#1867C0" />
          <path d="M12 7L6 18H10L12 14L14 18H18L12 7Z" fill="#AEDDFF" />
        </svg>
      );

    case "html5":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M4 2L5.8 20.2L12 22L18.2 20.2L20 2H4Z" fill="#E34F26" />
          <path d="M12 3.7V20.2L16.8 18.8L18.3 3.7H12Z" fill="#EF652A" />
          <path d="M7.7 7.4H16.3L15.9 11.2H12V13H15.7L15.3 16.8L12 17.8V15.9L13.7 15.4L13.9 13.8H8L7.7 7.4Z" fill="#FFFFFF" />
        </svg>
      );

    case "bootstrap":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <rect width="24" height="24" rx="5" fill="#7952B3" />
          <path
            d="M8 6H13.2C15.1 6 16.5 7.1 16.5 8.7C16.5 9.8 15.9 10.8 14.8 11.2C16.3 11.6 17 12.7 17 14.1C17 16 15.4 17.2 13.3 17.2H8V6ZM10.5 8V10.6H13C13.8 10.6 14.3 10.1 14.3 9.3C14.3 8.5 13.8 8 13 8H10.5ZM10.5 12.6V15.2H13.2C14.1 15.2 14.7 14.6 14.7 13.9C14.7 13.1 14.1 12.6 13.2 12.6H10.5Z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case "django":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <rect width="24" height="24" rx="4" fill="#092E20" />
          <text
            x="50%"
            y="65%"
            textAnchor="middle"
            fill="#44B78B"
            fontSize="10"
            fontWeight="bold"
            fontFamily="monospace"
          >
            dj
          </text>
        </svg>
      );

    case "expressjs":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <rect width="24" height="24" rx="4" className="fill-secondary border border-border" />
          <text
            x="50%"
            y="65%"
            textAnchor="middle"
            className="fill-foreground font-mono font-bold"
            fontSize="9"
          >
            ex
          </text>
        </svg>
      );

    case "firebase":
    case "firestore":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M4.5 17.5L6.5 4.5L10 11L4.5 17.5Z" fill="#FFA000" />
          <path d="M12 2.5L14 7L10 11L12 2.5Z" fill="#FFCA28" />
          <path d="M4.5 17.5L12 22L19.5 17.5L16 12L12 16L4.5 17.5Z" fill="#F57C00" />
        </svg>
      );

    case "googlecloud":
    case "bigquery":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" fill="#4285F4" />
          <path d="M12 10.5V17.5M8.5 14H15.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case "sql":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <ellipse cx="12" cy="5" rx="9" ry="3" fill="#00758F" />
          <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5" stroke="#00758F" strokeWidth="2" />
          <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6" stroke="#00758F" strokeWidth="2" />
        </svg>
      );

    default:
      return (
        <span className="flex items-center justify-center w-5 h-5 rounded bg-primary/10 text-primary text-[10px] font-mono font-bold">
          {name.slice(0, 2).toUpperCase()}
        </span>
      );
  }
};

export default TechLogo;
