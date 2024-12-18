import React from 'react';

interface LogoProps {
  className?: string;
}

export function Logo({ className = "w-14 h-14" }: LogoProps) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Bolt Logo"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19 2H5C3.34315 2 2 3.34315 2 5V15C2 16.6569 3.34315 18 5 18H7V22L11.8906 18H19C20.6569 18 22 16.6569 22 15V5C22 3.34315 20.6569 2 19 2ZM5 4C4.44772 4 4 4.44772 4 5V15C4 15.5523 4.44772 16 5 16H8.10942L11 18.2639V16H19C19.5523 16 20 15.5523 20 15V5C20 4.44772 19.5523 4 19 4H5Z"
        className="fill-white"
      />
      <path
        d="M7 8C7 7.44772 7.44772 7 8 7H16C16.5523 7 17 7.44772 17 8C17 8.55228 16.5523 9 16 9H8C7.44772 9 7 8.55228 7 8Z"
        className="fill-white"
      />
      <path
        d="M7 12C7 11.4477 7.44772 11 8 11H12C12.5523 11 13 11.4477 13 12C13 12.5523 12.5523 13 12 13H8C7.44772 13 7 12.5523 7 12Z"
        className="fill-white"
      />
    </svg>
  );
}