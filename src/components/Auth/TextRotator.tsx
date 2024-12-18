import React, { useState, useEffect } from 'react';

export function TextRotator() {
  const phrases = [
    "préparer vos cours",
    "gagner du temps",
    "adapter votre contenu",
    "différencier vos apprentissages"
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % phrases.length);
        setIsVisible(true);
      }, 500);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <span 
      className={`text-[#FF9633] inline-block transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {phrases[currentIndex]}
    </span>
  );
}