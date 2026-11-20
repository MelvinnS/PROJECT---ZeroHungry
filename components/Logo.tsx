import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="Logo Dari Sisa Jadi Nilai"
    >
      {/* Lingkaran dasar lembut */}
      <circle cx="16" cy="16" r="16" fill="#E8F5EC" />
      
      {/* Daun di atas mangkuk (simbol kesegaran & nilai sisa) */}
      <path
        d="M16 6C16 6 18.5 8.5 18.5 11.5C18.5 13.5 17 15 15.5 15C14 15 13 13.8 13 12C13 9.5 16 6 16 6Z"
        fill="#1B6B3A"
      />
      <path
        d="M16.5 10C18.5 9 21.5 10 21.5 12.5C21.5 14.5 19.8 15.8 18 15.5"
        stroke="#1B6B3A"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Mangkuk kuliner di bawah */}
      <path
        d="M8 16C8 16 8.5 24 16 24C23.5 24 24 16 24 16H8Z"
        fill="#1B6B3A"
      />
      
      {/* Kaki mangkuk kecil */}
      <path
        d="M13 24H19V25C19 25.5 18.5 26 18 26H14C13.5 26 13 25.5 13 25V24Z"
        fill="#1B6B3A"
      />
    </svg>
  );
};
