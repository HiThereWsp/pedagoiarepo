import React, { useState, useEffect } from 'react';

const phrases = [
  "adapter vos cours",
  "préparer vos cours plus efficacement",
  "différencier vos exercices",
  "effectuer vos tâches administratives"
];

export function DynamicText() {
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
      className={`bg-gradient-to-r from-[#FFD700] to-[#FF69B4] bg-clip-text text-transparent inline-block transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {phrases[currentIndex]}
    </span>
  );
}